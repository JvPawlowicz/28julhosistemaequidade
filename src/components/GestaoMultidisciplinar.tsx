import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  MessageSquare, 
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  User,
  Target,
  Activity,
  Brain,
  Heart,
  Eye,
  Ear
} from "lucide-react";
import { showSuccess, showError } from '@/utils/notifications'; // Import new notification utility

const GestaoMultidisciplinar = () => {
  const [novaReuniaoOpen, setNovaReuniaoOpen] = useState(false);
  const [novoPlanoOpen, setNovoPlanoOpen] = useState(false);

  const reunioesEquipe = [
    {
      id: 1,
      paciente: "João Silva - 8 anos",
      data: "2024-01-25",
      horario: "14:00",
      status: "agendada",
      participantes: ["Dra. Ana (Coordenadora)", "Ft. Carlos (Fisioterapeuta)", "Fga. Paula (Fonoaudióloga)", "TO. Marina (T.O.)"],
      objetivos: ["Revisar PTI", "Discutir progresso motor", "Alinhar metas trimestrais"],
      tipo: "multidisciplinar"
    },
    {
      id: 2,
      paciente: "Maria Santos - 12 anos",
      data: "2024-01-23",
      horario: "15:30",
      status: "concluida",
      participantes: ["Psi. Roberto", "Fga. Paula", "Família Santos"],
      objetivos: ["Transição escolar", "Suporte familiar", "CAA avançada"],
      tipo: "familia_equipe"
    },
    {
      id: 3,
      paciente: "Pedro Costa - 6 years",
      data: "2024-01-22",
      horario: "09:00",
      status: "concluida",
      participantes: ["TO. Marina", "Ft. Carlos", "Neuropediatra"],
      objetivos: ["Tecnologia assistiva", "Adaptações ambientais"],
      tipo: "especialistas"
    }
  ];

  const planosIntegrados = [
    {
      id: 1,
      paciente: "Ana Oliveira",
      condicao: "Paralisia Cerebral",
      especialidades: [
        { nome: "Fisioterapia", profissional: "Carlos Lima", frequencia: "3x/semana", objetivo: "Melhora do controle postural" },
        { nome: "Terapia Ocupacional", profissional: "Marina Santos", frequencia: "2x/semana", objetivo: "Independência nas AVDs" },
        { nome: "Fonoaudiologia", profissional: "Paula Silva", frequencia: "2x/semana", objetivo: "Comunicação alternativa" }
      ],
      metas_integradas: [
        "Sentar sem apoio por 10 minutos",
        "Usar tablet para comunicação básica",
        "Comer com adaptações independentemente"
      ],
      progresso_geral: 68,
      ultima_revisao: "2024-01-15"
    },
    {
      id: 2,
      paciente: "Lucas Ferreira",
      condicao: "Transtorno do Espectro Autista",
      especialidades: [
        { nome: "Psicologia", profissional: "Roberto Silva", frequencia: "2x/semana", objetivo: "Regulação emocional" },
        { nome: "Fonoaudiologia", profissional: "Paula Silva", frequencia: "2x/semana", objetivo: "Comunicação social" },
        { nome: "Terapia Ocupacional", profissional: "Marina Santos", frequencia: "1x/semana", objetivo: "Processamento sensorial" }
      ],
      metas_integradas: [
        "Tolerar ambientes com mais estímulos",
        "Iniciar conversas espontâneas",
        "Participar de atividades em grupo"
      ],
      progresso_geral: 74,
      ultima_revisao: "2024-01-18"
    }
  ];

  const comunicacoes = [
    {
      id: 1,
      de: "Dra. Ana Costa",
      para: "Equipe Multidisciplinar",
      assunto: "Protocolo de Avaliação - João Silva",
      mensagem: "Pessoal, precisamos revisar o protocolo de avaliação do João. Observei melhoras significativas na coordenação motora.",
      timestamp: "2024-01-24 10:30",
      tipo: "protocolo",
      prioridade: "normal"
    },
    {
      id: 2,
      de: "Ft. Carlos Lima",
      para: "TO. Marina Santos",
      assunto: "Transferências - Paciente Ana",
      mensagem: "Marina, a Ana está conseguindo fazer transferências com menos apoio. Podemos avançar nas atividades de T.O.?",
      timestamp: "2024-01-24 08:15",
      tipo: "colaboracao",
      prioridade: "normal"
    },
    {
      id: 3,
      de: "Sistema",
      para: "Equipe",
      assunto: "URGENTE: Supervisão Pendente",
      mensagem: "Existem 3 evoluções pendentes de supervisão que precisam ser revisadas até amanhã.",
      timestamp: "2024-01-24 07:00",
      tipo: "supervisao",
      prioridade: "alta"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada': return 'bg-primary/10 text-primary border-primary/20';
      case 'concluida': return 'bg-success/10 text-success border-success/20';
      case 'cancelada': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'media': return 'bg-warning/10 text-warning border-warning/20';
      case 'baixa': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const agendarReuniao = () => {
    showSuccess("Reunião agendada!", "A reunião multidisciplinar foi agendada com sucesso.");
    setNovaReuniaoOpen(false);
  };

  const criarPlano = () => {
    showSuccess("Plano criado!", "O novo plano terapêutico integrado foi criado.");
    setNovoPlanoOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Users className="h-8 w-8" />
            Gestão Multidisciplinar
          </h1>
          <p className="text-muted-foreground">
            Coordenação integrada entre especialidades e comunicação da equipe
          </p>
        </div>

        <div className="flex gap-3">
          <Dialog open={novaReuniaoOpen} onOpenChange={setNovaReuniaoOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Calendar className="h-4 w-4" />
                Nova Reunião
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agendar Reunião Multidisciplinar</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Paciente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joao">João Silva</SelectItem>
                      <SelectItem value="maria">Maria Santos</SelectItem>
                      <SelectItem value="ana">Ana Oliveira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Horário</Label>
                    <Input type="time" />
                  </div>
                </div>

                <div>
                  <Label>Tipo de Reunião</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multidisciplinar">Multidisciplinar</SelectItem>
                      <SelectItem value="familia">Família + Equipe</SelectItem>
                      <SelectItem value="especialistas">Entre Especialistas</SelectItem>
                      <SelectItem value="supervisao">Supervisão Clínica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Objetivos da Reunião</Label>
                  <Textarea placeholder="Descreva os objetivos e pontos a serem discutidos..." />
                </div>

                <Button onClick={agendarReuniao} className="w-full">
                  Agendar Reunião
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={novoPlanoOpen} onOpenChange={setNovoPlanoOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Target className="h-4 w-4" />
                Novo Plano Integrado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Plano Terapêutico Integrado</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Paciente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joao">João Silva</SelectItem>
                      <SelectItem value="maria">Maria Santos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Condição Principal</Label>
                  <Input placeholder="Ex: Paralisia Cerebral, TEA, Deficiência Intelectual..." />
                </div>

                <div>
                  <Label>Metas Integradas</Label>
                  <Textarea placeholder="Liste as metas que envolvem múltiplas especialidades..." />
                </div>

                <Button onClick={criarPlano} className="w-full">
                  Criar Plano Integrado
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="reunioes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reunioes">Reuniões de Equipe</TabsTrigger>
          <TabsTrigger value="planos">Planos Integrados</TabsTrigger>
          <TabsTrigger value="comunicacao">Comunicação</TabsTrigger>
          <TabsTrigger value="supervisao">Supervisão</TabsTrigger>
        </TabsList>

        <TabsContent value="reunioes" className="space-y-4">
          <div className="space-y-4">
            {reunioesEquipe.map((reuniao) => (
              <Card key={reuniao.id} className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{reuniao.paciente}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(reuniao.data).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {reuniao.horario}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(reuniao.status)}>
                      {reuniao.status === 'agendada' ? 'Agendada' : reuniao.status === 'concluida' ? 'Concluída' : 'Cancelada'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="font-medium mb-2">Participantes:</h5>
                      <div className="space-y-1">
                        {reuniao.participantes.map((participante, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <User className="h-3 w-3" />
                            {participante}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Objetivos:</h5>
                      <div className="space-y-1">
                        {reuniao.objetivos.map((objetivo, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Target className="h-3 w-3" />
                            {objetivo}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      Ver Ata
                    </Button>
                    {reuniao.status === 'agendada' && (
                      <Button size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Iniciar Reunião
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planos" className="space-y-4">
          <div className="space-y-6">
            {planosIntegrados.map((plano) => (
              <Card key={plano.id} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{plano.paciente}</CardTitle>
                      <p className="text-muted-foreground">{plano.condicao}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{plano.progresso_geral}%</div>
                      <div className="text-sm text-muted-foreground">Progresso Geral</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Especialidades */}
                    <div>
                      <h4 className="font-semibold mb-3">Equipe Multidisciplinar</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {plano.especialidades.map((esp, i) => (
                          <Card key={i} className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                <span className="font-medium text-sm">{esp.nome}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <p>{esp.profissional}</p>
                                <p>{esp.frequencia}</p>
                              </div>
                              <p className="text-xs bg-muted p-2 rounded">{esp.objetivo}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Metas Integradas */}
                    <div>
                      <h4 className="font-semibold mb-3">Metas Integradas</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {plano.metas_integradas.map((meta, i) => (
                          <div key={i} className="flex items-start gap-2 p-3 bg-accent rounded-lg">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                            <span className="text-sm">{meta}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Última revisão: {new Date(plano.ultima_revisao).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Editar Plano
                        </Button>
                        <Button size="sm">
                          Revisar Metas
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comunicacao" className="space-y-4">
          <div className="space-y-4">
            {comunicacoes.map((comm) => (
              <Card key={comm.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comm.de}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-muted-foreground">{comm.para}</span>
                        <Badge className={getPrioridadeColor(comm.prioridade)} variant="outline">
                          {comm.prioridade}
                        </Badge>
                      </div>
                      <h4 className="font-medium">{comm.assunto}</h4>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(comm.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{comm.mensagem}</p>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Responder
                    </Button>
                    {comm.tipo === 'supervisao' && (
                      <Button size="sm">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Marcar como Resolvido
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="supervisao" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  Pendências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Evoluções para revisar</span>
                    <Badge className="bg-warning/10 text-warning border-warning/20">3</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Planos para aprovar</span>
                    <Badge className="bg-primary/10 text-primary border-primary/20">2</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Relatórios atrasados</span>
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">1</Badge>
                  </div>
                </div>
                <Button className="w-full mt-4" size="sm">
                  Ver Todas Pendências
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Concluídas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success mb-2">12</div>
                  <div className="text-sm text-muted-foreground">Supervisões esta semana</div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Ver Histórico
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Estagiários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Ana Julia</span>
                    <Badge className="ml-2 bg-success/10 text-success border-success/20" variant="outline">5 supervisões</Badge>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Pedro Santos</span>
                    <Badge className="ml-2 bg-warning/10 text-warning border-warning/20" variant="outline">2 pendentes</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  Gerenciar Supervisões
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestaoMultidisciplinar;