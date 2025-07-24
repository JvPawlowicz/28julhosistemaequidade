import { usePermissions } from "@/contexts/PermissionsContext";
import AdminDashboard from "./dashboards/AdminDashboard";
import TerapeutaDashboard from "./dashboards/TerapeutaDashboard";
import RecepcaoDashboard from "./dashboards/RecepcaoDashboard";
import ResponsavelDashboard from "./dashboards/ResponsavelDashboard";

const Index = () => {
  const { getUserRole } = usePermissions();
  const userRole = getUserRole();

  // Redirect para o dashboard apropriado baseado no role do usuário
  switch (userRole) {
    case 'admin':
    case 'coordenador':
      return <AdminDashboard />;
    case 'terapeuta':
    case 'estagiario':
      return <TerapeutaDashboard />;
    case 'recepcao':
      return <RecepcaoDashboard />;
    case 'responsavel':
      return <ResponsavelDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-primary">Bem-vindo ao Sistema Equidade</h1>
            <p className="text-xl text-muted-foreground">Sistema de Gestão Clínica Interdisciplinar</p>
            <p className="text-sm text-muted-foreground mt-4">Faça login para acessar suas funcionalidades</p>
          </div>
        </div>
      );
  }
};

export default Index;
