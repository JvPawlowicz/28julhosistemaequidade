import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UnitDataIndicator } from "@/components/UnitDataIndicator";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import { usePermissions } from "@/contexts/usePermissions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Filter,
  MapPin,
  Clock,
  User,
  Search,
  FileText,
  Edit,
  X,
  CheckCircle,
  Phone,
  Download,
  Play,
  Brain,
  Shield // Added Shield import
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SmartScheduler } from "@/components/SmartScheduler";
import { supabase } from "@/integrations/supabase/client";
import { Tables, Enums } from "@/integrations/supabase/types"; // Import Enums

type Appointment = Tables<'appointments'> & {
  patients?: Pick<Tables<'patients'>, 'full_name' | 'phone'> | null; // Pick specific columns
  profiles?: Pick<Tables<'profiles'>, 'full_name'> | null; // Pick specific columns
  rooms?: Pick<Tables<'rooms'>, 'name'> | null; // Pick specific columns
};

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showSmartScheduler, setShowSmartScheduler] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUnit, isAdmin } = useMultiTenant();
  const { getUserRole, hasPermission } = usePermissions();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  // Define more specific types for therapists and rooms
  const [therapists, setTherapists] = useState<Array<Pick<Tables<'profiles'>, 'id' | 'full_name' | 'council_type'>>>([]);
  const [rooms, setRooms] = useState<Array<Pick<Tables<'rooms'>, 'id' | 'name'>>>([]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patients(full_name, phone),
          profiles(full_name),
          rooms(name)
        `)
        .order('start_time', { ascending: true });

      if (!isAdmin() && currentUnit) {
        query = query.eq('unit_id', currentUnit.id);
      }
      if (getUserRole() === 'terapeuta' || getUserRole() === 'estagiario') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('therapist_id', user.id);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erro ao carregar agenda",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, currentUnit, getUserRole, toast]);

  const fetchTherapistsAndRooms = useCallback(async () => {
    try {
      const [{ data: therapistsData, error: therapistsError }, { data: roomsData, error: roomsError }] = await Promise.all([
        // Cast status values to Enums<'user_status'> to match the column type
        supabase.from('profiles').select('id, full_name, council_type').in('status', ['terapeuta', 'estagiario', 'coordenador'] as Enums<'user_status'>[]),
        supabase.from('rooms').select('id, name')
      ]);

      if (therapistsError) throw therapistsError;
      if (roomsError) throw roomsError;

      setTherapists(therapistsData || []);
      setRooms(roomsData || []);
    } catch (error) {
      console.error('Error fetching therapists and rooms:', error);
    }
  }, []);

  useEffect(() => {
    if (hasPermission('agenda', 'view')) {
      fetchAppointments();
      fetchTherapistsAndRooms();
    }
  }, [fetchAppointments, fetchTherapistsAndRooms, hasPermission]);

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", 
    "16:00", "16:30", "17:00", "17:30"
  ];

  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  const currentWeek = ["13/01", "14/01", "15/01", "16/01", "17/01"]; // This should be dynamically calculated

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'realizado': return 'bg-success text-success-foreground';
      case 'confirmado': return 'bg-primary text-primary-foreground';
      case 'agendado': return 'bg-warning text-warning-foreground';
      case 'falta': return 'bg-destructive text-destructive-foreground';
      case 'cancelado': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case 'psicologia': return 'border-l-4 border-l-primary';
      case 'terapia_ocupacional': return 'border-l-4 border-l-secondary';
      case 'fonoaudiologia': return 'border-l-4 border-l-warning';
      case 'fisioterapia': return 'border-l-4 border-l-success';
      default: return 'border-l-4 border-l-muted';
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const patientName = apt.patients?.full_name?.toLowerCase() || '';
    const therapistName = apt.profiles?.full_name?.toLowerCase() || '';
    const matchesSearch = patientName.includes(searchTerm.toLowerCase()) ||
                         therapistName.includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleUpdateStatus = async (id: string, newStatus: Tables<'appointments'>['status']) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Status atualizado",
        description: `Agendamento marcado como ${newStatus}`
      });
      fetchAppointments(); // Re-fetch to update UI
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  if (!hasPermission('agenda', 'view')) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="text-center p-8">
          <CardContent>
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              Você não tem permissão para visualizar a agenda.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {isAdmin() ? 'Agenda Global' : getUserRole() === 'terapeuta' ? 'Minha Agenda' : 'Agenda da Unidade'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin() && currentUnit ? `Visualizando: ${currentUnit.name}` : 'Gerencie atendimentos'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Dialog open={showSmartScheduler} onOpenChange={setShowSmartScheduler}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <Brain className="h-4 w-4" />
                Agendamento Inteligente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agendamento Inteligente Coordenado</DialogTitle>
              </DialogHeader>
              <SmartScheduler />
            </DialogContent>
          </Dialog>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      {/* Indicador de dados filtrados */}
      <UnitDataIndicator />

      {/* Filtros Avançados */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar paciente ou profissional..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value="todos">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos Status</SelectItem>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="realizado">Realizado</SelectItem>
                <SelectItem value="falta">Faltou</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value="todos">
              <SelectTrigger>
                <SelectValue placeholder="Profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {therapists.map(therapist => (
                  <SelectItem key={therapist.id} value={therapist.id}>
                    {therapist.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value="todas">
              <SelectTrigger>
                <SelectValue placeholder="Sala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {rooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="gap-2">
              <Filter className="h-4 w-4" />
              Aplicar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold">Janeiro 2024</h3>
                <Button size="sm" variant="ghost">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant={view === 'day' ? 'default' : 'outline'}
                onClick={() => setView('day')}
              >
                Dia
              </Button>
              <Button 
                size="sm" 
                variant={view === 'week' ? 'default' : 'outline'}
                onClick={() => setView('week')}
              >
                Semana
              </Button>
              <Button 
                size="sm" 
                variant={view === 'month' ? 'default' : 'outline'}
                onClick={() => setView('month')}
              >
                Mês
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {view === 'day' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Hoje - Terça-feira, 15/01/2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Nenhum agendamento"
                description="Não há agendamentos para o dia selecionado."
              />
            ) : (
              <div className="space-y-3">
                {filteredAppointments.filter(apt => new Date(apt.appointment_date).toDateString() === new Date("2024-01-15").toDateString()).map((appointment) => (
                  <div key={appointment.id} className={`p-4 rounded-lg bg-medical-gray ${getSpecialtyColor(appointment.specialty)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-mono text-primary">
                          {appointment.start_time} - {appointment.end_time}
                        </div>
                        <Badge className={getStatusColor(appointment.status || 'agendado')}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <Badge variant="outline">{appointment.specialty}</Badge>
                    </div>
                    
                    <h4 className="font-medium mb-1">{appointment.patients?.full_name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {appointment.profiles?.full_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {appointment.rooms?.name}
                      </span>
                      {/* Type is not in DB, assuming individual for now */}
                      <span>Individual</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {view === 'week' && (
        <Card>
          <CardHeader>
            <CardTitle>Visão Semanal - 13 a 17 de Janeiro</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Nenhum agendamento"
                description="Não há agendamentos para a semana selecionada."
              />
            ) : (
              <div className="grid grid-cols-6 gap-4">
                {/* Time column */}
                <div className="space-y-2">
                  <div className="h-12 flex items-center justify-center font-medium text-sm">
                    Horário
                  </div>
                  {timeSlots.map((time) => (
                    <div key={time} className="h-16 flex items-center justify-center text-sm text-muted-foreground">
                      {time}
                    </div>
                  ))}
                </div>
                
                {/* Days columns */}
                {days.map((day, dayIndex) => (
                  <div key={day} className="space-y-2">
                    <div className="h-12 flex items-center justify-center bg-medical-gray rounded-lg">
                      <div className="text-center">
                        <div className="font-medium">{day}</div>
                        <div className="text-sm text-muted-foreground">{currentWeek[dayIndex]}</div>
                      </div>
                    </div>
                    
                    {timeSlots.map((time) => {
                      const appointment = appointments.find(apt => 
                        new Date(apt.appointment_date).toDateString() === new Date(`2024-01-${13 + dayIndex}`).toDateString() && apt.start_time === time
                      );
                      
                      return (
                        <div key={time} className="h-16 border border-medical-border rounded relative">
                          {appointment && (
                            <div className={`absolute inset-1 p-1 rounded text-xs ${getSpecialtyColor(appointment.specialty)} bg-white`}>
                              <div className="font-medium truncate">{appointment.patients?.full_name}</div>
                              <div className="text-muted-foreground truncate">{appointment.profiles?.full_name}</div>
                              <Badge className={`${getStatusColor(appointment.status || 'agendado')} mt-1`}>
                                {appointment.status}
                              </Badge>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded"></div>
              <span className="text-sm">Psicologia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-secondary rounded"></div>
              <span className="text-sm">Terapia Ocupacional</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning rounded"></div>
              <span className="text-sm">Fonoaudiologia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success rounded"></div>
              <span className="text-sm">Fisioterapia</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Badge className="bg-success text-success-foreground">Realizado</Badge>
            <Badge className="bg-primary text-primary-foreground">Confirmado</Badge>
            <Badge className="bg-warning text-warning-foreground">Agendado</Badge>
            <Badge className="bg-destructive text-destructive-foreground">Faltou</Badge>
            <Badge className="bg-muted text-muted-foreground">Cancelado</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;