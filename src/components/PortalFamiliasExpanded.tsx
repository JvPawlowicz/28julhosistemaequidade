import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Heart,
  Calendar,
  FileText,
  Download,
  MessageSquare,
  BookOpen,
  Users,
  Target,
  Activity,
  Brain,
  Eye,
  Ear,
  Puzzle,
  Home,
  Phone,
  Mail,
  Video,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { showSuccess } from '@/utils/notifications'; // Import new notification utility

const PortalFamiliasExpanded = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const dadosPaciente = {
    nome: "João Silva",
    idade: 8,
    condicao: "Transtorno do Espectro Autista",
    diagnostico_completo: "CID F84.0 - Autismo Infantil",
    data_inicio: "2023-03-15",
    proxima_consulta: "2024-01-30"
  };

  const terapiasAtivas = [
    {
      especialidade: "Terapia Ocupacional",
      profissional: "Marina Santos",
      frequencia: "2x por semana",
      proxima_sessao: "2024-01-26 14:00",
      objetivos: ["Coordenação motora fina", "Processamento sensorial", "Atividades de vida diária"],
      progresso: 78,
      icone: Brain
    },
    {
      especialidade: "Fonoaudiologia",
      profissional: "Paula Silva",
      frequencia: "2x por semana",
      proxima_sessao: "2024-01-25 15:30",
      objetivos: ["Comunicação social", "Linguagem expressiva", "Uso de símbolos"],
      progresso: 65,
      icone: Ear
    },
    {
      especialidade: "Psicologia",
      profissional: "Roberto Costa",
      frequencia: "1x por semana",
      proxima_sessao: "2024-01-27 10:00",
      objetivos: ["Regulação emocional", "Habilidades sociais", "Comportamentos adaptativos"],
      progresso: 72,
      icone: Heart
    }
  ];

  const orientacoesPorDeficiencia = {
    "Transtorno do Espectro Autista": {
      rotinas: [
        "Mantenha rotinas consistentes e previsíveis",
        "Use apoios visuais para facilitar transições",
        "Respeite os interesses especiais da criança",
        "Crie um ambiente sensorial adequado"
      ],
      atividades: [
        "Jogos de imitação para desenvolver habilidades sociais",
        "Atividades sensoriais com diferentes texturas",
        "Brincadeiras estruturadas com início, meio e fim",
        "Exercícios de respiração para autorregulação"
      ],
      sinais_progresso: [
        "Maior tolerância a mudanças na rotina",
        "Iniciativa em comunicação espontânea",
        "Redução de comportamentos desafiadores",
        "Maior engajamento em atividades sociais"
      ]
    }
  };

  const atividadesCasa = [
    {
      categoria: "Comunicação",
      atividades: [
        "Livro de comunicação com símbolos - 15 min/dia",
        "Brincadeira de 'faz de conta' - 20 min",
        "Cantar músicas com gestos - 10 min"
      ]
    },
    {
      categoria: "Motora",
      atividades: [
        "Desenhar formas geométricas - 10 min",
        "Atividades com massinha - 15 min",
        "Jogos de encaixe - 10 min"
      ]
    },
    {
      categoria: "Social/Emocional", 
      atividades: [
        "Jogo da memória das emoções - 15 min",
        "História social antes de sair de casa",
        "Respiração do balão quando agitado"
      ]
    }
  ];

  const recursosEducativos = [
    {
      titulo: "Guia: Compreendendo o Autismo",
      tipo: "PDF",
      descricao: "Manual completo sobre características do TEA",
      downloads: 234,
      categoria: "Educacional"
    },
    {
      titulo: "Estratégias de Comunicação Visual",
      tipo: "Vídeo",
      descricao: "Como criar e usar apoios visuais eficazes",
      duracao: "25 min",
      categoria: "Comunicação"
    },
    {
      titulo: "Atividades Sensoriais para Casa",
      tipo: "PDF",
      descricao: "50 atividades para processamento sensorial",
      downloads: 189,
      categoria: "Sensorial"
    },
    {
      titulo: "App: Rotinas Visuais",
      tipo: "Aplicativo",
      descricao: "Criador de rotinas visuais personalizadas",
      categoria: "Tecnologia"
    }
  ];

  const redeApoio = [
    {
      nome: "Grupo de Pais TEA - WhatsApp",
      tipo: "Online",
      participantes: 24,
      descricao: "Grupo de apoio e troca de experiências",
      link: "whatsapp://chat?id=123456"
    },
    {
      nome: "Encontro Mensal - Famílias",
      tipo: "Presencial",
      data: "Primeiro sábado do mês",
      local: "Centro de Reabilitação",
      participantes: 15
    },
    {
      nome: "Palestra: Direitos da Pessoa com Deficiência",
      tipo: "Evento",
      data: "15/02/2024",
      horario: "19:00",
      palestrante: "Dra. Ana Jurídica"
    }
  ];

  const documentosRecentes = [
    {
      titulo: "Relatório Trimestral - Dez/2023",
      data: "2023-12-15",
      tipo: "Relatório",
      status: "Disponível"
    },
    {
      titulo: "Plano Terapêutico Atualizado",
      data: "2024-01-10", 
      tipo: "PTI",
      status: "Disponível"
    },
    {
      titulo: "Laudo para Escola",
      data: "2024-01-05",
      tipo: "Laudo",
      status: "Disponível"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Heart className="h-8 w-8" />
            Portal das Famílias
          </h1>
          <p className="text-muted-foreground">
            Acompanhamento completo do desenvolvimento de {dadosPaciente.nome}
          </p>
        </div>

        <div className="text-right">
          <div className="text-sm text-muted-foreground">Próximo atendimento</div>
          <div className="font-semibold">{new Date(dadosPaciente.proxima_consulta).toLocaleDateString('pt-BR')}</div>
        </div>
      </div>

      {/* Informações do Paciente */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-2">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Nome</div>
              <div className="font-semibold text-lg">{dadosPaciente.nome}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Idade</div>
              <div className="font-semibold">{dadosPaciente.idade} anos</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Condição</div>
              <div className="font-semibold">{dadosPaciente.condicao}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Em acompanhamento</div>
              <div className="font-semibold">
                {Math.round((new Date().getTime() - new Date(dadosPaciente.data_inicio).getTime()) / (1000 * 60 * 60 * 24 * 30))} meses
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="orientacoes">Orientações</TabsTrigger>
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="comunidade">Comunidade</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Terapias Ativas */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Terapias em Andamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {terapiasAtivas.map((terapia, index) => (
                <Card key={index} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <terapia.icone className="h-5 w-5 text-primary" />
                        {terapia.especialidade}
                      </CardTitle>
                      <Badge variant="outline">{terapia.frequencia}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {terapia.profissional}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progresso Geral</span>
                          <span className="font-semibold">{terapia.progresso}%</span>
                        </div>
                        <Progress value={terapia.progresso} className="h-2" />
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Objetivos Atuais:</h5>
                        <div className="space-y-1">
                          {terapia.objetivos.map((objetivo, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <Target className="h-3 w-3 text-primary" />
                              {objetivo}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Próxima: {new Date(terapia.proxima_sessao).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Progresso Geral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Desenvolvimento Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-primary mb-2">72%</div>
                <div className="text-muted-foreground">Progresso Global</div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">78%</div>
                  <div className="text-xs text-muted-foreground">Motor</div>
                </div>
                <div className="text-center p-3 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">65%</div>
                  <div className="text-xs text-muted-foreground">Comunicação</div>
                </div>
                <div className="text-center p-3 bg-success/5 rounded-lg">
                  <div className="text-2xl font-bold text-success">72%</div>
                  <div className="text-xs text-muted-foreground">Social</div>
                </div>
                <div className="text-center p-3 bg-warning/5 rounded-lg">
                  <div className="text-2xl font-bold text-warning">69%</div>
                  <div className="text-xs text-muted-foreground">Cognitivo</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orientacoes" className="space-y-6">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Orientações Específicas para {dadosPaciente.condicao}</h3>
            
            {orientacoesPorDeficiencia[dadosPaciente.condicao] && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Home className="h-5 w-5 text-primary" />
                      Rotinas em Casa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orientacoesPorDeficiencia[dadosPaciente.condicao].rotinas.map((rotina, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rotina}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="h-5 w-5 text-secondary" />
                      Atividades Recomendadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orientacoesPorDeficiencia[dadosPaciente.condicao].atividades.map((atividade, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{atividade}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Star className="h-5 w-5 text-warning" />
                      Sinais de Progresso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orientacoesPorDeficiencia[dadosPaciente.condicao].sinais_progresso.map((sinal, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{sinal}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="atividades" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Atividades para Casa</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {atividadesCasa.map((categoria, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">{categoria.categoria}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoria.atividades.map((atividade, i) => (
                        <div key={i} className="p-3 bg-accent rounded-lg">
                          <span className="text-sm">{atividade}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recursos" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Recursos Educativos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recursosEducativos.map((recurso, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <h4 className="font-semibold">{recurso.titulo}</h4>
                          <Badge variant="outline" className="text-xs">{recurso.tipo}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{recurso.descricao}</p>
                        <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                          {recurso.categoria}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="gap-1">
                        <Download className="h-3 w-3" />
                        Acessar
                      </Button>
                      {recurso.downloads && (
                        <div className="text-xs text-muted-foreground self-center">
                          {recurso.downloads} downloads
                        </div>
                      )}
                      {recurso.duracao && (
                        <div className="text-xs text-muted-foreground self-center">
                          {recurso.duracao}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comunidade" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Rede de Apoio e Comunidade</h3>
            <div className="space-y-4">
              {redeApoio.map((grupo, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{grupo.nome}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{grupo.descricao}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{grupo.tipo}</Badge>
                          {grupo.participantes && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {grupo.participantes} participantes
                            </div>
                          )}
                          {grupo.data && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {grupo.data}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button className="gap-2">
                        {grupo.tipo === 'Online' ? <MessageSquare className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                        Participar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documentos" className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Documentos e Relatórios</h3>
            <div className="space-y-4">
              {documentosRecentes.map((doc, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-semibold">{doc.titulo}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{new Date(doc.data).toLocaleDateString('pt-BR')}</span>
                            <Badge variant="outline" className="text-xs">{doc.tipo}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className="bg-success/10 text-success border-success/20">
                          {doc.status}
                        </Badge>
                        <Button size="sm" className="gap-1">
                          <Download className="h-3 w-3" />
                          Baixar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortalFamiliasExpanded;