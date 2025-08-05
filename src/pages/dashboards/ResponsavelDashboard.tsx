import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Heart,
  User
} from "lucide-react";
import { FamilyReports } from "@/components/FamilyReports";
import { FamilyMessaging } from "@/components/FamilyMessaging";
import { useAuth } from '@/contexts/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loading } from '@/components/ui/loading';
import { Tables } from '@/integrations/supabase/types';

type Patient = Tables<'patients'>;
type Appointment = Tables<'appointments'>;

const ResponsavelDashboard = () => {
  const { user } = useAuth();
  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchGuardianData = async () => {
      if (!user) return;

      try {
        // 1. Encontrar o registro do responsável ligado ao usuário de autenticação
        const { data: guardianData, error: guardianError } = await supabase
          .from('guardians')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (guardianError || !guardianData) {
          console.error("Nenhum perfil de responsável encontrado para este usuário.");
          setLoading(false);
          return;
        }

        // 2. Encontrar o paciente associado a este responsável (assumindo um por enquanto)
        const { data: patientGuardianLink, error: linkError } = await supabase
          .from('patient_guardians')
          .select('patient_id')
          .eq('guardian_id', guardianData.id)
          .limit(1)
          .single();

        if (linkError || !patientGuardianLink) {
          console.error("Nenhum paciente associado a este responsável.");
          setLoading(false);
          return;
        }

        const patientId = patientGuardianLink.patient_id;

        // 3. Buscar detalhes do paciente e seus próximos agendamentos
        const today = new Date().toISOString().split('T')[0];
        const [
          { data: patientData, error: patientError },
          { data: appointmentsData, error: appointmentsError }
        ] = await Promise.all([
          supabase.from('patients').select('*').eq('id', patientId).single(),
          supabase.from('appointments').select('*').eq('patient_id', patientId).gte('appointment_date', today).order('appointment_date').limit(2)
        ]);

        if (patientError) throw patientError;
        if (appointmentsError) throw appointmentsError;

        setPatient(patientData);
        setAppointments(appointmentsData || []);
      } catch (error) {
        console.error("Erro ao buscar dados do responsável:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuardianData();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (!patient) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold">Nenhum paciente encontrado</h3>
          <p className="text-muted-foreground">Não foi possível encontrar um paciente associado à sua conta.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Heart className="h-8 w-8" />
          Portal das Famílias
        </h1>
        <p className="text-muted-foreground">
          Acompanhamento completo do desenvolvimento de {patient.full_name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <FamilyReports />
          <FamilyMessaging />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Resumo de {patient.full_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <p><span className="font-semibold">Idade:</span> {new Date().getFullYear() - new Date(patient.birth_date).getFullYear()} anos</p>
                <p><span className="font-semibold">Condição:</span> {patient.diagnosis}</p>
              </div>
              <Button variant="outline" className="w-full">Ver Plano Terapêutico</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.length > 0 ? appointments.map((agendamento) => (
                  <div key={agendamento.id} className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold capitalize">{agendamento.specialty.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(agendamento.appointment_date + 'T' + agendamento.start_time).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">Nenhum agendamento futuro.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResponsavelDashboard;