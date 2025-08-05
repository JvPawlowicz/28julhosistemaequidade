import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MedicalRecordTabs from "@/components/MedicalRecordTabs";
import { usePermissions } from "@/contexts/usePermissions";
import { 
  ArrowLeft,
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  FileText,
  Heart,
  Activity,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  Edit,
  Plus
} from "lucide-react";
import type { Evolution } from "../../types/Evolution";
import { Tables, Enums } from "@/integrations/supabase/types";
import { Loading } from "@/components/ui/loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Patient = Tables<'patients'> & {
  guardians?: Pick<Tables<'guardians'>, 'full_name' | 'email' | 'phone' | 'address'> | null;
  units?: Pick<Tables<'units'>, 'name'> | null;
};

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    frequencia: 0,
    faltas: 0,
    ultimaConsulta: null as string | null,
    proximaConsulta: null as string | null,
    historico: [] as any[],
  });

  const fetchPatientData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          guardians(full_name, email, phone, address),
          units(name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setPatient(data);

      // Fetch appointment metrics
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select('appointment_date, status, specialty, profiles(full_name)')
        .eq('patient_id', id)
        .order('appointment_date', { ascending: false });

      if (appointmentsError) throw appointmentsError;

      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);

      const recentAppointments = appointments.filter(apt => new Date(apt.appointment_date) >= lastMonth);
      const realizados = recentAppointments.filter(apt => apt.status === 'realizado').length;
      const faltas = recentAppointments.filter(apt => apt.status === 'falta').length;
      const totalConsidered = realizados + faltas;
      const frequencia = totalConsidered > 0 ? Math.round((realizados / totalConsidered) * 100) : 100;

      const ultimaConsulta = appointments.find(apt => new Date(apt.appointment_date) <= today && apt.status === 'realizado');
      const proximaConsulta = [...appointments].reverse().find(apt => new Date(apt.appointment_date) > today && (apt.status === 'agendado' || apt.status === 'confirmado'));

      setMetrics({
        frequencia,
        faltas,
        ultimaConsulta: ultimaConsulta?.appointment_date || null,
        proximaConsulta: proximaConsulta?.appointment_date || null,
        historico: appointments.slice(0, 3).map(apt => ({
          data: apt.appointment_date,
          tipo: apt.specialty,
          profissional: (apt.profiles as any)?.full_name || 'N/A',
          status: apt.status
        })),
      });

    } catch (error) {
      console.error('Error fetching patient data:', error);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    fetchPatientData();
  }, [id, fetchPatientData]);

  const canViewClinical = hasPermission('clinical_records', 'view');
  const canEditPatient = hasPermission('pacientes', 'update');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Paciente não encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Não foi possível carregar os dados do paciente com o ID: {id}.
            </p>
            <Button onClick={() => navigate("/app/pacientes")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Pacientes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/app/pacientes")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-primary">{patient.full_name}</h1>
          <p className="text-muted-foreground">
            {patient.birth_date ? `${new Date().getFullYear() - new Date(patient.birth_date).getFullYear()} anos` : 'N/A'} • {patient.diagnosis}
          </p>
        </div>
        <div className="flex gap-2">
          {canEditPatient && (
            <Button variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar Dados
            </Button>
          )}
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Agendar
          </Button>
        </div>
      </div>

      {/* Alertas de Risco */}
      <div className="space-y-2">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Risco de Fuga (Alto)</AlertTitle>
          <AlertDescription>
            Paciente tem histórico de tentativas de fuga. Acompanhamento constante necessário em áreas abertas.
          </AlertDescription>
        </Alert>
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Alergia a Amendoim (Médio)</AlertTitle>
          <AlertDescription>
            Evitar qualquer alimento que contenha amendoim ou traços.
          </AlertDescription>
        </Alert>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="prontuario" disabled={!canViewClinical}>
            Prontuário
          </TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="font-medium">{patient.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">{patient.birth_date ? new Date(patient.birth_date).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diagnóstico</p>
                  <p className="font-medium">{patient.diagnosis || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge>Ativo</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Responsável */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Responsável
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{patient.guardians?.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {patient.guardians?.phone || patient.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {patient.guardians?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {patient.guardians?.address || patient.address || 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Métricas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Indicadores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Frequência (mês)</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-success">{metrics.frequencia}%</p>
                  </div>
                </div>
                <div className="w-full bg-medical-gray rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full"
                    style={{ width: `${metrics.frequencia}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Faltas no mês</span>
                  <Badge variant={metrics.faltas > 2 ? "destructive" : "outline"}>
                    {metrics.faltas}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Última Consulta</p>
                  <p className="font-medium">{metrics.ultimaConsulta ? new Date(metrics.ultimaConsulta).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Próxima Consulta</p>
                  <p className="font-medium">{metrics.proximaConsulta ? new Date(metrics.proximaConsulta).toLocaleDateString('pt-BR') : 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Histórico Recente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.historico.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-medical-gray rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'realizado' ? 'bg-success' : 'bg-destructive'
                      }`} />
                      <div>
                        <p className="font-medium">{item.tipo} - {item.profissional}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.data).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <Badge>{item.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {patient.observations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Observações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{patient.observations}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Prontuário Médico */}
        <TabsContent value="prontuario">
          {canViewClinical ? (
            <MedicalRecordTabs patientId={id!} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
                <p className="text-muted-foreground">
                  Você não tem permissão para visualizar dados clínicos deste paciente.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Agenda do Paciente */}
        <TabsContent value="agenda">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Agenda do Paciente
                </span>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Agendamento
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Funcionalidade de agenda específica do paciente será implementada aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Informações de Contato */}
        <TabsContent value="contato">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contato e Comunicação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Histórico de comunicações e ferramentas de contato serão implementadas aqui.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientProfile;