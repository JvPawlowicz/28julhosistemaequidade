import { useState } from "react";
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
  Calculator
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/contexts/PermissionsContext";
import { AssessmentProtocols } from "./AssessmentProtocols";

interface Patient {
  id: number;
  nome: string;
  idade: number;
  diagnostico: string;
  responsavel: string;
}

interface MedicalRecordTabsProps {
  patient: Patient;
}

const MedicalRecordTabs = ({ patient }: MedicalRecordTabsProps) => {
  const { hasPermission, getUserRole } = usePermissions();
  const { toast } = useToast();
  const [isEvolucaoOpen, setIsEvolucaoOpen] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);

  // Mock data - em um sistema real, viria do backend
  const medicalRecord = {
    historico: [
      {
        id: 1,
        data: "2024-01-15",
        terapeuta: "Dra. Ana Costa",
        tipo: "Sessão Individual",
        observacoes: "Paciente demonstrou boa evolução na comunicação verbal. Conseguiu expressar necessidades básicas com palavras simples. Trabalho focado em atenção compartilhada mostrou resultados positivos. Durante a sessão, observou-se maior iniciativa do paciente para estabelecer contato visual e solicitar objetos de interesse.",
        objetivos: ["Aumentar vocabulário funcional", "Melhorar contato visual", "Desenvolver atenção compartilhada"],
        progressos: ["Uso espontâneo de 5 palavras novas", "Mantém contato visual por 10 segundos", "Iniciou interação por conta própria 3 vezes"],
        status: "finalizada",
        assinatura: "Assinado digitalmente em 15/01/2024 às 16:30"
      },
      {
        id: 2,
        data: "2024-01-12", 
        terapeuta: "TO. Carlos Lima",
        tipo: "Terapia Ocupacional",
        observacoes: "Sessão focada em coordenação motora fina. Atividades de encaixe e empilhamento. Paciente mostrou dificuldade inicial mas conseguiu completar tarefas com apoio verbal. Observou-se melhora na preensão de objetos pequenos e maior persistência nas atividades propostas.",
        objetivos: ["Desenvolver preensão em pinça", "Melhorar coordenação bilateral", "Aumentar tempo de atenção"],
        progressos: ["Conseguiu pegar objetos pequenos usando pinça", "Empilhou 6 blocos consecutivos", "Permaneceu em atividade por 15 minutos"],
        status: "finalizada",
        assinatura: "Assinado digitalmente em 12/01/2024 às 15:45"
      },
      {
        id: 3,
        data: "2024-01-10",
        terapeuta: "Julia Mendes (Estagiária)",
        supervisor: "Dra. Ana Costa",
        tipo: "Sessão Individual",
        observacoes: "Trabalho focado em habilidades sociais básicas. Paciente participou de atividades de imitação e turnos simples. Demonstrou interesse por jogos de encaixe e atividades musicais.",
        objetivos: ["Desenvolver imitação gestual", "Praticar turnos simples", "Estimular expressão emocional"],
        progressos: ["Imitou 4 gestos diferentes", "Respeitou turnos em 2 atividades", "Demonstrou alegria durante música"],
        status: "pendente_supervisao",
        observacao_supervisao: "Evolução bem estruturada, mas seria interessante detalhar mais as estratégias utilizadas para eliciar as respostas do paciente."
      }
    ],
    planoTerapeutico: {
      id: 1,
      dataIniio: "2024-01-01",
      objetivoGeral: "Desenvolver habilidades de comunicação, interação social e autonomia para atividades de vida diária, promovendo maior independência e qualidade de vida",
      metasLongoPrazo: [
        "Comunicação funcional com frases de 3-4 palavras em contextos variados",
        "Interação social com pares de forma espontânea em ambientes estruturados", 
        "Autonomia para atividades básicas (higiene pessoal, alimentação, vestuário)",
        "Autorregulação emocional em situações de mudança ou frustração"
      ],
      objetivosCurtoPrazo: [
        "Ampliar vocabulário para 50 palavras funcionais até março/2024",
        "Manter atenção em atividade dirigida por 15 minutos consecutivos",
        "Realizar sequência de 3 comandos simples com apoio visual",
        "Expressar necessidades básicas através de palavras ou gestos"
      ],
      frequencia: "3x por semana - Psicologia (2x) e Terapia Ocupacional (1x)",
      proximaRevisao: "2024-04-15",
      ultimaAtualizacao: "2024-01-01",
      responsavel: "Dra. Ana Costa"
    },
    documentos: [
      { 
        id: 1,
        nome: "Laudo Inicial - Neuropediatra", 
        data: "2023-03-10", 
        tipo: "laudo",
        tamanho: "1.2 MB",
        responsavel: "Dr. Pedro Santos - CRM 123456"
      },
      { 
        id: 2,
        nome: "Avaliação Psicológica Inicial", 
        data: "2023-03-20", 
        tipo: "avaliacao",
        tamanho: "2.5 MB",
        responsavel: "Dra. Ana Costa - CRP 12345"
      },
      { 
        id: 3,
        nome: "Relatório TO - 1º Trimestre 2023", 
        data: "2023-06-15", 
        tipo: "relatorio",
        tamanho: "890 KB",
        responsavel: "TO. Carlos Lima - CREFITO 6789"
      },
      { 
        id: 4,
        nome: "Registro Fotográfico - Atividades", 
        data: "2024-01-10", 
        tipo: "imagem",
        tamanho: "5.2 MB",
        responsavel: "TO. Carlos Lima"
      }
    ],
    avaliacoes: [
      {
        id: 1,
        nome: "CARS-2 (Escala de Avaliação do Autismo)",
        data: "2023-03-20",
        escore: "32 pontos",
        classificacao: "Autismo Leve a Moderado",
        observacoes: "Escores elevados principalmente em comunicação verbal e não-verbal, e padrões de comportamento restritivos",
        aplicador: "Dra. Ana Costa - CRP 12345"
      },
      {
        id: 2,
        nome: "Vineland-3 (Comportamento Adaptativo)", 
        data: "2023-06-15",
        escore: "75 pontos - Percentil 5",
        classificacao: "Moderadamente Baixo",
        observacoes: "Déficits significativos principalmente nos domínios de socialização e comunicação. Melhor desempenho em habilidades de vida diária",
        aplicador: "TO. Carlos Lima - CREFITO 6789"
      },
      {
        id: 3,
        nome: "PEP-3 (Perfil Psicoeducacional)",
        data: "2023-09-10",
        escore: "Idade de desenvolvimento: 5 anos e 2 meses",
        classificacao: "Moderado",
        observacoes: "Pontos fortes em habilidades visuomotoras. Necessidades nas áreas de linguagem expressiva e habilidades sociais",
        aplicador: "Dra. Ana Costa - CRP 12345"
      }
    ]
  };

  const canEditClinicalData = hasPermission('clinical_records', 'edit');
  const canViewClinicalData = hasPermission('clinical_records', 'view');

  if (!canViewClinicalData) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Acesso Restrito</h3>
          <p className="text-muted-foreground">
            Você não tem permissão para visualizar dados clínicos deste paciente.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleNovaEvolucao = () => {
    toast({
      title: "Evolução registrada",
      description: getUserRole() === 'estagiario' 
        ? "Evolução enviada para supervisão com sucesso."
        : "Nova evolução clínica foi salva e assinada."
    });
    setIsEvolucaoOpen(false);
  };

  const handleSavePlan = () => {
    toast({
      title: "Plano atualizado",
      description: "Plano Terapêutico Individual foi salvo com sucesso."
    });
    setIsEditingPlan(false);
  };

  const getEvolutionStatusBadge = (evolution: any) => {
    if (evolution.status === 'finalizada') {
      return <Badge className="bg-success text-success-foreground">Finalizada</Badge>;
    }
    if (evolution.status === 'pendente_supervisao') {
      return <Badge className="bg-warning text-warning-foreground">Pendente Supervisão</Badge>;
    }
    return <Badge variant="outline">Rascunho</Badge>;
  };

  return (
    <Tabs defaultValue="historico" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="historico">Histórico Clínico</TabsTrigger>
        <TabsTrigger value="plano">Plano Terapêutico</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
        <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
        <TabsTrigger value="protocolos">Protocolos</TabsTrigger>
      </TabsList>

      {/* Histórico Clínico */}
      <TabsContent value="historico" className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Histórico de Evoluções Clínicas</h3>
          {canEditClinicalData && (
            <Dialog open={isEvolucaoOpen} onOpenChange={setIsEvolucaoOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <FileText className="h-4 w-4" />
                  Nova Evolução
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nova Evolução Clínica - {patient.nome}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Cabeçalho da Evolução */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">Data da Sessão</label>
                          <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Tipo de Atendimento</label>
                          <Input placeholder="Ex: Sessão Individual, Grupo" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Duração (minutos)</label>
                          <Input type="number" placeholder="50" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Conteúdo Principal */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Observações da Sessão</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Descrição detalhada da sessão</label>
                        <Textarea 
                          placeholder="Descreva as atividades realizadas, comportamento do paciente, estratégias utilizadas, resposta às intervenções..."
                          rows={6}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Objetivos e Progressos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Objetivos Trabalhados
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea 
                          placeholder="Liste os objetivos específicos trabalhados nesta sessão..."
                          rows={4}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Progressos Observados
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea 
                          placeholder="Descreva os progressos, conquistas e aspectos positivos identificados..."
                          rows={4}
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Próximos Passos */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Planejamento para Próxima Sessão</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea 
                        placeholder="Estratégias a serem mantidas, ajustes necessários, objetivos para a próxima sessão..."
                        rows={3}
                      />
                    </CardContent>
                  </Card>

                  <div className="flex gap-3">
                    <Button onClick={handleNovaEvolucao} className="flex-1 gap-2">
                      <Save className="h-4 w-4" />
                      {getUserRole() === 'estagiario' ? 'Enviar para Supervisão' : 'Assinar e Finalizar'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEvolucaoOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="space-y-6">
          {medicalRecord.historico.map((evolucao) => (
            <Card key={evolucao.id} className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <span className="font-semibold text-lg">
                        {new Date(evolucao.data).toLocaleDateString('pt-BR')}
                      </span>
                      <Badge variant="outline" className="ml-2">{evolucao.tipo}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getEvolutionStatusBadge(evolucao)}
                    <span className="text-sm text-muted-foreground">
                      {evolucao.terapeuta}
                    </span>
                  </div>
                </div>

                {/* Observações */}
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Observações da Sessão:
                    </h5>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                      {evolucao.observacoes}
                    </p>
                  </div>

                  {/* Objetivos e Progressos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6">
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Objetivos Trabalhados:
                      </h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {evolucao.objetivos.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-success" />
                        Progressos Observados:
                      </h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {evolucao.progressos.map((prog, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-success rounded-full mt-2 flex-shrink-0" />
                            {prog}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Supervisão para Estagiários */}
                  {evolucao.supervisor && (
                    <div className="pl-6 mt-4">
                      <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                        <h5 className="font-medium mb-2 flex items-center gap-2">
                          <User className="h-4 w-4 text-warning" />
                          Supervisão - {evolucao.supervisor}:
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {evolucao.observacao_supervisao}
                        </p>
                        {evolucao.status === 'pendente_supervisao' && (
                          <Badge className="bg-warning text-warning-foreground mt-2">
                            Aguardando Aprovação
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Assinatura Digital */}
                  {evolucao.assinatura && (
                    <div className="pl-6 pt-4 border-t border-medical-border">
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        {evolucao.assinatura}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Plano Terapêutico */}
      <TabsContent value="plano" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Plano Terapêutico Individual (PTI)
              </CardTitle>
              {canEditClinicalData && (
                <Button 
                  variant={isEditingPlan ? "default" : "outline"}
                  onClick={() => isEditingPlan ? handleSavePlan() : setIsEditingPlan(true)}
                  className="gap-2"
                >
                  {isEditingPlan ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditingPlan ? 'Salvar Alterações' : 'Editar Plano'}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações Gerais */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-medical-gray rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Data de Início</p>
                <p className="font-medium">{new Date(medicalRecord.planoTerapeutico.dataIniio).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Responsável</p>
                <p className="font-medium">{medicalRecord.planoTerapeutico.responsavel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próxima Revisão</p>
                <p className="font-medium">{new Date(medicalRecord.planoTerapeutico.proximaRevisao).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            {/* Objetivo Geral */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Objetivo Geral:
              </h4>
              {isEditingPlan ? (
                <Textarea 
                  defaultValue={medicalRecord.planoTerapeutico.objetivoGeral}
                  rows={3}
                />
              ) : (
                <p className="text-muted-foreground bg-medical-gray p-4 rounded-lg leading-relaxed">
                  {medicalRecord.planoTerapeutico.objetivoGeral}
                </p>
              )}
            </div>

            {/* Metas e Objetivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-secondary" />
                  Metas de Longo Prazo:
                </h4>
                {isEditingPlan ? (
                  <Textarea 
                    defaultValue={medicalRecord.planoTerapeutico.metasLongoPrazo.join('\n')}
                    rows={6}
                    placeholder="Uma meta por linha..."
                  />
                ) : (
                  <ul className="space-y-3">
                    {medicalRecord.planoTerapeutico.metasLongoPrazo.map((meta, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white font-medium text-xs mt-0.5">
                          {i + 1}
                        </div>
                        <span>{meta}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Objetivos de Curto Prazo:
                </h4>
                {isEditingPlan ? (
                  <Textarea 
                    defaultValue={medicalRecord.planoTerapeutico.objetivosCurtoPrazo.join('\n')}
                    rows={6}
                    placeholder="Um objetivo por linha..."
                  />
                ) : (
                  <ul className="space-y-3">
                    {medicalRecord.planoTerapeutico.objetivosCurtoPrazo.map((obj, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-medium text-xs mt-0.5">
                          {i + 1}
                        </div>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Frequência e Modalidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-medical-border">
              <div>
                <h5 className="font-medium mb-2">Frequência e Modalidade:</h5>
                {isEditingPlan ? (
                  <Input defaultValue={medicalRecord.planoTerapeutico.frequencia} />
                ) : (
                  <p className="text-muted-foreground">{medicalRecord.planoTerapeutico.frequencia}</p>
                )}
              </div>
              <div>
                <h5 className="font-medium mb-2">Última Atualização:</h5>
                <p className="text-muted-foreground">
                  {new Date(medicalRecord.planoTerapeutico.ultimaAtualizacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Alerta de Revisão */}
            {new Date(medicalRecord.planoTerapeutico.proximaRevisao) <= new Date() && (
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  <h5 className="font-medium text-warning">Revisão do Plano Terapêutico</h5>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Este plano está programado para revisão. Considere atualizar os objetivos com base na evolução do paciente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Documentos */}
      <TabsContent value="documentos" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos Anexados
              </CardTitle>
              {canEditClinicalData && (
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Anexar Documento
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {medicalRecord.documentos.map((doc) => (
                <Card key={doc.id} className="border hover:bg-medical-gray/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{doc.nome}</h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(doc.data).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.responsavel}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.tipo}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{doc.tamanho}</span>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Download className="h-3 w-3" />
                        Baixar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Avaliações */}
      <TabsContent value="avaliacoes" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Avaliações Padronizadas
              </CardTitle>
              {canEditClinicalData && (
                <Button className="gap-2">
                  <FileText className="h-4 w-4" />
                  Nova Avaliação
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {medicalRecord.avaliacoes.map((avaliacao) => (
                <Card key={avaliacao.id} className="border-l-4 border-l-secondary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{avaliacao.nome}</h4>
                        <p className="text-sm text-muted-foreground">
                          Aplicado em {new Date(avaliacao.data).toLocaleDateString('pt-BR')} por {avaliacao.aplicador}
                        </p>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">
                        {avaliacao.classificacao}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium text-sm mb-1">Escore Obtido:</h5>
                        <p className="text-sm">{avaliacao.escore}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-1">Classificação:</h5>
                        <p className="text-sm">{avaliacao.classificacao}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm mb-2">Observações Clínicas:</h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {avaliacao.observacoes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Protocolos de Avaliação */}
      <TabsContent value="protocolos" className="mt-6">
        <AssessmentProtocols 
          patientId={patient.id}
          diagnosis={patient.diagnostico}
          age={patient.idade}
        />
      </TabsContent>
    </Tabs>
  );
};

export default MedicalRecordTabs;