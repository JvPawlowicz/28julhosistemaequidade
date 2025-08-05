import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Users,
  Phone,
  UserPlus
} from "lucide-react";

const RecepcaoDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Painel da Recepção</h1>
        <p className="text-muted-foreground">
          Ferramentas para o dia a dia da clínica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Agendamentos para Hoje</p>
            <p className="text-2xl font-bold">32</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pacientes Aguardando</p>
            <p className="text-2xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Confirmações Pendentes</p>
            <p className="text-2xl font-bold text-warning">8</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ações Principais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate('/app/agenda')}>
            <Calendar className="h-6 w-6" />
            Ver Agenda
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate('/app/pacientes')}>
            <Users className="h-6 w-6" />
            Buscar Paciente
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate('/app/pacientes')}>
            <UserPlus className="h-6 w-6" />
            Novo Cadastro
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2">
            <Phone className="h-6 w-6" />
            Confirmar Consultas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecepcaoDashboard;