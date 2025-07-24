import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  MessageSquare, 
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const ResponsavelDashboard = () => {
  const patientInfo = {
    name: "Maria Oliveira Santos",
    age: 8,
    diagnosis: "TEA - Transtorno do Espectro Autista",
    therapists: [
      { name: "Dra. Ana Costa", specialty: "Psicologia", unit: "Centro" },
      { name: "TO. Carlos Lima", specialty: "Terapia Ocupacional", unit: "Centro" },
      { name: "Fga. Paula Silva", specialty: "Fonoaudiologia", unit: "Norte" }
    ]
  };

  const upcomingAppointments = [
    {
      id: 1,
      date: "2024-01-15",
      time: "14:00",
      therapist: "Dra. Ana Costa",
      specialty: "Psicologia",
      type: "Individual",
      unit: "Centro",
      status: "confirmado"
    },
    {
      id: 2,
      date: "2024-01-17",
      time: "10:30",
      therapist: "TO. Carlos Lima", 
      specialty: "Terapia Ocupacional",
      type: "Individual",
      unit: "Centro",
      status: "confirmado"
    },
    {
      id: 3,
      date: "2024-01-19",
      time: "16:00",
      therapist: "Fga. Paula Silva",
      specialty: "Fonoaudiologia",
      type: "Grupo",
      unit: "Norte",
      status: "aguardando"
    }
  ];

  const recentRequests = [
    {
      id: 1,
      type: "Relatório Médico",
      requestDate: "2024-01-10",
      status: "em_analise",
      description: "Relatório para renovação do BPC"
    },
    {
      id: 2,
      type: "Declaração de Frequência",
      requestDate: "2024-01-08",
      status: "concluido",
      description: "Declaração para a escola"
    },
    {
      id: 3,
      type: "Laudo Atualizado",
      requestDate: "2024-01-05",
      status: "pendente",
      description: "Laudo com avaliação multidisciplinar"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
      case 'concluido':
        return 'bg-success text-success-foreground';
      case 'aguardando':
      case 'em_analise': 
        return 'bg-warning text-warning-foreground';
      case 'pendente':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmado';
      case 'aguardando': return 'Aguardando';
      case 'concluido': return 'Concluído';
      case 'em_analise': return 'Em Análise';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-light to-secondary-light p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-primary mb-2">
          Bem-vinda, Sra. Oliveira! 👋
        </h1>
        <p className="text-muted-foreground">
          Acompanhe os atendimentos e solicite documentos da Maria
        </p>
      </div>

      {/* Patient Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg">{patientInfo.name}</h3>
                <p className="text-muted-foreground">{patientInfo.age} anos</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diagnóstico Principal</p>
                <p className="font-medium">{patientInfo.diagnosis}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-3">Equipe Terapêutica</p>
              <div className="space-y-2">
                {patientInfo.therapists.map((therapist, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{therapist.name}</p>
                      <p className="text-muted-foreground">{therapist.specialty}</p>
                    </div>
                    <Badge variant="outline">{therapist.unit}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Atendimentos
            </CardTitle>
            <CardDescription>
              Agenda dos próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border border-medical-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                    </span>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusText(appointment.status)}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{appointment.therapist}</p>
                  <p className="text-sm text-muted-foreground">{appointment.specialty} • {appointment.type}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Unidade {appointment.unit}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Ver Agenda Completa
            </Button>
          </CardContent>
        </Card>

        {/* Document Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Solicitações de Documentos
            </CardTitle>
            <CardDescription>
              Status das suas solicitações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="p-4 border border-medical-border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{request.type}</h4>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusText(request.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{request.description}</p>
                <p className="text-xs text-muted-foreground">
                  Solicitado em {new Date(request.requestDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
            <Button className="w-full gap-2">
              <MessageSquare className="h-4 w-4" />
              Nova Solicitação
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="secondary" className="h-16 flex-col gap-2">
              <Phone className="h-5 w-5" />
              Contato Clínica
            </Button>
            <Button variant="medical" className="h-16 flex-col gap-2">
              <Mail className="h-5 w-5" />
              Enviar Mensagem
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <CheckCircle className="h-5 w-5" />
              Confirmar Presença
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-warning bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h4 className="font-medium">Lembrete Importante</h4>
              <p className="text-sm text-muted-foreground">
                O atendimento de quinta-feira foi remarcado para sexta-feira devido à agenda do profissional. 
                Você receberá uma confirmação por WhatsApp.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponsavelDashboard;