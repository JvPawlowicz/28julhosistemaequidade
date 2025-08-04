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
import { Tables } from "@/integrations/supabase/types";
import { Loading } from "@/components/ui/loading";

type Patient = Tables<'patients'> & {
  guardians?: Tables<'guardians'>;
  units?: Tables<'units'>;
};

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatientData = useCallback(async () => {
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
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setPatient(null); // Set patient to null on error
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchPatientEvolutions = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('evolutions')
        .select(`
          *,
          profiles!evolutions_professional_id_fkey(full_name, requires_supervision)
        `)
        .eq('patient_id', id)
        .eq('status', 'Finalizada')
        .order('created_at', { ascending: false });
      
      setEvolutions((data || []).map(ev => ({
        ...ev,
        content: ev.content as Evolution['content'],
        supervisors_signature: ev.supervisors_signature as Evolution['supervisors_signature'],
        profiles: ev.profiles as Evolution['profiles']
      })));
    } catch (error) {
      console.error('Error fetching evolutions:', error);
    }
  }, [id]);
  
  useEffect(() => {
    fetchPatientData();
    fetchPatientEvolutions();
  }, [id, fetchPatientData, fetchPatientEvolutions]);

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

  // Mock data for fields not directly from DB for now
  const mockPatientMetrics = {
    frequencia: 95, // Needs calculation from appointments
    faltas: 1, // Needs calculation from appointments
    ultimaConsulta: "2024-01-12", // Needs fetching from appointments
    proximaConsulta: "2024-01-18", // Needs fetching from appointments
    terapeutas: ["Dra. Ana Costa", "TO. Carlos Lima"], // Needs fetching from assigned therapists
    observacoes: "Paciente com evolução positiva. Família muito participativa.", // From patient.observations
    historico: [ // Needs fetching from appointments/evolutions
      { data: "2024-01-12", tipo: "Psicologia", profissional: "Dra. Ana Costa", status: "realizado" },
      { data: "2024-01-10", tipo: "T.O.", profissional: "TO. Carlos Lima", status: "realizado" },
      { data: "2024-01-08", tipo: "Psicologia", profissional: "Dra. Ana Costa", status: "faltou" },
    ]
  };

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
                  <Badge className={
                    patient.status === 'ativo' ? 'bg-success text-success-foreground' : 
                    'bg-warning text-warning-foreground'
                  }>
                    {patient.status}
                  </Badge>
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
                  <span className="text-sm text-muted-foreground">Frequência</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-success">{mockPatientMetrics.frequencia}%</p>
                  </div>
                </div>
                <div className="w-full bg-medical-gray rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full"
                    style={{ width: `${mockPatientMetrics.frequencia}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Faltas no mês</span>
                  <Badge variant={mockPatientMetrics.faltas > 2 ? "destructive" : "outline"}>
                    {mockPatientMetrics.faltas}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Última Consulta</p>
                  <p className="font-medium">{new Date(mockPatientMetrics.ultimaConsulta).toLocaleDateString('pt-BR')}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Próxima Consulta</p>
                  <p className="font-medium">{new Date(mockPatientMetrics.proximaConsulta).toLocaleDateString('pt-BR')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Equipe Terapêutica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Equipe Terapêutica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockPatientMetrics.terapeutas.map((terapeuta, index) => (
                  <div key={index} className="p-4 border border-medical-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {terapeuta.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{terapeuta}</p>
                        <p className="text-sm text-muted-foreground">
                          {terapeuta.includes('Dra.') ? 'Psicologia' : 'Terapia Ocupacional'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                {mockPatientMetrics.historico.map((item, index) => (
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
                    <Badge className={
                      item.status === 'realizado' ? 'bg-success text-success-foreground' : 
                      'bg-destructive text-destructive-foreground'
                    }>
                      {item.status}
                    </Badge>
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
            <MedicalRecordTabs patientId={id} />
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