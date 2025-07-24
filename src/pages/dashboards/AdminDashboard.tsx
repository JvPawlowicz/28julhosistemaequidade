import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Pacientes Ativos",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "primary"
    },
    {
      title: "Atendimentos Hoje",
      value: "89",
      change: "+5%",
      trend: "up", 
      icon: Calendar,
      color: "secondary"
    },
    {
      title: "Taxa de Presença",
      value: "94.5%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "success"
    },
    {
      title: "Profissionais Ativos",
      value: "24",
      change: "0%",
      trend: "stable",
      icon: Activity,
      color: "medical"
    }
  ];

  const alerts = [
    {
      id: 1,
      type: "warning",
      title: "Sala 3 - Climatização",
      description: "Ar condicionado precisa de manutenção",
      time: "2h atrás"
    },
    {
      id: 2,
      type: "info",
      title: "Backup do Sistema",
      description: "Backup diário concluído com sucesso",
      time: "6h atrás"
    },
    {
      id: 3,
      type: "urgent",
      title: "Licença Vencendo",
      description: "Sistema de prontuário eletrônico - 15 dias",
      time: "1 dia atrás"
    }
  ];

  const units = [
    {
      name: "Unidade Centro",
      patients: 423,
      staff: 12,
      status: "Operacional",
      utilization: 89
    },
    {
      name: "Unidade Norte",
      patients: 356,
      staff: 8,
      status: "Operacional",
      utilization: 76
    },
    {
      name: "Unidade Sul",
      patients: 468,
      staff: 14,
      status: "Manutenção",
      utilization: 45
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema e indicadores gerenciais
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center gap-1 ${
                  stat.trend === 'up' ? 'text-success' : 
                  stat.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                  {stat.change}
                </span>
                {" "}desde o último mês
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas do Sistema
            </CardTitle>
            <CardDescription>
              Notificações importantes que requerem atenção
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-medical-gray"
              >
                <div className={`p-1 rounded-full ${
                  alert.type === 'urgent' ? 'bg-destructive' :
                  alert.type === 'warning' ? 'bg-warning' : 'bg-primary'
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.time}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Ver Todos os Alertas
            </Button>
          </CardContent>
        </Card>

        {/* Units Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Unidades
            </CardTitle>
            <CardDescription>
              Status e ocupação das unidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {units.map((unit) => (
              <div key={unit.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{unit.name}</h4>
                  <Badge variant={unit.status === 'Operacional' ? 'default' : 'destructive'}>
                    {unit.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Pacientes</p>
                    <p className="font-medium">{unit.patients}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Equipe</p>
                    <p className="font-medium">{unit.staff}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ocupação</p>
                    <p className="font-medium">{unit.utilization}%</p>
                  </div>
                </div>
                <div className="w-full bg-medical-gray rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      unit.utilization > 80 ? 'bg-success' :
                      unit.utilization > 60 ? 'bg-warning' : 'bg-destructive'
                    }`}
                    style={{ width: `${unit.utilization}%` }}
                  />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Gerenciar Unidades
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Funcionalidades administrativas frequentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              Cadastrar Usuário
            </Button>
            <Button variant="secondary" className="h-20 flex-col gap-2">
              <MapPin className="h-6 w-6" />
              Nova Unidade
            </Button>
            <Button variant="medical" className="h-20 flex-col gap-2">
              <Activity className="h-6 w-6" />
              Relatório Geral
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;