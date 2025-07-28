import { useState } from "react";
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
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SmartScheduler } from "@/components/SmartScheduler";

interface Appointment {
  id: string;
  date: string;
  status: string;
  // Adicione outros campos conforme necessário
}

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showSmartScheduler, setShowSmartScheduler] = useState(false);
  const { toast } = useToast();
  const { currentUnit } = useMultiTenant();
  const { isAdmin, getUserRole } = usePermissions();

  // Mock agenda data with enhanced information
  const appointments = [
    {
      id: 1,
      date: "2024-01-15",
      startTime: "08:00",
      endTime: "09:00", 
      patient: "João Silva Santos",
      idade: 12,
      therapist: "Dra. Ana Costa",
      type: "Individual",
      room: "Sala 3",
      status: "confirmado",
      specialty: "Psicologia",
      telefone: "(11) 99999-1111",
      convenio: "Particular",
      preco: "R$ 120,00",
      procedimento: "Terapia Comportamental",
      observacoes: "Primeira sessão do mês"
    },
    {
      id: 2,
      date: "2024-01-15",
      startTime: "09:00",
      endTime: "10:00",
      patient: "Maria Santos Oliveira", 
      idade: 8,
      therapist: "TO. Carlos Lima",
      type: "Individual",
      room: "Sala 5",
      status: "realizado",
      specialty: "Terapia Ocupacional",
      telefone: "(11) 99999-2222",
      convenio: "Unimed",
      preco: "Convênio",
      procedimento: "Integração Sensorial",
      observacoes: "Evolução excelente"
    },
    {
      id: 3,
      date: "2024-01-15",
      startTime: "10:30",
      endTime: "11:30",
      patient: "Grupo Habilidades Sociais",
      idade: null,
      therapist: "Dra. Ana Costa",
      type: "Grupo",
      room: "Sala Grande",
      status: "aguardando",
      specialty: "Psicologia",
      telefone: "Múltiplos",
      convenio: "Misto",
      preco: "R$ 80,00/pac",
      procedimento: "Terapia em Grupo",
      observacoes: "4 crianças participantes"
    },
    {
      id: 4,
      date: "2024-01-16",
      startTime: "14:00",
      endTime: "15:00",
      patient: "Pedro Costa",
      idade: 15,
      therapist: "Fga. Paula Silva", 
      type: "Individual",
      room: "Sala 2",
      status: "faltou",
      specialty: "Fonoaudiologia",
      telefone: "(11) 99999-3333",
      convenio: "SulAmérica",
      preco: "Convênio",
      procedimento: "Terapia da Fala",
      observacoes: "Reagendar"
    }
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", 
    "16:00", "16:30", "17:00", "17:30"
  ];

  const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
  const currentWeek = ["13/01", "14/01", "15/01", "16/01", "17/01"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'chegou': return 'bg-success text-success-foreground';
      case 'confirmado': return 'bg-primary text-primary-foreground';
      case 'remarcado': return 'bg-warning text-warning-foreground';
      case 'faltou': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case 'Psicologia': return 'border-l-4 border-l-primary';
      case 'Terapia Ocupacional': return 'border-l-4 border-l-secondary';
      case 'Fonoaudiologia': return 'border-l-4 border-l-warning';
      default: return 'border-l-4 border-l-muted';
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.therapist.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleUpdateStatus = (id: number, newStatus: string) => {
    toast({
      title: "Status atualizado",
      description: `Agendamento marcado como ${newStatus}`
    });
  };

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
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="aguardando">Aguardando</SelectItem>
                <SelectItem value="realizado">Realizado</SelectItem>
                <SelectItem value="faltou">Faltou</SelectItem>
                <SelectItem value="remarcado">Remarcado</SelectItem>
              </SelectContent>
            </Select>

            <Select value="todos">
              <SelectTrigger>
                <SelectValue placeholder="Profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Ana">Dra. Ana Costa</SelectItem>
                <SelectItem value="Carlos">TO. Carlos Lima</SelectItem>
                <SelectItem value="Paula">Fga. Paula Silva</SelectItem>
              </SelectContent>
            </Select>

            <Select value="todas">
              <SelectTrigger>
                <SelectValue placeholder="Sala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="Sala 2">Sala 2</SelectItem>
                <SelectItem value="Sala 3">Sala 3</SelectItem>
                <SelectItem value="Sala 5">Sala 5</SelectItem>
                <SelectItem value="Sala Grande">Sala Grande</SelectItem>
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
            <div className="space-y-3">
              {filteredAppointments.filter(apt => apt.date === "2024-01-15").map((appointment) => (
                <div key={appointment.id} className={`p-4 rounded-lg bg-medical-gray ${getSpecialtyColor(appointment.specialty)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-mono text-primary">
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <Badge variant="outline">{appointment.specialty}</Badge>
                  </div>
                  
                  <h4 className="font-medium mb-1">{appointment.patient}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {appointment.therapist}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {appointment.room}
                    </span>
                    <span>{appointment.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {view === 'week' && (
        <Card>
          <CardHeader>
            <CardTitle>Visão Semanal - 13 a 17 de Janeiro</CardTitle>
          </CardHeader>
          <CardContent>
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
                      apt.date === `2024-01-${13 + dayIndex}` && apt.startTime === time
                    );
                    
                    return (
                      <div key={time} className="h-16 border border-medical-border rounded relative">
                        {appointment && (
                          <div className={`absolute inset-1 p-1 rounded text-xs ${getSpecialtyColor(appointment.specialty)} bg-white`}>
                            <div className="font-medium truncate">{appointment.patient.split(',')[0]}</div>
                            <div className="text-muted-foreground truncate">{appointment.therapist.split('.')[1]}</div>
                            <Badge className={`${getStatusColor(appointment.status)} mt-1`}>
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
            <Badge className="bg-success text-success-foreground">Chegou</Badge>
            <Badge className="bg-primary text-primary-foreground">Confirmado</Badge>
            <Badge className="bg-warning text-warning-foreground">Remarcado</Badge>
            <Badge className="bg-destructive text-destructive-foreground">Faltou</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agenda;