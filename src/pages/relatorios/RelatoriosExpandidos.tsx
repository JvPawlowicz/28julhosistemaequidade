import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Download, 
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Filter,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Brain,
  Heart,
  Eye,
  Ear,
  Target,
  Award,
  BookOpen
} from "lucide-react";
import { showSuccess, showInfo } from '@/utils/notifications'; // Import new notification utility

const RelatoriosExpandidos = () => {
  const [periodo, setPeriodo] = useState("mes");
  const [unidade, setUnidade] = useState("todas");
  const [especialidade, setEspecialidade] = useState("todas");
  const [deficiencia, setDeficiencia] = useState("todas");

  const metricas = {
    atendimentos: {
      total: 1847,
      fisioterapia: 523,
      fonoaudiologia: 412,
      terapia_ocupacional: 398,
      psicologia: 314,
      neuropsicologia: 200,
      crescimento: +15
    },
    pacientes: {
      ativos: 687,
      deficiencia_intelectual: 245,
      deficiencia_fisica: 178,
      tea: 134,
      deficiencia_visual: 67,
      deficiencia_auditiva: 63,
      crescimento: +12
    },
    profissionais: {
      fisioterapeutas: 8,
      fonoaudiologos: 6,
      terapeutas_ocupacionais: 7,
      psicologos: 5,
      neuropsicologos: 3,
      utilizacao_media: 89
    },
    outcomes: {
      melhoria_funcional: 78,
      aderencia_tratamento: 84,
      satisfacao_familias: 92,
      objetivos_alcancados: 71
    }
  };

  const especialidades = [
    { nome: "Fisioterapia", icone: Activity, cor: "text-blue-600", pacientes: 245, sessoes: 523 },
    { nome: "Fonoaudiologia", icone: Ear, cor: "text-green-600", pacientes: 198, sessoes: 412 },
    { nome: "Terapia Ocupacional", icone: Brain, cor: "text-purple-600", pacientes: 187, sessoes: 398 },
    { nome: "Psicologia", icone: Heart, cor: "text-red-600", pacientes: 142, sessoes: 314 },
    { nome: "Neuropsicologia", icone: Target, cor: "text-indigo-600", pacientes: 89, sessoes: 200 }
  ];

  const relatoriosEspecializados = [
    {
      nome: "Relatório Multidisciplinar",
      descricao: "Análise integrada do progresso por todas as especialidades",
      tipo: "multidisciplinar",
      formato: ["PDF", "Excel"],
      icone: Users,
      especialidades: ["Fisioterapia", "Fonoaudiologia", "T.O.", "Psicologia"]
    },
    {
      nome: "Laudos para Benefícios",
      descricao: "Relatórios técnicos para BPC, INSS e outros benefícios sociais",
      tipo: "laudo_social",
      formato: ["PDF"],
      icone: FileText,
      especialidades: ["Médico", "Psicologia", "Fisioterapia"]
    },
    {
      nome: "Relatório Educacional",
      descricao: "Documento para instituições de ensino e adaptações pedagógicas",
      tipo: "educacional",
      formato: ["PDF", "Word"],
      icone: BookOpen,
      especialidades: ["Psicopedagogia", "Terapia Ocupacional"]
    },
    {
      nome: "Evolução por Deficiência",
      descricao: "Progresso específico por tipo de deficiência ou condição",
      tipo: "deficiencia",
      formato: ["PDF", "Excel"],
      icone: TrendingUp,
      especialidades: ["Todas"]
    },
    {
      nome: "Planos Terapêuticos Individualizados",
      descricao: "PTI com objetivos, metas e cronograma de tratamento",
      tipo: "pti",
      formato: ["PDF", "Word"],
      icone: Target,
      especialidades: ["Todas"]
    },
    {
      nome: "Relatório de Tecnologia Assistiva",
      descricao: "Recomendações e prescrições de equipamentos e adaptações",
      tipo: "tecnologia_assistiva",
      formato: ["PDF"],
      icone: Award,
      especialidades: ["Terapia Ocupacional", "Fisioterapia"]
    }
  ];

  const dadosDeficiencias = [
    { tipo: "Deficiência Intelectual", pacientes: 245, progresso_medio: 76, icone: Brain },
    { tipo: "Deficiência Física/Motora", pacientes: 178, progresso_medio: 82, icone: Activity },
    { tipo: "Transtorno do Espectro Autista", pacientes: 134, progresso_medio: 71, icone: Target },
    { tipo: "Deficiência Visual", pacientes: 67, progresso_medio: 85, icone: Eye },
    { tipo: "Deficiência Auditiva", pacientes: 63, progresso_medio: 88, icone: Ear }
  ];

  const handleGerarRelatorio = (tipo: string, formato: string) => {
    showInfo("Gerando relatório multidisciplinar...", `Seu relatório especializado em ${formato} será processado.`);
    
    setTimeout(() => {
      showSuccess("Relatório gerado com sucesso!", `Relatório ${tipo} disponível para download.`);
    }, 2500);
  };

  const getTrendColor = (value: number) => {
    return value >= 75 ? 'text-success' : value >= 50 ? 'text-warning' : 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Relatórios Multidisciplinares</h1>
          <p className="text-muted-foreground">
            Análises especializadas por deficiência, especialidade e resultados terapêuticos
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avançados
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Dashboard Completo
          </Button>
        </div>
      </div>

      {/* Filtros Expandidos */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Parâmetros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Período</label>
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semana">Esta Semana</SelectItem>
                  <SelectItem value="mes">Este Mês</SelectItem>
                  <SelectItem value="trimestre">Trimestre</SelectItem>
                  <SelectItem value="ano">Este Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Unidade</label>
              <Select value={unidade} onValueChange={setUnidade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Unidades</SelectItem>
                  <SelectItem value="centro">Centro de Reabilitação</SelectItem>
                  <SelectItem value="norte">Unidade Norte</SelectItem>
                  <SelectItem value="sul">Unidade Sul</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Especialidade</label>
              <Select value={especialidade} onValueChange={setEspecialidade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
                  <SelectItem value="fonoaudiologia">Fonoaudiologia</SelectItem>
                  <SelectItem value="to">Terapia Ocupacional</SelectItem>
                  <SelectItem value="psicologia">Psicologia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Tipo de Deficiência</label>
              <Select value={deficiencia} onValueChange={setDeficiencia}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="intelectual">Deficiência Intelectual</SelectItem>
                  <SelectItem value="fisica">Deficiência Física</SelectItem>
                  <SelectItem value="tea">Transtorno do Espectro Autista</SelectItem>
                  <SelectItem value="visual">Deficiência Visual</SelectItem>
                  <SelectItem value="auditiva">Deficiência Auditiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full">Aplicar Filtros</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="especialidades">Por Especialidade</TabsTrigger>
          <TabsTrigger value="deficiencias">Por Deficiência</TabsTrigger>
          <TabsTrigger value="outcomes">Resultados Clínicos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios Especializados</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Atendimentos Totais</p>
                    <p className="text-2xl font-bold">{metricas.atendimentos.total}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-success">+{metricas.atendimentos.crescimento}%</span>
                    </div>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pessoas Atendidas</p>
                    <p className="text-2xl font-bold">{metricas.pacientes.ativos}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <span className="text-success">+{metricas.pacientes.crescimento}%</span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Profissionais Ativos</p>
                    <p className="text-2xl font-bold">29</p>
                    <div className="flex items-center gap-1 text-sm">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span className="text-success">{metricas.profissionais.utilizacao_media}% Utilização</span>
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Satisfação Familiar</p>
                    <p className="text-2xl font-bold">{metricas.outcomes.satisfacao_familias}%</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Heart className="h-3 w-3 text-success" />
                      <span className="text-success">Excelente</span>
                    </div>
                  </div>
                  <Heart className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="especialidades" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {especialidades.map((esp, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 bg-primary rounded-lg">
                        <esp.icone className="h-5 w-5 text-white" />
                      </div>
                      {esp.nome}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pessoas Atendidas</span>
                      <span className="font-semibold">{esp.pacientes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sessões Realizadas</span>
                      <span className="font-semibold">{esp.sessoes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Média por Pessoa</span>
                      <span className="font-semibold">{Math.round(esp.sessoes / esp.pacientes)}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deficiencias" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dadosDeficiencias.map((def, index) => (
              <Card key={index} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <def.icone className="h-5 w-5 text-primary" />
                    {def.tipo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-primary mb-2">{def.pacientes}</div>
                    <div className="text-sm text-muted-foreground">pessoas atendidas</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso Médio</span>
                      <span className={`font-semibold ${getTrendColor(def.progresso_medio)}`}>
                        {def.progresso_medio}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${def.progresso_medio}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Resultados Funcionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Melhoria Funcional</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{ width: `${metricas.outcomes.melhoria_funcional}%` }} />
                      </div>
                      <span className="font-bold text-success">{metricas.outcomes.melhoria_funcional}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Aderência ao Tratamento</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${metricas.outcomes.aderencia_tratamento}%` }} />
                      </div>
                      <span className="font-bold text-primary">{metricas.outcomes.aderencia_tratamento}%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Objetivos Alcançados</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-warning h-2 rounded-full" style={{ width: `${metricas.outcomes.objetivos_alcancados}%` }} />
                      </div>
                      <span className="font-bold text-warning">{metricas.outcomes.objetivos_alcancados}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Satisfação e Engajamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-6xl font-bold text-success mb-2">{metricas.outcomes.satisfacao_familias}%</div>
                  <div className="text-lg text-muted-foreground mb-4">Satisfação das Famílias</div>
                  <Badge className="bg-success/10 text-success border-success/20">
                    Nível Excelente
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatoriosEspecializados.map((relatorio, i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary rounded-lg">
                        <relatorio.icone className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{relatorio.nome}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {relatorio.descricao}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {relatorio.especialidades.map((esp, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {esp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {relatorio.formato.map((formato, j) => (
                      <Button
                        key={j}
                        size="sm"
                        variant="outline"
                        onClick={() => handleGerarRelatorio(relatorio.tipo, formato)}
                        className="gap-1 flex-1"
                      >
                        <Download className="h-3 w-3" />
                        {formato}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RelatoriosExpandidos;