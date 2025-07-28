import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Calendar, 
  User, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Save,
  Clock,
  AlertCircle,
  CheckCircle,
  Shield,
  Target,
  TrendingUp,
  MessageSquare,
  Send,
  ArrowLeft,
  Upload,
  X
} from "lucide-react";
import { usePermissions } from "@/contexts/usePermissions";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EvolutionNotifications from "@/components/EvolutionNotifications";
import EvolutionAdendum from "@/components/EvolutionAdendum";
import FileUpload from "@/components/FileUpload";
import { EmptyState } from "@/components/EmptyState";
import UnitDataIndicator from "@/components/UnitDataIndicator";
import type { Evolution } from "../../types/Evolution";

interface UserRole {
  role: string;
  specialty?: string;
}

interface Patient {
  id: string;
  full_name: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  appointment_date: string;
  status: string;
}

interface Professional {
  id: string;
  name: string;
  email: string;
  role: string;
  specialty: string;
  units: string[];
  permissions: string[];
  profile?: {
    requires_supervision?: boolean;
  };
}

const Evolucoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, getUserRole, hasPermission } = usePermissions();
  const { currentUnit } = useMultiTenant();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [filterTerapeuta, setFilterTerapeuta] = useState("todos");
  const [selectedEvolucao, setSelectedEvolucao] = useState<Evolution | null>(null);
  const [isNewEvolucaoOpen, setIsNewEvolucaoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [loading, setLoading] = useState(true);
  
  // Estado dos dados
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [currentUser, setCurrentUser] = useState<Professional | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [realizedAppointments, setRealizedAppointments] = useState<Appointment[]>([]);
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_id: '',
    inappropriate_behavior: false,
    behavior_description: '',
    session_report: '',
    linked_pti_objectives: [] as string[],
    attachments: [] as string[],
  });
  
  const [supervisionFeedback, setSupervisionFeedback] = useState('');
  const [showAdendum, setShowAdendum] = useState(false);
  const [selectedEvolutionForAdendum, setSelectedEvolutionForAdendum] = useState<string | null>(null);

  const fetchEvolutions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const query = supabase
        .from('evolutions')
        .select(`
          *,
          patients!evolutions_patient_id_fkey(full_name),
          profiles!evolutions_professional_id_fkey(full_name, requires_supervision)
        `);

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map(evolution => ({
        ...evolution,
        content: evolution.content as Evolution['content'],
        supervisors_signature: evolution.supervisors_signature as Evolution['supervisors_signature'],
        requires_supervision: evolution.profiles?.requires_supervision || false,
      })) as Evolution[];

      setEvolutions(formattedData);
    } catch (error) {
      console.error('Error fetching evolutions:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar evoluções",
        variant: "destructive"
      });
    }
  }, [toast]);

  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCurrentUser(),
        fetchUserRoles(),
        fetchEvolutions(),
        fetchPatients(),
        fetchRealizedAppointments()
      ]);
    } catch (error) {
      console.error('Error initializing data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados iniciais",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [fetchEvolutions, toast]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      // Ao usar setCurrentUser, garanta todos os campos obrigatórios:
      setCurrentUser({
        id: user.id,
        name: user.user_metadata?.name || user.user_metadata?.full_name || "",
        email: user.email,
        role: user.role,
        specialty: user.user_metadata?.specialty || "",
        units: user.user_metadata?.units || [],
        permissions: user.user_metadata?.permissions || [],
        profile: profile,
      });
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_roles')
        .select('role, specialty')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name')
        .order('full_name');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchRealizedAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('id, patient_id, appointment_date, status')
        .eq('status', 'realizado')
        .is('id', null); // Apenas agendamentos que ainda não têm evolução

      if (error) throw error;
      setRealizedAppointments((data || []).map(apt => ({
        ...apt,
        status: apt.status || 'realizado'
      })));
    } catch (error) {
      console.error('Error fetching realized appointments:', error);
    }
  };

  // Verificações de permissão
  const canCreateEvolution = hasPermission('clinical_records', 'create');
  const canEditEvolution = hasPermission('clinical_records', 'edit');
  const canViewEvolution = hasPermission('clinical_records', 'view');
  const canSupervise = getUserRole() === 'coordenador' || getUserRole() === 'admin';
  const userRole = getUserRole();

  const handleCreateEvolution = async (isDraft = false) => {
    try {
      if (!currentUser) return;

      if (!formData.patient_id || !formData.appointment_id) {
        toast({
          title: "Erro",
          description: "Selecione um paciente e agendamento",
          variant: "destructive"
        });
        return;
      }

      const requiresSupervision = currentUser.profile?.requires_supervision || false;
      let newStatus: 'Rascunho' | 'Pendente de Supervisão' | 'Finalizada' = 'Rascunho';
      
      if (!isDraft) {
        newStatus = requiresSupervision ? 'Pendente de Supervisão' : 'Finalizada';
      }

      const { error } = await supabase
        .from('evolutions')
        .insert({
          patient_id: formData.patient_id,
          professional_id: currentUser.id,
          appointment_id: formData.appointment_id,
          status: newStatus,
          content: {
            inappropriate_behavior: formData.inappropriate_behavior,
            behavior_description: formData.behavior_description,
            session_report: formData.session_report,
          },
          linked_pti_objectives: formData.linked_pti_objectives,
          attachments: formData.attachments,
          signed_at: newStatus === 'Finalizada' ? new Date().toISOString() : null,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: isDraft 
          ? "Rascunho salvo com sucesso"
          : requiresSupervision 
            ? "Evolução enviada para supervisão"
            : "Evolução assinada e finalizada",
      });

      setIsNewEvolucaoOpen(false);
      resetForm();
      fetchEvolutions();
    } catch (error) {
      console.error('Error creating evolution:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar evolução",
        variant: "destructive"
      });
    }
  };

  const handleSupervisionAction = async (evolutionId: string, action: 'approve' | 'reject') => {
    try {
      if (!currentUser) return;

      if (action === 'approve') {
        const { error } = await supabase
          .from('evolutions')
          .update({
            status: 'Finalizada',
            signed_at: new Date().toISOString(),
            supervisors_signature: {
              supervisor_id: currentUser.id,
              approved_at: new Date().toISOString(),
            }
          })
          .eq('id', evolutionId);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Evolução aprovada e co-assinada" });
      } else {
        if (!supervisionFeedback.trim()) {
          toast({
            title: "Erro",
            description: "Feedback é obrigatório para solicitar revisão",
            variant: "destructive"
          });
          return;
        }

        const evolution = evolutions.find(e => e.id === evolutionId);
        const { error } = await supabase
          .from('evolutions')
          .update({
            status: 'Rascunho',
            content: {
              ...evolution?.content,
              supervision_feedback: supervisionFeedback
            }
          })
          .eq('id', evolutionId);

        if (error) throw error;
        toast({ title: "Sucesso", description: "Evolução devolvida para revisão" });
        setSupervisionFeedback('');
      }

      fetchEvolutions();
      setSelectedEvolucao(null);
    } catch (error) {
      console.error('Error handling supervision:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar supervisão",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: '',
      appointment_id: '',
      inappropriate_behavior: false,
      behavior_description: '',
      session_report: '',
      linked_pti_objectives: [],
      attachments: [],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizada': return 'bg-success text-success-foreground';
      case 'Pendente de Supervisão': return 'bg-warning text-warning-foreground';
      case 'Rascunho': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredEvolutions = evolutions.filter(ev => {
    // Buscar nome do paciente e profissional usando helpers
    const patientName = getPatientName(ev.patient_id).toLowerCase();
    const professionalName = getProfessionalName(ev.professional_id).toLowerCase();
    const matchesSearch = patientName.includes(searchTerm.toLowerCase()) || professionalName.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todas' || ev.status.toLowerCase().replace(' ', '') === filterStatus.replace('_', '');
    if (userRole === 'terapeuta' || userRole === 'estagiario') {
      return matchesSearch && matchesStatus && ev.professional_id === currentUser?.id;
    }
    return matchesSearch && matchesStatus;
  });

  const pendingSupervisionEvolutions = evolutions.filter(e => e.status === 'Pendente de Supervisão');

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando evoluções...</p>
        </div>
      </div>
    );
  }

  // Verificar se usuário tem acesso a evoluções
  if (!canViewEvolution) {
    return (
      <div className="space-y-6">
        <Card className="text-center p-8">
          <CardContent>
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-muted-foreground">
              Você não tem permissão para visualizar evoluções clínicas.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper para buscar nome do paciente
  function getPatientName(patient_id: string) {
    // Buscar no array de pacientes se disponível, ou retornar o id
    const patient = patients.find(p => p.id === patient_id);
    return patient ? patient.full_name : patient_id;
  }

  // Helper para buscar nome do profissional
  function getProfessionalName(professional_id: string) {
    // Buscar no array de profissionais se disponível, ou retornar o id
    const prof = userRoles.find(u => u.role === professional_id);
    return prof ? prof.role : professional_id;
  }

  return (
      <div className="space-y-6">
        {/* Notificações de evoluções pendentes */}
        <EvolutionNotifications />
        
        {/* Indicador da unidade atual */}
        <UnitDataIndicator showDetails />
        
        {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {isAdmin() ? 'Evoluções - Todas as Unidades' : 
             canSupervise ? 'Evoluções e Supervisão' : 'Minhas Evoluções'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin() && currentUnit ? `Visualizando: ${currentUnit.name}` : 
             userRole === 'coordenador' ? 'Gerencie evoluções e supervisão' :
             userRole === 'estagiario' ? 'Suas evoluções e supervisões pendentes' :
             'Suas evoluções clínicas'}
          </p>
        </div>
        
        {canCreateEvolution && (
          <Dialog open={isNewEvolucaoOpen} onOpenChange={setIsNewEvolucaoOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Evolução
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Evolução Clínica</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Paciente *</Label>
                    <Select value={formData.patient_id} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, patient_id: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o paciente" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map(patient => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Agendamento Realizado *</Label>
                    <Select value={formData.appointment_id} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, appointment_id: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o agendamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {realizedAppointments
                          .filter(apt => apt.patient_id === formData.patient_id)
                          .map(appointment => (
                            <SelectItem key={appointment.id} value={appointment.id}>
                              {new Date(appointment.appointment_date).toLocaleDateString()}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.inappropriate_behavior}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, inappropriate_behavior: !!checked }))
                    }
                  />
                  <Label>Comportamento inadequado foi observado?</Label>
                </div>
                
                {formData.inappropriate_behavior && (
                  <div>
                    <Label>Descrição do comportamento inadequado *</Label>
                    <Textarea
                      value={formData.behavior_description}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        behavior_description: e.target.value 
                      }))}
                      placeholder="Descreva detalhadamente o comportamento inadequado observado..."
                      rows={3}
                    />
                  </div>
                )}
                
                <div>
                  <Label>Breve relatório da sessão *</Label>
                  <Textarea
                    value={formData.session_report}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      session_report: e.target.value 
                    }))}
                    placeholder="Descreva as atividades realizadas, comportamento do paciente, estratégias utilizadas e observações relevantes..."
                    rows={5}
                  />
                </div>
                
                <div>
                  <Label>Anexos</Label>
                  <FileUpload
                    onFilesUploaded={(urls) => setFormData(prev => ({ 
                      ...prev, 
                      attachments: [...prev.attachments, ...urls] 
                    }))}
                    maxFiles={5}
                    maxSize={10}
                    bucketName="patient-documents"
                    folderPath="evolutions"
                  />
                  {formData.attachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Arquivos anexados:</p>
                      {formData.attachments.map((url, index) => (
                        <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                          <span className="truncate">{url.split('/').pop()}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              attachments: prev.attachments.filter((_, i) => i !== index)
                            }))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleCreateEvolution(true)}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar como Rascunho
                  </Button>
                  <Button 
                    onClick={() => handleCreateEvolution(false)}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {currentUser?.profile?.requires_supervision ? 'Enviar para Supervisão' : 'Assinar e Finalizar'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsNewEvolucaoOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar paciente ou terapeuta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
                <SelectItem value="pendentesupervisao">Pendente Supervisão</SelectItem>
                <SelectItem value="rascunho">Rascunho</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTerapeuta} onValueChange={setFilterTerapeuta}>
              <SelectTrigger>
                <SelectValue placeholder="Terapeuta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {evolutions
                  .map(e => e.professional_id)
                  .filter((id, index, arr) => arr.indexOf(id) === index)
                  .map(id => (
                    <SelectItem key={id} value={id}>
                      {getProfessionalName(id)}
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

      {/* Tabs principais */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Lista de Evoluções</TabsTrigger>
          {canSupervise && (
            <TabsTrigger value="supervision">
              Supervisão
              {pendingSupervisionEvolutions.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingSupervisionEvolutions.length}
                </Badge>
              )}
            </TabsTrigger>
          )}
          <TabsTrigger value="analytics">Relatórios</TabsTrigger>
        </TabsList>

        {/* Lista de Evoluções */}
        <TabsContent value="list" className="mt-6">
          <div className="space-y-4">
            {filteredEvolutions.map((evolution) => (
              <Card key={evolution.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">{getPatientName(evolution.patient_id)}</h3>
                        <p className="text-sm text-muted-foreground">
                          Profissional: {getProfessionalName(evolution.professional_id)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(evolution.status)}>
                        {evolution.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {evolution.content?.session_report || 'Sem relatório'}
                    </p>
                    
                    {evolution.content?.inappropriate_behavior && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg">
                        <p className="text-xs text-red-700 font-medium">
                          ⚠️ Comportamento inadequado relatado
                        </p>
                      </div>
                    )}

                    {evolution.content?.supervision_feedback && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                        <p className="text-xs text-yellow-700 font-medium">
                          💭 Feedback de supervisão: {evolution.content.supervision_feedback}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-1"
                      onClick={() => setSelectedEvolucao(evolution)}
                    >
                      <Eye className="h-3 w-3" />
                      Visualizar
                    </Button>
                    
                    {canEditEvolution && evolution.status === 'Rascunho' && 
                     evolution.professional_id === currentUser?.id && (
                      <Button size="sm" variant="outline" className="gap-1">
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>
                    )}
                    
                    {evolution.status === 'Pendente de Supervisão' && canSupervise && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleSupervisionAction(evolution.id, 'approve')}
                          className="gap-1 bg-success text-success-foreground hover:bg-success/90"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Aprovar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => {
                            setSelectedEvolucao(evolution);
                            // Modal de feedback será aberto
                          }}
                          className="gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          Solicitar Revisão
                        </Button>
                      </>
                    )}
                    
                    {evolution.status === 'Finalizada' && evolution.professional_id === currentUser?.id && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedEvolutionForAdendum(evolution.id);
                          setShowAdendum(true);
                        }}
                        className="gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Adendo
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredEvolutions.length === 0 && (
              <EmptyState
                icon={FileText}
                title="Nenhuma evolução encontrada"
                description="Não há evoluções que correspondam aos filtros aplicados."
                actionLabel={canCreateEvolution ? "Nova Evolução" : undefined}
                onAction={canCreateEvolution ? () => setIsNewEvolucaoOpen(true) : undefined}
              />
            )}
          </div>
        </TabsContent>

        {/* Supervisão - apenas para coordenadores e admins */}
        {canSupervise && (
          <TabsContent value="supervision" className="mt-6">
            <div className="space-y-4">
              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertDescription>
                  Aqui você pode supervisionar evoluções de estagiários e fornecer feedback.
                </AlertDescription>
              </Alert>
              
              {pendingSupervisionEvolutions.length === 0 ? (
                <EmptyState
                  icon={CheckCircle}
                  title="Nenhuma supervisão pendente"
                  description="Todas as evoluções foram supervisionadas."
                />
              ) : (
                pendingSupervisionEvolutions.map((evolution) => (
                  <Card key={evolution.id} className="border-warning/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{getPatientName(evolution.patient_id)}</h3>
                          <p className="text-sm text-muted-foreground">
                            Profissional: {getProfessionalName(evolution.professional_id)}
                          </p>
                        </div>
                        <Badge className="bg-warning text-warning-foreground">
                          Aguardando Supervisão
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Relatório da Sessão:</h4>
                          <p className="text-sm bg-accent p-3 rounded-lg">
                            {evolution.content?.session_report || 'Sem relatório'}
                          </p>
                        </div>
                        
                        {evolution.content?.inappropriate_behavior && (
                          <div>
                            <h4 className="font-medium mb-2">Comportamento Inadequado:</h4>
                            <p className="text-sm bg-red-50 p-3 rounded-lg">
                              {evolution.content.behavior_description}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleSupervisionAction(evolution.id, 'approve')}
                            className="gap-2 bg-success text-success-foreground hover:bg-success/90"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Aprovar e Co-assinar
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => setSelectedEvolucao(evolution)}
                            className="gap-2"
                          >
                            <AlertCircle className="h-4 w-4" />
                            Solicitar Revisão
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        )}

        {/* Relatórios */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{evolutions.length}</p>
                    <p className="text-sm text-muted-foreground">Total de Evoluções</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">
                      {evolutions.filter(ev => ev.status === 'Finalizada').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Finalizadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-warning" />
                  <div>
                    <p className="text-2xl font-bold">
                      {evolutions.filter(ev => ev.status === 'Pendente de Supervisão').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Detalhados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <FileText className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Relatório por Período</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-20">
                  <div className="text-center">
                    <User className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Relatório por Terapeuta</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Visualização/Feedback de Supervisão */}
      {selectedEvolucao && (
        <Dialog open={!!selectedEvolucao} onOpenChange={() => setSelectedEvolucao(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedEvolucao.status === 'Pendente de Supervisão' && canSupervise
                  ? 'Supervisão de Evolução'
                  : 'Visualizar Evolução'
                } - {getPatientName(selectedEvolucao.patient_id)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedEvolucao.status)}>
                  {selectedEvolucao.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {getProfessionalName(selectedEvolucao.professional_id)}
                </span>
              </div>
              
              {selectedEvolucao.content?.inappropriate_behavior && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Comportamento Inadequado Relatado</h4>
                  <p className="text-red-700">{selectedEvolucao.content.behavior_description}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-2">Relatório da Sessão</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {selectedEvolucao.content?.session_report || 'Sem relatório'}
                </p>
              </div>
              
              {selectedEvolucao.content?.supervision_feedback && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Feedback de Supervisão Anterior</h4>
                  <p className="text-yellow-700">{selectedEvolucao.content.supervision_feedback}</p>
                </div>
              )}
              
              {selectedEvolucao.status === 'Pendente de Supervisão' && canSupervise && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Ação de Supervisão</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Feedback para revisão (obrigatório se solicitar revisão)</Label>
                      <Textarea
                        value={supervisionFeedback}
                        onChange={(e) => setSupervisionFeedback(e.target.value)}
                        placeholder="Descreva os pontos que precisam ser revisados ou melhorados..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleSupervisionAction(selectedEvolucao.id, 'reject')}
                        variant="outline"
                        disabled={!supervisionFeedback.trim()}
                      >
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Solicitar Revisão
                      </Button>
                      <Button 
                        onClick={() => handleSupervisionAction(selectedEvolucao.id, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar e Co-assinar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedEvolucao(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Fechar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Modal de Adendo */}
      {showAdendum && selectedEvolutionForAdendum && (
        <EvolutionAdendum
          evolutionId={selectedEvolutionForAdendum}
          patientName={getPatientName(evolutions.find(e => e.id === selectedEvolutionForAdendum)?.patient_id || "")}
          isOpen={showAdendum}
          onClose={() => {
            setShowAdendum(false);
            setSelectedEvolutionForAdendum(null);
          }}
          onSuccess={() => {
            fetchEvolutions();
          }}
        />
      )}
    </div>
  );
};

export default Evolucoes;