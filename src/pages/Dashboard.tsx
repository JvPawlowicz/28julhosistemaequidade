import { usePermissions } from "@/contexts/usePermissions";
import AdminDashboard from "./dashboards/AdminDashboard";
import TerapeutaDashboard from "./dashboards/TerapeutaDashboard";
import RecepcaoDashboard from "./dashboards/RecepcaoDashboard";
import ResponsavelDashboard from "./dashboards/ResponsavelDashboard";

const Dashboard = () => {
  const { getUserRole } = usePermissions();
  const userRole = getUserRole();

  // Render the appropriate dashboard based on the user's role
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
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bem-vindo ao Sistema Equidade</h1>
          <p className="text-muted-foreground">Carregando seu painel...</p>
        </div>
      );
  }
};

export default Dashboard;