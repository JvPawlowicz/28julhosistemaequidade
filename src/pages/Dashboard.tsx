import { usePermissions } from "@/contexts/usePermissions";
import AdminDashboard from "./dashboards/AdminDashboard";
import TerapeutaDashboard from "./dashboards/TerapeutaDashboard";
import RecepcaoDashboard from "./dashboards/RecepcaoDashboard";
import ResponsavelDashboard from "./dashboards/ResponsavelDashboard";
import { Loading } from "@/components/ui/loading";

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
        <div className="flex items-center justify-center h-full">
          <Loading />
        </div>
      );
  }
};

export default Dashboard;