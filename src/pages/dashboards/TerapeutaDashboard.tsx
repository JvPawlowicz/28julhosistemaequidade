import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SupervisionFlow from "@/components/SupervisionFlow";
import EvolutionNotifications from "@/components/EvolutionNotifications";
import { 
  Calendar, 
  Users, 
  FileText, 
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Target,
  TrendingUp
} from "lucide-react";

const TerapeutaDashboard = () => {
  const todayAppointments = [
    {
      id: 1,
      time: "08:00",
      patient: "João Silva, 12 anos",
      type: "Individual",
      room: "Sala 3",
      status: "chegou",
      notes: "Primeira sessão pós-férias"
    },
    {
      id: 2,
      time: "09:00",
      patient: "Maria Santos, 8 anos",
      type: "Individual", 
      room: "Sala 3",
      status: "confirmado",
      notes: "Trabalhar coordenação motora"
    },
    {
      id: 3,
      time: "10:30",
      patient: "Grupo Habilidades Sociais",
      type: "Grupo",
      room: "Sala Grande",
      status: "confirmado",
      notes: "4 crianças - foco em interação"
    },
    {
      id: 4,
      time: "14:00",
      patient: "Pedro Costa, 15 anos",
      type: "Individual",
      room: "Sala 3",
      status: "remarcado",
      notes: "Reagendado para quinta-feira"
    }
  ];

  const recentPatients = [
    {
      name: "Ana Oliveira",
      age: 10,
      lastSession: "2024-01-12",
      nextGoal: "Aumentar tempo de atenção para 15min",
      progress: 75
    },
    {
      name: "Carlos Mendes", 
      age: 7,
      lastSession: "2024-01-11",
      nextGoal: "Desenvolver comunicação não-verbal",
      progress: 60
    },
    {
      name: "Beatriz Lima",
      age: 9,
      lastSession: "2024-01-10", 
      nextGoal: "Melhorar autorregulação emocional",
      progress: 85
    }
  ];

  const alerts = [
    {
      type: "urgent",
      message: "Evolução pendente - João Silva (sessão de ontem)",
      action: "Registrar agora"
    },
    {
      type: "info",
      message: "Reunião de equipe amanhã às 17h",
      action: "Ver agenda"
    },
    {
      type: "warning",
      message: "Maria Santos - 2 faltas consecutivas",
      action: "Contatar família"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'chegou': return 'bg-success text-success-foreground';
      case 'confirmado': return 'bg-primary text-primary-foreground';
      case 'remarcado': return 'bg-warning text-warning-foreground';
      case 'faltou': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Olá, Dra. Ana! 👋</h1>
        <p className="text-muted-foreground">
          Terça-feira, 15 de Janeiro de 2024 • 4 atendimentos hoje
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Meus Pacientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Evoluções Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-muted-foreground">Taxa Presença</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Agenda de Hoje
            </CardTitle>
            <CardDescription>
              Atendimentos agendados para hoje
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border border-medical-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-primary">
                      {appointment.time}
                    </div>
                    <div>
                      <p className="font-medium">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {appointment.room} • {appointment.type}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
                {appointment.notes && (
                  <p className="text-sm text-muted-foreground bg-medical-gray p-2 rounded">
                    📝 {appointment.notes}
                  </p>
                )}
                {appointment.status === 'chegou' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1">
                      Iniciar Sessão
                    </Button>
                    <Button size="sm" variant="outline">
                      Ver Prontuário
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                alert.type === 'urgent' ? 'border-destructive bg-destructive/5' :
                alert.type === 'warning' ? 'border-warning bg-warning/5' :
                'border-primary bg-primary/5'
              }`}>
                <p className="text-sm font-medium mb-2">{alert.message}</p>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  {alert.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Patients Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progresso dos Pacientes
          </CardTitle>
          <CardDescription>
            Pacientes atendidos recentemente e seus objetivos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentPatients.map((patient, index) => (
              <div key={index} className="p-4 border border-medical-border rounded-lg space-y-3">
                <div>
                  <h4 className="font-medium">{patient.name}, {patient.age} anos</h4>
                  <p className="text-sm text-muted-foreground">
                    Última sessão: {new Date(patient.lastSession).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Próximo Objetivo:</p>
                  <p className="text-sm">{patient.nextGoal}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Progresso</span>
                    <span className="font-medium">{patient.progress}%</span>
                  </div>
                  <div className="w-full bg-medical-gray rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full transition-all"
                      style={{ width: `${patient.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    Ver Prontuário
                  </Button>
                  <Button size="sm" variant="medical" className="flex-1">
                    Nova Evolução
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notificações de evoluções pendentes */}
      <div className="lg:col-span-3">
        <EvolutionNotifications />
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col gap-2">
              <FileText className="h-5 w-5" />
              Nova Evolução
            </Button>
            <Button variant="secondary" className="h-16 flex-col gap-2">
              <Users className="h-5 w-5" />
              Meus Pacientes
            </Button>
            <Button variant="medical" className="h-16 flex-col gap-2">
              <Calendar className="h-5 w-5" />
              Ver Agenda
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Target className="h-5 w-5" />
              Planos Terapêuticos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fluxo de Supervisão (só aparece para coordenadores) */}
      <SupervisionFlow />
    </div>
  );
};

export default TerapeutaDashboard;