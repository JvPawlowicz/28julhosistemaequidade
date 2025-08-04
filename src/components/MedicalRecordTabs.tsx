import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Calendar,
  Target,
  TrendingUp,
  Upload,
  Download,
  Edit,
  Save,
  Clock,
  User,
  Heart,
  ClipboardList,
  Shield,
  AlertCircle,
  Calculator,
  FileImage,
  Eye // Added Eye import
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/contexts/usePermissions";
import { AssessmentProtocols } from "./AssessmentProtocols";
import type { Evolution } from "@/types/Evolution";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Loading } from "@/components/ui/loading";
import { EmptyState } from "./EmptyState";
import { Progress } from "@/components/ui/progress"; // Added Progress import

interface MedicalRecordTabsProps {
  patientId: string;
}

type PatientDocument = Tables<'patient_documents'>;
type Evaluation = Tables<'evaluations'> & { status: string | null }; // Added status to Evaluation type
type TherapyGoal = Tables<'therapy_goals'>;

const MedicalRecordTabs = ({ patientId }: MedicalRecordTabsProps) => {
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [therapyGoals, setTherapyGoals] = useState<TherapyGoal[]>([]);

  const fetchMedicalRecords = useCallback(async () => {
    setLoading(true);
    try {
      const [
        { data: evolutionsData, error: evolutionsError },
        { data: documentsData, error: documentsError },
        { data: evaluationsData, error: evaluationsError },
        { data: therapyGoalsData, error: therapyGoalsError },
      ] = await Promise.all([
        supabase
          .from('evolutions')
          .select(`
            *,
            profiles!evolutions_professional_id_fkey(full_name, requires_supervision)
          `)
          .eq('patient_id', patientId)
          .order('created_at', { ascending: false }),
        supabase
          .from('patient_documents')
          .select('*')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: false }),
        supabase
          .from('evaluations')
          .select('*')
          .eq('patient_id', patientId)
          .order('evaluation_date', { ascending: false }),
        supabase
          .from('therapy_goals')
          .select('*')
          .eq('patient_id', patientId)
          .order('start_date', { ascending: false }),
      ]);

      if (evolutionsError) throw evolutionsError;
      if (documentsError) throw documentsError;
      if (evaluationsError) throw evaluationsError;
      if (therapyGoalsError) throw therapyGoalsError;

      setEvolutions((evolutionsData || []).map(ev => ({
        ...ev,
        content: ev.content as Evolution['content'],
        supervisors_signature: ev.supervisors_signature as Evolution['supervisors_signature'],
        profiles: ev.profiles as Evolution['profiles']
      })));
      setDocuments(documentsData || []);
      setEvaluations(evaluationsData || []);
      setTherapyGoals(therapyGoalsData || []);

    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast({
        title: "Erro ao carregar prontuário",
        description: "Não foi possível carregar os dados do prontuário.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [patientId, toast]);

  useEffect(() => {
    if (patientId) {
      fetchMedicalRecords();
    }
  }, [patientId, fetchMedicalRecords]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Finalizada': return 'bg-success text-success-foreground';
      case 'Pendente de Supervisão': return 'bg-warning text-warning-foreground';
      case 'Rascunho': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'Em Andamento': return 'bg-primary text-primary-foreground';
      case 'Concluído': return 'bg-success text-success-foreground';
      case 'Pausado': return 'bg-warning text-warning-foreground';
      case 'Cancelado': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Tabs defaultValue="evolutions" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="evolutions">Evoluções ({evolutions.length})</TabsTrigger>
        <TabsTrigger value="goals">Objetivos ({therapyGoals.length})</TabsTrigger>
        <TabsTrigger value="evaluations">Avaliações ({evaluations.length})</TabsTrigger>
        <TabsTrigger value="documents">Documentos ({documents.length})</TabsTrigger>
      </TabsList>

      {/* Evoluções */}
      <TabsContent value="evolutions" className="space-y-4">
        {evolutions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhuma evolução encontrada"
            description="Não há evoluções clínicas registradas para este paciente."
          />
        ) : (
          evolutions.map((evolution) => (
            <Card key={evolution.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-semibold text-lg">Evolução Clínica</h4>
                      <p className="text-sm text-muted-foreground">
                        Profissional: {evolution.profiles?.full_name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(evolution.status)}>
                      {evolution.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(evolution.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {evolution.content?.session_report || 'Sem relatório'}
                  </p>
                  {evolution.content?.inappropriate_behavior && (
                    <div className="mt-2 p-2 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-700 font-medium">
                        ⚠️ Comportamento inadequado relatado
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Eye className="h-3 w-3" />
                    Visualizar Completo
                  </Button>
                  {/* Add more actions based on permissions */}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      {/* Objetivos Terapêuticos */}
      <TabsContent value="goals" className="space-y-4">
        {therapyGoals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="Nenhum objetivo terapêutico"
            description="Não há objetivos de tratamento registrados para este paciente."
          />
        ) : (
          therapyGoals.map((goal) => (
            <Card key={goal.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Target className="h-5 w-5 text-secondary" />
                    <div>
                      <h4 className="font-semibold text-lg">{goal.goal_description}</h4>
                      <p className="text-sm text-muted-foreground">
                        Categoria: {goal.goal_category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getGoalStatusColor(goal.status)}>
                      {goal.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Início: {new Date(goal.start_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    Critério Alvo: {goal.target_criteria || 'N/A'}
                  </p>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span>Progresso:</span>
                    <span className="font-medium">{goal.progress_percentage || 0}%</span>
                  </div>
                  <Progress value={goal.progress_percentage || 0} className="h-2 mt-1" />
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="h-3 w-3" />
                    Editar Objetivo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      {/* Avaliações */}
      <TabsContent value="evaluations" className="space-y-4">
        {evaluations.length === 0 ? (
          <EmptyState
            icon={Calculator}
            title="Nenhuma avaliação encontrada"
            description="Não há avaliações de protocolo registradas para este paciente."
          />
        ) : (
          evaluations.map((evaluation) => (
            <Card key={evaluation.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Calculator className="h-5 w-5 text-info" />
                    <div>
                      <h4 className="font-semibold text-lg">{evaluation.evaluation_type}</h4>
                      <p className="text-sm text-muted-foreground">
                        Protocolo: {evaluation.protocol_used || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {evaluation.status && ( // Conditionally render status badge if status exists
                      <Badge className={getStatusColor(evaluation.status)}>
                        {evaluation.status}
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {new Date(evaluation.evaluation_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    Observações: {evaluation.observations || 'N/A'}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Eye className="h-3 w-3" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      {/* Documentos */}
      <TabsContent value="documents" className="space-y-4">
        {documents.length === 0 ? (
          <EmptyState
            icon={FileImage}
            title="Nenhum documento encontrado"
            description="Não há documentos anexados para este paciente."
          />
        ) : (
          documents.map((document) => (
            <Card key={document.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <FileImage className="h-5 w-5 text-warning" />
                    <div>
                      <h4 className="font-semibold text-lg">{document.file_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Tipo: {document.document_type || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {new Date(document.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="h-3 w-3" />
                    Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MedicalRecordTabs;