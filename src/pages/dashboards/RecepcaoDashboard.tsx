import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  UserCheck, 
  Clock, 
  Phone,
  Search,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw
} from "lucide-react";

const RecepcaoDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const todayAppointments = [
    {
      id: 1,
      time: "08:00",
      patient: "João Silva, 12 anos",
      therapist: "Dra. Ana Costa",
      room: "Sala 3",
      status: "chegou",
      contact: "(11) 99999-1111",
      responsible: "Maria Silva"
    },
    {
      id: 2, 
      time: "08:30",
      patient: "Ana Oliveira, 10 anos",
      therapist: "TO. Carlos Lima",
      room: "Sala 5",
      status: "confirmado",
      contact: "(11) 99999-2222",
      responsible: "José Oliveira"
    },
    {
      id: 3,
      time: "09:00",
      patient: "Pedro Costa, 15 anos", 
      therapist: "Dra. Ana Costa",
      room: "Sala 3",
      status: "aguardando",
      contact: "(11) 99999-3333",
      responsible: "Carla Costa"
    },
    {
      id: 4,
      time: "09:30",
      patient: "Beatriz Lima, 9 anos",
      therapist: "Fga. Paula Silva",
      room: "Sala 2",
      status: "atrasado",
      contact: "(11) 99999-4444", 
      responsible: "Roberto Lima"
    },
    {
      id: 5,
      time: "10:00",
      patient: "Carlos Mendes, 7 anos",
      therapist: "TO. Carlos Lima", 
      room: "Sala 5",
      status: "faltou",
      contact: "(11) 99999-5555",
      responsible: "Sandra Mendes"
    },
    {
      id: 6,
      time: "10:30",
      patient: "Grupo Habilidades Sociais",
      therapist: "Dra. Ana Costa",
      room: "Sala Grande",
      status: "confirmado",
      contact: "Múltiplos contatos",
      responsible: "Grupo"
    }
  ];

  const stats = [
    { label: "Total Hoje", value: 28, color: "primary" },
    { label: "Chegaram", value: 8, color: "success" },
    { label: "Aguardando", value: 12, color: "warning" },
    { label: "Faltaram", value: 3, color: "destructive" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'chegou': return 'bg-success text-success-foreground';
      case 'confirmado': return 'bg-primary text-primary-foreground'; 
      case 'aguardando': return 'bg-warning text-warning-foreground';
      case 'atrasado': return 'bg-orange-500 text-white';
      case 'faltou': return 'bg-destructive text-destructive-foreground';
      case 'finalizado': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'chegou': return 'Chegou';
      case 'confirmado': return 'Confirmado';
      case 'aguardando': return 'Aguardando';
      case 'atrasado': return 'Atrasado';
      case 'faltou': return 'Faltou';
      case 'finalizado': return 'Finalizado';
      default: return status;
    }
  };

  const updateStatus = (appointmentId: number, newStatus: string) => {
    // Logic to update appointment status
    console.log(`Updating appointment ${appointmentId} to ${newStatus}`);
  };

  const filteredAppointments = todayAppointments.filter(appointment =>
    appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.therapist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Recepção - Check-in</h1>
        <p className="text-muted-foreground">
          Terça-feira, 15 de Janeiro de 2024 • Gerencie a chegada dos pacientes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agenda do Dia
          </CardTitle>
          <CardDescription>
            Gerencie os atendimentos e status dos pacientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente, terapeuta ou responsável..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border border-medical-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold text-primary min-w-[60px]">
                      {appointment.time}
                    </div>
                    <div>
                      <h4 className="font-medium">{appointment.patient}</h4>
                      <p className="text-sm text-muted-foreground">
                        {appointment.therapist} • {appointment.room}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Responsável: {appointment.responsible}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`tel:${appointment.contact}`, '_self')}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {appointment.status === 'confirmado' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => updateStatus(appointment.id, 'chegou')}
                      className="gap-1"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Marcar Chegada
                    </Button>
                  )}
                  
                  {appointment.status === 'aguardando' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(appointment.id, 'chegou')}
                        className="gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Chegou
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(appointment.id, 'atrasado')}
                        className="gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        Atrasado
                      </Button>
                    </>
                  )}

                  {appointment.status === 'atrasado' && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => updateStatus(appointment.id, 'chegou')}
                        className="gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Chegou
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStatus(appointment.id, 'faltou')}
                        className="gap-1"
                      >
                        <XCircle className="h-3 w-3" />
                        Faltou
                      </Button>
                    </>
                  )}

                  {(appointment.status === 'faltou' || appointment.status === 'finalizado') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(appointment.id, 'confirmado')}
                      className="gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reverter
                    </Button>
                  )}

                  <Button size="sm" variant="medical" className="gap-1">
                    <UserCheck className="h-3 w-3" />
                    Reagendar
                  </Button>
                </div>

                {appointment.status === 'faltou' && (
                  <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <span className="font-medium">Falta registrada</span>
                    </div>
                    <p className="text-muted-foreground mt-1">
                      Considere entrar em contato com o responsável para reagendamento
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 flex-col gap-2">
              <UserCheck className="h-5 w-5" />
              Novo Cadastro
            </Button>
            <Button variant="secondary" className="h-16 flex-col gap-2">
              <Calendar className="h-5 w-5" />
              Agendar
            </Button>
            <Button variant="medical" className="h-16 flex-col gap-2">
              <Phone className="h-5 w-5" />
              Confirmações
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <MapPin className="h-5 w-5" />
              Mapa Salas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecepcaoDashboard;