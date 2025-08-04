import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  XCircle
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showSuccess, showInfo } from '@/utils/notifications'; // Import new notification utility

const Relatorios = () => {
  const [periodo, setPeriodo] = useState("mes");
  const [unidade, setUnidade] = useState("todas");
  const [profissional, setProfissional] = useState("todos");

  const metricas = {
    atendimentos: {
      total: 1247,
      realizados: 1180,
      faltaram: 67,
      crescimento: +12
    },
    pacientes: {
      ativos: 432,
      novos: 38,
      alta: 12,
      crescimento: +8
    },
    profissionais: {
      ativos: 24,
      utilizacao: 87,
      sessoesDia: 156,
      crescimento: +3
    },
    financeiro: {
      receita: 487500,
      particular: 65,
      convenio: 35,
      crescimento: +15
    }
  };

  const relatoriosDisponiveis = [
    {
      nome: "Relatório de Atendimentos",
      descricao: "Detalhamento completo dos atendimentos realizados",
      tipo: "atendimentos",
      formato: ["PDF", "Excel"],
      icone: Calendar
    },
    {
      nome: "Relatório de Frequência",
      descricao: "Análise de presença e faltas por paciente",
      tipo: "frequencia", 
      formato: ["PDF", "Excel"],
      icone: CheckCircle
    },
    {
      nome: "Relatório por Profissional",
      descricao: "Produtividade e métricas por terapeuta",
      tipo: "profissional",
      formato: ["PDF", "Excel"], 
      icone: Users
    },
    {
      nome: "Relatório Financeiro",
      descricao: "Análise de receitas e modalidades de pagamento",
      tipo: "financeiro",
      formato: ["PDF", "Excel"],
      icone: BarChart3
    },
    {
      nome: "Relatório por Unidade",
      descricao: "Performance e métricas por localização",
      tipo: "unidade",
      formato: ["PDF", "Excel"],
      icone: MapPin
    },
    {
      nome: "Relatório de Evolução Clínica",
      descricao: "Progresso terapêutico dos pacientes",
      tipo: "evolucao",
      formato: ["PDF"],
      icone: TrendingUp
    }
  ];

  const dadosGraficos = {
    atendimentosPorMes: [
      { mes: "Set", value: 980 },
      { mes: "Out", value: 1120 },  
      { mes: "Nov", value: 1050 },
      { mes: "Dez", value: 890 },
      { mes: "Jan", value: 1247 }
    ],
    frequenciaPorUnidade: [
      { unidade: "Centro", frequencia: 94, total: 456 },
      { unidade: "Norte", frequencia: 89, total: 342 },
      { unidade: "Sul", frequencia: 92, total: 389 }
    ],
    top5Terapeutas: [
      { nome: "Dra. Ana Costa", atendimentos: 156, frequencia: 96 },
      { nome: "TO. Carlos Lima", atendimentos: 142, frequencia: 94 },
      { nome: "Fga. Paula Silva", atendimentos: 138, frequencia: 91 },
      { nome: "Ft. Roberto Silva", atendimentos: 121, frequencia: 89 },
      { nome: "Psi. Marina Santos", atendimentos: 98, frequencia: 93 }
    ]
  };

  const handleGerarRelatorio = (tipo: string, formato: string) => {
    showInfo("Gerando relatório...", `Seu relatório em ${formato} será baixado em instantes.`);
    
    // Simular download
    setTimeout(() => {
      showSuccess("Download concluído!", `Relatório ${tipo} baixado com sucesso.`);
    }, 2000);
  };

  const getTrendColor = (value: number) => {
    return value >= 0 ? 'text-success' : 'text-destructive';
  };

  const getTrendIcon = (value: number) => {
    return value >= 0 ? TrendingUp : TrendingDown;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Relatórios e Analytics</h1>
          <p className="text-muted-foreground">
            Análises detalhadas e relatórios gerenciais
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros Avançados
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Dashboard
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Período e Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Período</Label>
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
              <Label>Unidade</Label>
              <Select value={unidade} onValueChange={setUnidade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Unidades</SelectItem>
                  <SelectItem value="centro">Centro</SelectItem>
                  <SelectItem value="norte">Norte</SelectItem>
                  <SelectItem value="sul">Sul</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Profissional</Label>
              <Select value={profissional} onValueChange={setProfissional}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ana">Dra. Ana Costa</SelectItem>
                  <SelectItem value="carlos">TO. Carlos Lima</SelectItem>
                  <SelectItem value="paula">Fga. Paula Silva</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full">Aplicar Filtros</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Atendimentos</p>
                <p className="text-2xl font-bold">{metricas.atendimentos.total}</p>
                <div className="flex items-center gap-1 text-sm">
                  {(() => {
                    const Icon = getTrendIcon(metricas.atendimentos.crescimento);
                    return (
                      <Icon className={`h-3 w-3 ${getTrendColor(metricas.atendimentos.crescimento)}`} />
                    );
                  })()}
                  <span className={getTrendColor(metricas.atendimentos.crescimento)}>
                    {metricas.atendimentos.crescimento > 0 ? '+' : ''}{metricas.atendimentos.crescimento}%
                  </span>
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
                <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
                <p className="text-2xl font-bold">{metricas.pacientes.ativos}</p>
                <div className="flex items-center gap-1 text-sm">
                  {(() => {
                    const Icon = getTrendIcon(metricas.pacientes.crescimento);
                    return (
                      <Icon className={`h-3 w-3 ${getTrendColor(metricas.pacientes.crescimento)}`} />
                    );
                  })()}
                  <span className={getTrendColor(metricas.pacientes.crescimento)}>
                    {metricas.pacientes.crescimento > 0 ? '+' : ''}{metricas.pacientes.crescimento}%
                  </span>
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
                <p className="text-sm text-muted-foreground">Taxa de Presença</p>
                <p className="text-2xl font-bold">
                  {Math.round((metricas.atendimentos.realizados / metricas.atendimentos.total) * 100)}%
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span className="text-success">Muito Boa</span>
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
                <p className="text-sm text-muted-foreground">Receita</p>
                <p className="text-2xl font-bold">
                  R$ {(metricas.financeiro.receita / 1000).toFixed(0)}k
                </p>
                <div className="flex items-center gap-1 text-sm">
                  {(() => {
                    const Icon = getTrendIcon(metricas.financeiro.crescimento);
                    return (
                      <Icon className={`h-3 w-3 ${getTrendColor(metricas.financeiro.crescimento)}`} />
                    );
                  })()}
                  <span className={getTrendColor(metricas.financeiro.crescimento)}>
                    {metricas.financeiro.crescimento > 0 ? '+' : ''}{metricas.financeiro.crescimento}%
                  </span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico Atendimentos por Mês */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Evolução de Atendimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dadosGraficos.atendimentosPorMes.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-8">{item.mes}</span>
                  <div className="flex-1 bg-medical-gray rounded-full h-4 relative">
                    <div 
                      className="bg-primary h-4 rounded-full transition-all"
                      style={{ width: `${(item.value / 1300) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-16 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 5 Terapeutas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top 5 Terapeutas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dadosGraficos.top5Terapeutas.map((terapeuta, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-medical-gray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">{terapeuta.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {terapeuta.atendimentos} atendimentos
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-success text-success-foreground">
                    {terapeuta.frequencia}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Frequência por Unidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Performance por Unidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dadosGraficos.frequenciaPorUnidade.map((unidade, i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">{unidade.unidade}</h3>
                    <div className="text-3xl font-bold text-primary mb-1">
                      {unidade.frequencia}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {unidade.total} pacientes
                    </p>
                    <div className="w-full bg-medical-gray rounded-full h-2 mt-3">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${unidade.frequencia}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Relatórios Disponíveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatoriosDisponiveis.map((relatorio, i) => (
              <Card key={i} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <relatorio.icone className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium">{relatorio.nome}</h4>
                        <p className="text-sm text-muted-foreground">
                          {relatorio.descricao}
                        </p>
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
                        className="gap-1"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;