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

interface Patient {
  id: number;
  nome: string;
  idade: number;
  dataNascimento: string;
  responsavel: string;
  telefone: string;
  email: string;
  endereco: string;
  diagnostico: string;
  unidade: string;
  status: string;
  ultimaConsulta: string;
  proximaConsulta: string;
  terapeutas: string[];
  faltas: number;
  frequencia: number;
  convenio: string;
  observacoes: string;
  historico: Array<{ data: string; tipo: string; profissional: string; status: string }>;
}

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);

  const fetchPatientEvolutions = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('evolutions')
        .select(`
          *,
          profiles!evolutions_professional_id_fkey(full_name)
        `)
        .eq('patient_id', id)
        .eq('status', 'Finalizada')
        .order('created_at', { ascending: false });
      
      setEvolutions((data || []).map(ev => ({
        ...ev,
        content: typeof ev.content === "string" ? JSON.parse(ev.content) : ev.content,
        supervisors_signature: String(ev.supervisors_signature)
      })));
    } catch (error) {
      console.error('Error fetching evolutions:', error);
    }
  }, [id]);
  
  useEffect(() => {
    fetchPatientEvolutions();
  }, [id, fetchPatientEvolutions]);

  // Mock patient data - em produção viria do Supabase
  const patient: Patient = {
    id: parseInt(id || "1"),
    nome: "João Silva Santos",
    idade: 12,
    dataNascimento: "2011-03-15",
    responsavel: "Maria Silva",
    telefone: "(11) 99999-1111",
    email: "maria.silva@email.com",
    endereco: "Rua das Flores, 123 - Centro",
    diagnostico: "TEA - Transtorno do Espectro Autista",
    unidade: "Centro",
    status: "ativo",
    ultimaConsulta: "2024-01-12",
    proximaConsulta: "2024-01-18",
    terapeutas: ["Dra. Ana Costa", "TO. Carlos Lima"],
    faltas: 1,
    frequencia: 95,
    convenio: "Particular",
    observacoes: "Paciente com evolução positiva. Família muito participativa.",
    historico: [
      { data: "2024-01-12", tipo: "Psicologia", profissional: "Dra. Ana Costa", status: "realizado" },
      { data: "2024-01-10", tipo: "T.O.", profissional: "TO. Carlos Lima", status: "realizado" },
      { data: "2024-01-08", tipo: "Psicologia", profissional: "Dra. Ana Costa", status: "faltou" },
    ]
  };

  const canViewClinical = hasPermission('clinical_records', 'view');
  const canEditPatient = hasPermission('pacientes', 'update');

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
          <h1 className="text-3xl font-bold text-primary">{patient.nome}</h1>
          <p className="text-muted-foreground">
            {patient.idade} anos • {patient.diagnostico}
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
                  <p className="font-medium">{patient.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">{new Date(patient.dataNascimento).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diagnóstico</p>
                  <p className="font-medium">{patient.diagnostico}</p>
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
                  <p className="font-medium">{patient.responsavel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {patient.telefone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {patient.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {patient.endereco}
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
                    <p className="text-2xl font-bold text-success">{patient.frequencia}%</p>
                  </div>
                </div>
                <div className="w-full bg-medical-gray rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full"
                    style={{ width: `${patient.frequencia}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Faltas no mês</span>
                  <Badge variant={patient.faltas > 2 ? "destructive" : "outline"}>
                    {patient.faltas}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Última Consulta</p>
                  <p className="font-medium">{new Date(patient.ultimaConsulta).toLocaleDateString('pt-BR')}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Próxima Consulta</p>
                  <p className="font-medium">{new Date(patient.proximaConsulta).toLocaleDateString('pt-BR')}</p>
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
                {patient.terapeutas.map((terapeuta, index) => (
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
                {patient.historico.map((item, index) => (
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
          {patient.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Observações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{patient.observacoes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Linha do Tempo - Evoluções Clínicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {evolutions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhuma evolução finalizada encontrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {evolutions.map((evolution: Evolution, index: number) => (
                    <div key={evolution.id} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-primary rounded-full mt-2"></div>
                          {index < evolutions.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-300 ml-1 mt-2"></div>
                          )}
                        </div>
                        <Card className="flex-1">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{evolution.profiles?.full_name}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(evolution.created_at).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">
                                Finalizada
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-3">
                              {evolution.content?.session_report || 'Sem relatório disponível'}
                            </p>
                            {evolution.content?.inappropriate_behavior && (
                              <div className="mt-2 p-2 bg-red-50 rounded border-l-4 border-red-400">
                                <p className="text-xs text-red-700 font-medium">
                                  ⚠️ Comportamento inadequado relatado
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prontuário Médico */}
        <TabsContent value="prontuario">
          {canViewClinical ? (
            <MedicalRecordTabs />
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