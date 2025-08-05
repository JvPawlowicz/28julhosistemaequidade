import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import { usePermissions } from "@/contexts/usePermissions";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables, Enums } from "@/integrations/supabase/types";
import { Loading } from "@/components/ui/loading";
import { format, startOfWeek, addDays, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Import new modular components
import { AgendaHeader } from "@/components/agenda/AgendaHeader";
import { AgendaFilters } from "@/components/agenda/AgendaFilters";
import { AgendaViewControls } from "@/components/agenda/AgendaViewControls";
import { AgendaDayView } from "@/components/agenda/AgendaDayView";
import { AgendaWeekView } from "@/components/agenda/AgendaWeekView";
import { AgendaLegend } from "@/components/agenda/AgendaLegend";
import { NewAppointmentDialog } from "@/components/agenda/NewAppointmentDialog";
import { Shield } from "lucide-react"; // Import Shield for restricted access
import { UnitDataIndicator } from "@/components/UnitDataIndicator";

type Appointment = Tables<'appointments'> & {
  patients?: Pick<Tables<'patients'>, 'full_name' | 'phone'> | null;
  profiles?: { full_name: string } | null;
  rooms?: Pick<Tables<'rooms'>, 'name'> | null;
};

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterProfessional, setFilterProfessional] = useState("todos");
  const [filterRoom, setFilterRoom] = useState("todas");
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUnit } = useMultiTenant();
  const { getUserRole, hasPermission, isAdmin } = usePermissions();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [therapists, setTherapists] = useState<Array<Pick<Tables<'profiles'>, 'id' | 'full_name' | 'council_type'>>>([]);
  const [rooms, setRooms] = useState<Array<Pick<Tables<'rooms'>, 'id' | 'name'>>>([]);
  const [patients, setPatients] = useState<Array<Pick<Tables<'patients'>, 'id' | 'full_name'>>>([]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      let startDate: Date;
      let endDate: Date;

      if (view === 'day') {
        startDate = currentDate;
        endDate = currentDate;
      } else if (view === 'week') {
        startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
        endDate = addDays(startDate, 4); // Monday to Friday
      } else { // month view
        startDate = startOfMonth(currentDate);
        endDate = endOfMonth(currentDate);
      }

      let query = supabase
        .from('appointments')
        .select(`
          *,
          patients(full_name, phone),
          profiles(full_name),
          rooms(name)
        `)
        .gte('appointment_date', format(startDate, 'yyyy-MM-dd'))
        .lte('appointment_date', format(endDate, 'yyyy-MM-dd'))
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
      if (filterStatus !== 'todos') {
        query = query.eq('status', filterStatus as Enums<'appointment_status'>);
      }
      if (filterProfessional !== 'todos') {
        query = query.eq('therapist_id', filterProfessional);
      }
      if (filterRoom !== 'todas') {
        query = query.eq('room_id', filterRoom);
      }
      if (searchTerm) {
        // This is a simplified search, for real search you might need RLS or a backend function
        query = query.ilike('patients.full_name', `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      const formattedData = (data || []).map(d => ({
        ...d,
        profiles: Array.isArray(d.profiles) ? d.profiles[0] : d.profiles,
      }));
      setAppointments(formattedData as Appointment[]);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erro ao carregar agenda",
        description: "Não foi possível carregar os dados da agenda.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, currentUnit, getUserRole, toast, filterStatus, filterProfessional, filterRoom, searchTerm, currentDate, view]); // Added currentDate and view to dependencies

  const fetchTherapistsRoomsAndPatients = useCallback(async () => {
    try {
      const [{ data: therapistsData, error: therapistsError }, { data: roomsData, error: roomsError }, { data: patientsData, error: patientsError }] = await Promise.all([
        supabase.from('profiles').select('id, full_name, council_type').in('status', ['ativo']),
        supabase.from('rooms').select('id, name'),
        supabase.from('patients').select('id, full_name'),
      ]);

      if (therapistsError) throw therapistsError;
      if (roomsError) throw roomsError;
      if (patientsError) throw patientsError;

      setTherapists(therapistsData || []);
      setRooms(roomsData || []);
      setPatients(patientsData || []);
    } catch (error) {
      console.error('Error fetching therapists, rooms, or patients:', error);
    }
  }, []);

  useEffect(() => {
    if (hasPermission('agenda', 'view')) {
      fetchAppointments();
      fetchTherapistsRoomsAndPatients();
    }
  }, [fetchAppointments, fetchTherapistsRoomsAndPatients, hasPermission]);

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

  const handlePrevNextClick = (direction: 'prev' | 'next') => {
    let newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const currentDateDisplay = (() => {
    if (view === 'day') {
      return format(currentDate, 'EEEE, dd/MM/yyyy', { locale: ptBR });
    } else if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = addDays(start, 4); // Monday to Friday
      return `${format(start, 'dd/MM', { locale: ptBR })} - ${format(end, 'dd/MM/yyyy', { locale: ptBR })}`;
    } else if (view === 'month') {
      return format(currentDate, 'MMMM yyyy', { locale: ptBR });
    }
    return '';
  })();

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
      <AgendaHeader onNewAppointmentClick={() => setIsNewAppointmentDialogOpen(true)} />
      <UnitDataIndicator />
      <AgendaFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterProfessional={filterProfessional}
        setFilterProfessional={setFilterProfessional}
        filterRoom={filterRoom}
        setFilterRoom={setFilterRoom}
        therapists={therapists}
        rooms={rooms}
      />
      <AgendaViewControls
        currentDateDisplay={currentDateDisplay}
        view={view}
        setView={setView}
        onPrevClick={() => handlePrevNextClick('prev')}
        onNextClick={() => handlePrevNextClick('next')}
      />

      {view === 'day' && (
        <AgendaDayView
          appointments={appointments}
          currentDate={currentDate}
          getStatusColor={getStatusColor}
          getSpecialtyColor={getSpecialtyColor}
        />
      )}

      {view === 'week' && (
        <AgendaWeekView
          appointments={appointments}
          currentDate={currentDate}
          getStatusColor={getStatusColor}
          getSpecialtyColor={getSpecialtyColor}
        />
      )}

      {view === 'month' && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Visualização mensal será implementada aqui.
            </p>
          </CardContent>
        </Card>
      )}

      <AgendaLegend />

      <NewAppointmentDialog
        isOpen={isNewAppointmentDialogOpen}
        onOpenChange={setIsNewAppointmentDialogOpen}
        onAppointmentCreated={fetchAppointments}
        patients={patients}
        therapists={therapists}
        rooms={rooms}
        currentUnitId={currentUnit?.id || null}
      />
    </div>
  );
};

export default Agenda;