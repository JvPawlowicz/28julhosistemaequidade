import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Play, 
  CheckCircle,
  Star,
  Calendar,
  User,
  Book,
  Award
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/EmptyState";

interface ABAProtocol {
  id: string;
  name: string;
  version: string;
  description: string;
  domains: Record<string, any>;
  scoring_system: Record<string, any>;
}

interface ProtocolAssessment {
  id: string;
  patient_id: string;
  protocol_id: string;
  evaluator_id: string;
  assessment_date: string;
  status: string;
  scores: Record<string, any>;
  observations: string;
  recommendations: string;
  next_goals: Record<string, any>;
  patient_name?: string;
  protocol_name?: string;
}

const ABAProtocols = () => {
  const [protocols, setProtocols] = useState<ABAProtocol[]>([]);
  const [assessments, setAssessments] = useState<ProtocolAssessment[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<ABAProtocol | null>(null);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [patients, setPatients] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState<ProtocolAssessment | null>(null);
  const [domainScores, setDomainScores] = useState<Record<string, number>>({});
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProtocols();
    fetchAssessments();
    fetchPatients();
  }, []);

  const fetchProtocols = async () => {
    try {
      const { data, error } = await supabase
        .from('aba_protocols')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProtocols((data || []).map(p => ({
        ...p,
        domains: p.domains as Record<string, any>,
        scoring_system: p.scoring_system as Record<string, any>
      })));
    } catch (error) {
      console.error('Error fetching protocols:', error);
    }
  };

  const fetchAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('protocol_assessments')
        .select(`
          *,
          patients!protocol_assessments_patient_id_fkey(full_name),
          aba_protocols!protocol_assessments_protocol_id_fkey(name)
        `)
        .order('assessment_date', { ascending: false });

      if (error) throw error;
      
      const formattedAssessments = (data || []).map(assessment => ({
        ...assessment,
        scores: assessment.scores as Record<string, any>,
        next_goals: assessment.next_goals as Record<string, any>,
        patient_name: assessment.patients?.full_name || 'N/A',
        protocol_name: assessment.aba_protocols?.name || 'N/A'
      })) as ProtocolAssessment[];
      
      setAssessments(formattedAssessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
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

  const startNewAssessment = async () => {
    if (!selectedProtocol || !selectedPatient) {
      toast({
        title: "Erro",
        description: "Selecione um protocolo e um paciente",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('protocol_assessments')
        .insert({
          patient_id: selectedPatient,
          protocol_id: selectedProtocol.id,
          evaluator_id: user.id,
          assessment_date: new Date().toISOString().split('T')[0],
          status: 'em_andamento'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentAssessment({
        ...data,
        scores: {},
        next_goals: {}
      } as ProtocolAssessment);
      setShowAssessmentModal(true);
      
      // Inicializar scores
      const initialScores: Record<string, number> = {};
      Object.keys(selectedProtocol.domains).forEach(domain => {
        initialScores[domain] = 0;
      });
      setDomainScores(initialScores);

      toast({
        title: "Avaliação iniciada",
        description: "Nova avaliação criada com sucesso"
      });
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar avaliação",
        variant: "destructive"
      });
    }
  };

  const saveAssessment = async () => {
    if (!currentAssessment) return;

    try {
      const { error } = await supabase
        .from('protocol_assessments')
        .update({
          scores: domainScores,
          observations: observations,
          status: 'concluido'
        })
        .eq('id', currentAssessment.id);

      if (error) throw error;

      toast({
        title: "Avaliação salva",
        description: "Avaliação concluída com sucesso"
      });

      setShowAssessmentModal(false);
      setCurrentAssessment(null);
      setDomainScores({});
      setObservations('');
      fetchAssessments();
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar avaliação",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'pausado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const calculateProgress = (scores: Record<string, number>, protocol: ABAProtocol) => {
    if (!scores || Object.keys(scores).length === 0) return 0;
    
    const totalDomains = Object.keys(protocol.domains).length;
    const maxScorePerDomain = parseInt(protocol.scoring_system.scale.split('-')[1] || '3');
    const totalPossible = totalDomains * maxScorePerDomain;
    const totalScored = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    return Math.round((totalScored / totalPossible) * 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Brain className="h-8 w-8" />
            Protocolos ABA
          </h1>
          <p className="text-muted-foreground mt-2">
            Avaliação e acompanhamento baseado em análise comportamental aplicada
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Play className="h-4 w-4" />
              Nova Avaliação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Iniciar Nova Avaliação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Protocolo</Label>
                <Select onValueChange={(value) => {
                  const protocol = protocols.find(p => p.id === value);
                  setSelectedProtocol(protocol || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o protocolo" />
                  </SelectTrigger>
                  <SelectContent>
                    {protocols.map(protocol => (
                      <SelectItem key={protocol.id} value={protocol.id}>
                        {protocol.name} v{protocol.version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Paciente</Label>
                <Select onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient: any) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedProtocol && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800">{selectedProtocol.name}</h4>
                  <p className="text-sm text-blue-700 mt-1">{selectedProtocol.description}</p>
                  <div className="mt-2 text-xs text-blue-600">
                    <strong>Domínios:</strong> {Object.keys(selectedProtocol.domains).length} • 
                    <strong> Escala:</strong> {selectedProtocol.scoring_system.scale}
                  </div>
                </div>
              )}
              
              <Button onClick={startNewAssessment} className="w-full">
                Iniciar Avaliação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="protocolos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="protocolos">Protocolos Disponíveis</TabsTrigger>
          <TabsTrigger value="avaliacoes">Avaliações Realizadas</TabsTrigger>
          <TabsTrigger value="resultados">Resultados e Gráficos</TabsTrigger>
        </TabsList>

        <TabsContent value="protocolos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocols.map((protocol) => (
              <Card key={protocol.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      {protocol.name}
                    </CardTitle>
                    <Badge variant="outline">v{protocol.version}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {protocol.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Domínios:</span>
                      <span className="font-medium">{Object.keys(protocol.domains).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Escala:</span>
                      <span className="font-medium">{protocol.scoring_system.scale}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="text-xs font-medium text-muted-foreground mb-2">DOMÍNIOS:</h5>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(protocol.domains).slice(0, 3).map(([key, domain]: [string, any]) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {domain.description}
                        </Badge>
                      ))}
                      {Object.keys(protocol.domains).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{Object.keys(protocol.domains).length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="avaliacoes" className="space-y-4">
          {assessments.length === 0 ? (
            <EmptyState
              icon={Target}
              title="Nenhuma avaliação encontrada"
              description="Inicie uma nova avaliação para começar a acompanhar o progresso."
            />
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment) => {
                const protocol = protocols.find(p => p.id === assessment.protocol_id);
                const progress = protocol ? calculateProgress(assessment.scores || {}, protocol) : 0;
                
                return (
                  <Card key={assessment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{assessment.patient_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {assessment.protocol_name} • {new Date(assessment.assessment_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(assessment.status)}>
                            {assessment.status === 'concluido' ? 'Concluído' : 
                             assessment.status === 'em_andamento' ? 'Em Andamento' : 'Pausado'}
                          </Badge>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{progress}%</div>
                            <div className="text-xs text-muted-foreground">Progresso</div>
                          </div>
                        </div>
                      </div>
                      
                      <Progress value={progress} className="mb-4" />
                      
                      {assessment.observations && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700">{assessment.observations}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resultados" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Análise de Resultados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{assessments.length}</div>
                  <div className="text-sm text-blue-700">Avaliações Total</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {assessments.filter(a => a.status === 'concluido').length}
                  </div>
                  <div className="text-sm text-green-700">Concluídas</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {assessments.filter(a => a.status === 'em_andamento').length}
                  </div>
                  <div className="text-sm text-yellow-700">Em Andamento</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Avaliação */}
      {showAssessmentModal && selectedProtocol && currentAssessment && (
        <Dialog open={showAssessmentModal} onOpenChange={setShowAssessmentModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Avaliação {selectedProtocol.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(selectedProtocol.domains).map(([domainKey, domain]: [string, any]) => (
                  <Card key={domainKey}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{domain.description}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {domain.milestones || domain.tasks || domain.items} itens
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Label>Pontuação (0-{selectedProtocol.scoring_system.scale.split('-')[1]})</Label>
                        <div className="flex gap-2">
                          {Array.from(
                            { length: parseInt(selectedProtocol.scoring_system.scale.split('-')[1]) + 1 }, 
                            (_, i) => i
                          ).map(score => (
                            <Button
                              key={score}
                              variant={domainScores[domainKey] === score ? "default" : "outline"}
                              size="sm"
                              onClick={() => setDomainScores(prev => ({ ...prev, [domainKey]: score }))}
                            >
                              {score}
                            </Button>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {selectedProtocol.scoring_system.criteria[domainScores[domainKey]?.toString()] || 'Selecione uma pontuação'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div>
                <Label>Observações Gerais</Label>
                <Textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Registre observações sobre o comportamento, estratégias utilizadas, dificuldades encontradas..."
                  rows={4}
                />
              </div>
              
              <div className="flex gap-3">
                <Button onClick={saveAssessment} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Concluir Avaliação
                </Button>
                <Button variant="outline" onClick={() => setShowAssessmentModal(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ABAProtocols;