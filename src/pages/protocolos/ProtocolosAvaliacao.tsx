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
  Award,
  Heart,
  Eye,
  Ear,
  Activity,
  Puzzle,
  ClipboardCheck
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/EmptyState";

interface ProtocoloAvaliacao {
  id: string;
  name: string;
  version: string;
  description: string;
  domains: Record<string, any>;
  scoring_system: Record<string, any>;
  categoria: string;
  especialidades: string[];
}

interface AvaliacaoProtocolo {
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

const ProtocolosAvaliacao = () => {
  const [protocolos, setProtocolos] = useState<ProtocoloAvaliacao[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoProtocolo[]>([]);
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<ProtocoloAvaliacao | null>(null);
  const [pacienteSelecionado, setPacienteSelecionado] = useState('');
  const [pacientes, setPacientes] = useState([]);
  const [avaliacaoAtual, setAvaliacaoAtual] = useState<AvaliacaoProtocolo | null>(null);
  const [pontacoesDominio, setPontacoesDominio] = useState<Record<string, number>>({});
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
  const { toast } = useToast();

  // Protocolos expandidos para diferentes deficiências
  const protocolosEspecializados = [
    {
      categoria: "Deficiência Intelectual",
      icone: Brain,
      protocolos: ["WISC-V", "Bayley-III", "ABAS-3", "Vineland-3"]
    },
    {
      categoria: "Deficiência Física/Motora", 
      icone: Activity,
      protocolos: ["GMFCS", "MACS", "WeeFIM", "PEDI-CAT"]
    },
    {
      categoria: "Deficiência Visual",
      icone: Eye,
      protocolos: ["Protocolo de Orientação e Mobilidade", "Avaliação Funcional da Visão"]
    },
    {
      categoria: "Deficiência Auditiva",
      icone: Ear,
      protocolos: ["CAP", "SIR", "MAIS/MUSS", "IT-MAIS"]
    },
    {
      categoria: "Transtorno do Espectro Autista",
      icone: Puzzle,
      protocolos: ["VB-MAPP", "ABLLS-R", "DENVER", "PEP-3"]
    },
    {
      categoria: "Múltiplas Deficiências",
      icone: Target,
      protocolos: ["Avaliação Multidisciplinar", "Plano Educacional Individualizado"]
    }
  ];

  useEffect(() => {
    fetchProtocolos();
    fetchAvaliacoes();
    fetchPacientes();
  }, []);

  const fetchProtocolos = async () => {
    try {
      const { data, error } = await supabase
        .from('aba_protocols')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      
      // Expandir protocolos com novas categorias
      const protocolosExpandidos = (data || []).map(p => ({
        ...p,
        domains: p.domains as Record<string, any>,
        scoring_system: p.scoring_system as Record<string, any>,
        categoria: p.name.includes('VB-MAPP') || p.name.includes('ABLLS') || p.name.includes('DENVER') ? 'Transtorno do Espectro Autista' : 'Avaliação Geral',
        especialidades: ['Terapia Ocupacional', 'Fonoaudiologia', 'Fisioterapia', 'Psicologia']
      }));
      
      setProtocolos(protocolosExpandidos);
    } catch (error) {
      console.error('Error fetching protocols:', error);
    }
  };

  const fetchAvaliacoes = async () => {
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
      
      const avaliacoesFormatadas = (data || []).map(avaliacao => ({
        ...avaliacao,
        scores: avaliacao.scores as Record<string, any>,
        next_goals: avaliacao.next_goals as Record<string, any>,
        patient_name: avaliacao.patients?.full_name || 'N/A',
        protocol_name: avaliacao.aba_protocols?.name || 'N/A'
      })) as AvaliacaoProtocolo[];
      
      setAvaliacoes(avaliacoesFormatadas);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPacientes = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, full_name')
        .order('full_name');

      if (error) throw error;
      setPacientes(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const iniciarNovaAvaliacao = async () => {
    if (!protocoloSelecionado || !pacienteSelecionado) {
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
          patient_id: pacienteSelecionado,
          protocol_id: protocoloSelecionado.id,
          evaluator_id: user.id,
          assessment_date: new Date().toISOString().split('T')[0],
          status: 'em_andamento'
        })
        .select()
        .single();

      if (error) throw error;

      setAvaliacaoAtual({
        ...data,
        scores: {},
        next_goals: {}
      } as AvaliacaoProtocolo);
      setShowAvaliacaoModal(true);
      
      // Inicializar pontuações
      const pontuacoesIniciais: Record<string, number> = {};
      Object.keys(protocoloSelecionado.domains).forEach(dominio => {
        pontuacoesIniciais[dominio] = 0;
      });
      setPontacoesDominio(pontuacoesIniciais);

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

  const salvarAvaliacao = async () => {
    if (!avaliacaoAtual) return;

    try {
      const { error } = await supabase
        .from('protocol_assessments')
        .update({
          scores: pontacoesDominio,
          observations: observacoes,
          status: 'concluido'
        })
        .eq('id', avaliacaoAtual.id);

      if (error) throw error;

      toast({
        title: "Avaliação salva",
        description: "Avaliação concluída com sucesso"
      });

      setShowAvaliacaoModal(false);
      setAvaliacaoAtual(null);
      setPontacoesDominio({});
      setObservacoes('');
      fetchAvaliacoes();
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
      case 'concluido': return 'bg-success/10 text-success border-success/20';
      case 'em_andamento': return 'bg-warning/10 text-warning border-warning/20';
      case 'pausado': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const calcularProgresso = (scores: Record<string, number>, protocolo: ProtocoloAvaliacao) => {
    if (!scores || Object.keys(scores).length === 0) return 0;
    
    const totalDominios = Object.keys(protocolo.domains).length;
    const maxPontuacaoPorDominio = parseInt(protocolo.scoring_system.scale?.split('-')[1] || '3');
    const totalPossivel = totalDominios * maxPontuacaoPorDominio;
    const totalPontuado = Object.values(scores).reduce((sum, score) => sum + score, 0);
    
    return Math.round((totalPontuado / totalPossivel) * 100);
  };

  const protocolosFiltrados = categoriaFiltro === 'todos' 
    ? protocolos 
    : protocolos.filter(p => p.categoria === categoriaFiltro);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
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
            <ClipboardCheck className="h-8 w-8" />
            Protocolos de Avaliação
          </h1>
          <p className="text-muted-foreground mt-2">
            Avaliações funcionais multidisciplinares para diferentes deficiências e necessidades especiais
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Play className="h-4 w-4" />
              Nova Avaliação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Iniciar Nova Avaliação Funcional</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Protocolo de Avaliação</Label>
                <Select onValueChange={(value) => {
                  const protocolo = protocolos.find(p => p.id === value);
                  setProtocoloSelecionado(protocolo || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o protocolo" />
                  </SelectTrigger>
                  <SelectContent>
                    {protocolos.map(protocolo => (
                      <SelectItem key={protocolo.id} value={protocolo.id}>
                        {protocolo.name} v{protocolo.version}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Pessoa Avaliada</Label>
                <Select onValueChange={setPacienteSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a pessoa" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((paciente: any) => (
                      <SelectItem key={paciente.id} value={paciente.id}>
                        {paciente.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {protocoloSelecionado && (
                <div className="bg-accent p-4 rounded-lg">
                  <h4 className="font-semibold text-accent-foreground">{protocoloSelecionado.name}</h4>
                  <p className="text-sm text-accent-foreground/70 mt-1">{protocoloSelecionado.description}</p>
                  <div className="mt-2 text-xs text-accent-foreground/60">
                    <strong>Domínios:</strong> {Object.keys(protocoloSelecionado.domains).length} • 
                    <strong> Categoria:</strong> {protocoloSelecionado.categoria}
                  </div>
                </div>
              )}
              
              <Button onClick={iniciarNovaAvaliacao} className="w-full">
                Iniciar Avaliação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="protocolos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="protocolos">Protocolos Disponíveis</TabsTrigger>
          <TabsTrigger value="categorias">Por Deficiência</TabsTrigger>
          <TabsTrigger value="avaliacoes">Avaliações Realizadas</TabsTrigger>
          <TabsTrigger value="resultados">Análise de Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="protocolos" className="space-y-4">
          <div className="flex gap-4 mb-6">
            <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as categorias</SelectItem>
                <SelectItem value="Transtorno do Espectro Autista">TEA</SelectItem>
                <SelectItem value="Deficiência Intelectual">Deficiência Intelectual</SelectItem>
                <SelectItem value="Deficiência Física/Motora">Deficiência Física</SelectItem>
                <SelectItem value="Avaliação Geral">Avaliação Geral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocolosFiltrados.map((protocolo) => (
              <Card key={protocolo.id} className="hover:shadow-md transition-shadow border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5 text-primary" />
                      {protocolo.name}
                    </CardTitle>
                    <Badge variant="outline">v{protocolo.version}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Badge className="mb-2 bg-secondary/10 text-secondary border-secondary/20">
                      {protocolo.categoria}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {protocolo.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Domínios Avaliados:</span>
                      <span className="font-medium">{Object.keys(protocolo.domains).length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Escala de Pontuação:</span>
                      <span className="font-medium">{protocolo.scoring_system.scale}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="text-xs font-medium text-muted-foreground mb-2">ÁREAS DE DESENVOLVIMENTO:</h5>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(protocolo.domains).slice(0, 3).map(([key, domain]: [string, any]) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {domain.description || key}
                        </Badge>
                      ))}
                      {Object.keys(protocolo.domains).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{Object.keys(protocolo.domains).length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {protocolosEspecializados.map((categoria, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary rounded-lg">
                      <categoria.icone className="h-6 w-6 text-white" />
                    </div>
                    {categoria.categoria}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categoria.protocolos.map((protocolo, pIndex) => (
                      <div key={pIndex} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">{protocolo}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Ver Protocolos
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="avaliacoes" className="space-y-4">
          {avaliacoes.length === 0 ? (
            <EmptyState
              icon={Target}
              title="Nenhuma avaliação encontrada"
              description="Inicie uma nova avaliação funcional para começar a acompanhar o desenvolvimento."
            />
          ) : (
            <div className="space-y-4">
              {avaliacoes.map((avaliacao) => {
                const protocolo = protocolos.find(p => p.id === avaliacao.protocol_id);
                const progresso = protocolo ? calcularProgresso(avaliacao.scores || {}, protocolo) : 0;
                
                return (
                  <Card key={avaliacao.id} className="border-2">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{avaliacao.patient_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {avaliacao.protocol_name} • {new Date(avaliacao.assessment_date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(avaliacao.status)}>
                            {avaliacao.status === 'concluido' ? 'Concluída' : 
                             avaliacao.status === 'em_andamento' ? 'Em Andamento' : 'Pausada'}
                          </Badge>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{progresso}%</div>
                            <div className="text-xs text-muted-foreground">Desenvolvimento</div>
                          </div>
                        </div>
                      </div>
                      
                      <Progress value={progresso} className="mb-4" />
                      
                      {avaliacao.observations && (
                        <div className="bg-accent p-3 rounded-lg">
                          <p className="text-sm text-accent-foreground">{avaliacao.observations}</p>
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
                Panorama de Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{avaliacoes.length}</div>
                  <div className="text-sm text-primary/70">Avaliações Totais</div>
                </div>
                <div className="text-center p-4 bg-success/5 border border-success/20 rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    {avaliacoes.filter(a => a.status === 'concluido').length}
                  </div>
                  <div className="text-sm text-success/70">Concluídas</div>
                </div>
                <div className="text-center p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <div className="text-2xl font-bold text-warning">
                    {avaliacoes.filter(a => a.status === 'em_andamento').length}
                  </div>
                  <div className="text-sm text-warning/70">Em Andamento</div>
                </div>
                <div className="text-center p-4 bg-secondary/5 border border-secondary/20 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {Math.round(avaliacoes.filter(a => a.status === 'concluido').length / Math.max(avaliacoes.length, 1) * 100)}%
                  </div>
                  <div className="text-sm text-secondary/70">Taxa de Conclusão</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Avaliação */}
      {showAvaliacaoModal && protocoloSelecionado && avaliacaoAtual && (
        <Dialog open={showAvaliacaoModal} onOpenChange={setShowAvaliacaoModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Avaliação: {protocoloSelecionado.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(protocoloSelecionado.domains).map(([dominio, config]: [string, any]) => (
                  <Card key={dominio} className="border-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{config.description || dominio}</CardTitle>
                      <p className="text-sm text-muted-foreground">{config.items?.length || 0} itens</p>
                    </CardHeader>
                    <CardContent>
                      <Label className="text-sm font-medium">Pontuação (0-{protocoloSelecionado.scoring_system.scale?.split('-')[1] || 3})</Label>
                      <div className="flex gap-2 mt-2">
                        {[...Array(parseInt(protocoloSelecionado.scoring_system.scale?.split('-')[1] || '3') + 1)].map((_, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant={pontacoesDominio[dominio] === i ? "default" : "outline"}
                            onClick={() => setPontacoesDominio(prev => ({ ...prev, [dominio]: i }))}
                          >
                            {i}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div>
                <Label>Observações Gerais</Label>
                <Textarea
                  placeholder="Observações sobre a avaliação, recomendações e próximos objetivos..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowAvaliacaoModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={salvarAvaliacao}>
                  Salvar Avaliação
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProtocolosAvaliacao;