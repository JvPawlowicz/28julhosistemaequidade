import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { 
  Home,
  Calendar,
  Users,
  FileText,
  TrendingUp
} from "lucide-react";
import EvolutionNotifications from '@/components/EvolutionNotifications';
import { useAuth } from "@/contexts/useAuth";

const TerapeutaDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Meu Painel</h1>
        <p className="text-muted-foreground">
          Bem-vindo(a) de volta, {user?.user_metadata?.full_name || 'Terapeuta'}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Atendimentos Hoje</p>
            <p className="text-2xl font-bold">5</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
            <p className="text-2xl font-bold">18</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Evoluções Pendentes</p>
            <p className="text-2xl font-bold text-warning">2</p>
          </CardContent>
        </Card>
      </div>

      <EvolutionNotifications />

      <Card>
        <CardHeader>
          <CardTitle>Acesso Rápido</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate('/app/agenda')}>
            <Calendar className="h-6 w-6" />
            Minha Agenda
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate('/app/pacientes')}>
            <Users className="h-6 w-6" />
            Meus Pacientes
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate('/app/evolucoes')}>
            <FileText className="h-6 w-6" />
            Evoluções
          </Button>
          <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => navigate('/app/relatorios')}>
            <TrendingUp className="h-6 w-6" />
            Meu Desempenho
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TerapeutaDashboard;