import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, FileText, Calendar, User } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PendingEvolution {
  appointment_id: string;
  patient_name: string;
  appointment_date: string;
  start_time: string;
  specialty: string;
}

const EvolutionNotifications = () => {
  const [pendingEvolutions, setPendingEvolutions] = useState<PendingEvolution[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingEvolutions();
  }, []);

  const fetchPendingEvolutions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar agendamentos realizados sem evolução do terapeuta logado
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          start_time,
          specialty,
          patients!appointments_patient_id_fkey(full_name)
        `)
        .eq('therapist_id', user.id)
        .eq('status', 'realizado')
        .gte('appointment_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // Últimos 7 dias

      if (appointmentsError) throw appointmentsError;

      // Verificar quais não têm evolução
      const appointmentIds = appointments?.map(apt => apt.id) || [];
      
      if (appointmentIds.length > 0) {
        const { data: existingEvolutions, error: evolutionsError } = await supabase
          .from('evolutions')
          .select('appointment_id')
          .in('appointment_id', appointmentIds);

        if (evolutionsError) throw evolutionsError;

        const existingAppointmentIds = existingEvolutions?.map(ev => ev.appointment_id) || [];
        
        const pending = appointments
          ?.filter(apt => !existingAppointmentIds.includes(apt.id))
          .map(apt => ({
            appointment_id: apt.id,
            patient_name: apt.patients?.full_name || 'N/A',
            appointment_date: apt.appointment_date,
            start_time: apt.start_time,
            specialty: apt.specialty
          })) || [];

        setPendingEvolutions(pending);
      }
    } catch (error) {
      console.error('Error fetching pending evolutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvolution = (appointmentId: string, patientName: string) => {
    // Redirecionar para criação de evolução com dados pré-preenchidos
    const searchParams = new URLSearchParams({
      appointment_id: appointmentId,
      patient_name: patientName
    });
    
    window.location.href = `/evolucoes?create=true&${searchParams.toString()}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingEvolutions.length === 0) {
    return null; // Não mostrar se não há pendências
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Bell className="h-5 w-5" />
          Evoluções Pendentes
          <Badge variant="secondary" className="bg-orange-200 text-orange-800">
            {pendingEvolutions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-orange-700 mb-3">
          Você tem sessões realizadas que ainda precisam de evolução:
        </p>
        
        {pendingEvolutions.slice(0, 3).map((pending) => (
          <div key={pending.appointment_id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-orange-600" />
              <div>
                <p className="font-medium text-gray-900">{pending.patient_name}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(pending.appointment_date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {pending.specialty}
                  </span>
                </div>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => handleCreateEvolution(pending.appointment_id, pending.patient_name)}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <FileText className="h-3 w-3 mr-1" />
              Escrever
            </Button>
          </div>
        ))}
        
        {pendingEvolutions.length > 3 && (
          <p className="text-xs text-orange-600 text-center pt-2">
            E mais {pendingEvolutions.length - 3} sessão(ões) pendente(s)
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EvolutionNotifications;