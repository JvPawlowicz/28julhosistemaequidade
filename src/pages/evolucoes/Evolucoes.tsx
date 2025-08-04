import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { usePermissions } from "@/contexts/usePermissions";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import { showSuccess, showError, showInfo } from '@/utils/notifications';
import { supabase } from "@/integrations/supabase/client";
import EvolutionNotifications from "@/components/EvolutionNotifications";
import EvolutionAdendum from "@/components/EvolutionAdendum";
import { Loading } from "@/components/ui/loading";

// Import new modular components
import { EvolutionHeader } from "@/components/evolutions/EvolutionHeader";
import { EvolutionFilters } from "@/components/evolutions/EvolutionFilters";
import { EvolutionList } from "@/components/evolutions/EvolutionList";
import { NewEvolutionDialog } from "@/components/evolutions/NewEvolutionDialog";
import { SupervisionTab } from "@/components/evolutions/SupervisionTab";
import { EvolutionAnalytics } from "@/components/evolutions/EvolutionAnalytics";
import { EvolutionDetailModal } from "@/components/evolutions/EvolutionDetailModal";

import type { Evolution } from "../../types/Evolution";

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
  full_name: string;
  email: string;
  role: string;
  specialty: string;
  units: string[];
  requires_supervision: boolean;
}

const Evolucoes = () => {
  const { isAdmin, getUserRole, hasPermission } = usePermissions();
  const { currentUnit, currentUser: multiTenantCurrentUser } = useMultiTenant();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [filterTerapeuta, setFilterTerapeuta] = useState("todos");
  const [isNewEvolucaoOpen, setIsNewEvolucaoOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [loading, setLoading] = useState(true);
  
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [userProfiles, setUserProfiles] = useState<Professional[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [realizedAppointments, setRealizedAppointments] = useState<Appointment[]>([]);
  
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
  const [selectedEvolucao, setSelectedEvolucao] = useState<Evolution | null>(null);

  const fetchEvolutions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('evolutions')
        .select(`
          *,
          patients!evolutions_patient_id_fkey(full_name),
          profiles!evolutions_professional_id_fkey(full_name, requires_supervision)
        `);

      if (!isAdmin() && currentUnit) {
        // Filter by unit if not admin
        // This requires a join or RLS policy to filter evolutions by patient's unit or professional's unit
        // For now, assuming evolutions are linked to a unit via patient or professional
        // This might need a more complex query or RLS setup in Supabase
      }
      if (getUserRole() === 'terapeuta' || getUserRole() === 'estagiario') {
        query = query.eq('professional_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = (data || []).map(evolution => ({
        ...evolution,
        content: evolution.content as Evolution['content'],
        supervisors_signature: evolution.supervisors_signature as Evolution['supervisors_signature'],
        profiles: evolution.profiles as Evolution['profiles'],
      })) as Evolution[];

      setEvolutions(formattedData);
    } catch (error) {
      console.error('Error fetching evolutions:', error);
      showError("Erro ao carregar evoluções", "Não foi possível buscar os dados.");
    }
  }, [isAdmin, currentUnit, getUserRole]);

  const fetchUserProfiles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, requires_supervision');

      if (error) throw error;
      setUserProfiles(data || []);
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
  }, []);

  const fetchPatients = useCallback(async () => {
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
  }, []);

  const fetchRealizedAppointments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('id, patient_id, appointment_date, status')
        .eq('status', 'realizado')
        .is('evolution_id', null); // Only appointments that don't have an evolution yet

      if (error) throw error;
      setRealizedAppointments((data || []).map(apt => ({
        ...apt,
        status: apt.status || 'realizado'
      })));
    } catch (error) {
      console.error('Error fetching realized appointments:', error);
    }
  }, []);

  const initializeData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchUserProfiles(),
      fetchEvolutions(),
      fetchPatients(),
      fetchRealizedAppointments()
    ]);
    setLoading(false);
  }, [fetchEvolutions, fetchUserProfiles, fetchPatients, fetchRealizedAppointments]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Permissions
  const canCreateEvolution = hasPermission('clinical_records', 'create');
  const canEditEvolution = hasPermission('clinical_records', 'edit');
  const canViewEvolution = hasPermission('clinical_records', 'view');
  const canSupervise = getUserRole() === 'coordenador' || getUserRole() === 'admin';
  const currentUserRequiresSupervision = multiTenantCurrentUser?.requires_supervision || false;

  const handleCreateEvolution = async (isDraft = false) => {
    try {
      if (!multiTenantCurrentUser) return;

      if (!formData.patient_id || !formData.appointment_id) {
        showError("Campos obrigatórios", "Selecione um paciente e agendamento.");
        return;
      }

      let newStatus: 'Rascunho' | 'Pendente de Supervisão' | 'Finalizada' = 'Rascunho';
      
      if (!isDraft) {
        newStatus = currentUserRequiresSupervision ? 'Pendente de Supervisão' : 'Finalizada';
      }

      const { error } = await supabase
        .from('evolutions')
        .insert({
          patient_id: formData.patient_id,
          professional_id: multiTenantCurrentUser.id,
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

      showSuccess("Sucesso", isDraft 
          ? "Rascunho salvo com sucesso."
          : currentUserRequiresSupervision 
            ? "Evolução enviada para supervisão."
            : "Evolução assinada e finalizada.",
      );

      setIsNewEvolucaoOpen(false);
      resetForm();
      fetchEvolutions();
    } catch (error) {
      console.error('Error creating evolution:', error);
      showError("Erro ao criar evolução", "Não foi possível criar a evolução.");
    }
  };

  const handleSupervisionAction = async (evolutionId: string, action: 'approve' | 'reject') => {
    try {
      if (!multiTenantCurrentUser) return;

      if (action === 'approve') {
        const { error } = await supabase
          .from('evolutions')
          .update({
            status: 'Finalizada',
            signed_at: new Date().toISOString(),
            supervisors_signature: {
              supervisor_id: multiTenantCurrentUser.id,
              approved_at: new Date().toISOString(),
            }
          })
          .eq('id', evolutionId);

        if (error) throw error;
        showSuccess("Evolução aprovada", "A evolução foi aprovada e co-assinada com sucesso.");
      } else {
        if (!supervisionFeedback.trim()) {
          showError("Feedback obrigatório", "É necessário fornecer um feedback para solicitar revisão.");
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
        showInfo("Revisão solicitada", "O estagiário foi notificado sobre as correções necessárias.");
        setSupervisionFeedback('');
      }

      fetchEvolutions();
      setSelectedEvolucao(null);
    } catch (error) {
      console.error('Error handling supervision:', error);
      showError("Erro ao processar supervisão", "Não foi possível processar a supervisão.");
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

  const getPatientName = (patient_id: string) => {
    const patient = patients.find(p => p.id === patient_id);
    return patient ? patient.full_name : patient_id;
  };

  const getProfessionalName = (professional_id: string) => {
    const prof = userProfiles.find(p => p.id === professional_id);
    return prof ? prof.full_name : professional_id;
  };

  const filteredEvolutions = evolutions.filter(ev => {
    const patientName = getPatientName(ev.patient_id).toLowerCase();
    const professionalName = getProfessionalName(ev.professional_id).toLowerCase();
    const matchesSearch = patientName.includes(searchTerm.toLowerCase()) || professionalName.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todas' || ev.status.toLowerCase().replace(' ', '') === filterStatus.replace('_', '');
    
    if (getUserRole() === 'terapeuta' || getUserRole() === 'estagiario') {
      return matchesSearch && matchesStatus && ev.professional_id === multiTenantCurrentUser?.id;
    }
    return matchesSearch && matchesStatus;
  });

  const pendingSupervisionEvolutions = evolutions.filter(e => e.status === 'Pendente de Supervisão');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  if (!canViewEvolution) {
    return (
      <div className="flex items-center justify-center h-96">
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

  return (
    <div className="space-y-6">
      <EvolutionNotifications />
      <EvolutionHeader onNewEvolutionClick={() => setIsNewEvolucaoOpen(true)} />
      <EvolutionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterTerapeuta={filterTerapeuta}
        setFilterTerapeuta={setFilterTerapeuta}
        therapists={userProfiles}
      />

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

        <TabsContent value="list" className="mt-6">
          <EvolutionList
            evolutions={filteredEvolutions}
            getPatientName={getPatientName}
            getProfessionalName={getProfessionalName}
            getStatusColor={getStatusColor}
            canCreateEvolution={canCreateEvolution}
            canEditEvolution={canEditEvolution}
            canSupervise={canSupervise}
            currentUserId={multiTenantCurrentUser?.id}
            onViewEvolution={setSelectedEvolucao}
            onApproveEvolution={(id) => handleSupervisionAction(id, 'approve')}
            onRequestEvolutionRevision={setSelectedEvolucao} // Opens modal for feedback
            onAddEvolutionAdendum={(id) => { setSelectedEvolutionForAdendum(id); setShowAdendum(true); }}
            onNewEvolutionClick={() => setIsNewEvolucaoOpen(true)}
          />
        </TabsContent>

        {canSupervise && (
          <TabsContent value="supervision" className="mt-6">
            <SupervisionTab
              pendingSupervisionEvolutions={pendingSupervisionEvolutions}
              getPatientName={getPatientName}
              getProfessionalName={getProfessionalName}
              onApproveEvolution={(id) => handleSupervisionAction(id, 'approve')}
              onRequestEvolutionRevision={setSelectedEvolucao} // Opens modal for feedback
            />
          </TabsContent>
        )}

        <TabsContent value="analytics" className="mt-6">
          <EvolutionAnalytics evolutions={evolutions} />
        </TabsContent>
      </Tabs>

      <NewEvolutionDialog
        isOpen={isNewEvolucaoOpen}
        onOpenChange={setIsNewEvolucaoOpen}
        patients={patients}
        realizedAppointments={realizedAppointments}
        currentUserRequiresSupervision={currentUserRequiresSupervision}
        formData={formData}
        setFormData={setFormData}
        onCreateEvolution={handleCreateEvolution}
      />

      <EvolutionDetailModal
        isOpen={!!selectedEvolucao}
        onOpenChange={() => setSelectedEvolucao(null)}
        evolution={selectedEvolucao}
        getPatientName={getPatientName}
        getProfessionalName={getProfessionalName}
        getStatusColor={getStatusColor}
        canSupervise={canSupervise}
        supervisionFeedback={supervisionFeedback}
        setSupervisionFeedback={setSupervisionFeedback}
        onSupervisionAction={handleSupervisionAction}
      />
      
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