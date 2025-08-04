import { QualityDashboard } from "@/components/QualityDashboard";
import { BackupManager } from "@/components/BackupManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/contexts/usePermissions";
import { 
  BarChart3, 
  Shield, 
  TrendingUp,
  Users,
  Calendar,
  FileText
} from "lucide-react";
import { showInfo } from '@/utils/notifications'; // Import new notification utility

const QualityDashboardPage = () => {
  const { isAdmin, hasPermission } = usePermissions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Central de Qualidade</h1>
          <p className="text-muted-foreground">
            Métricas, backups e ferramentas de administração do sistema
          </p>
        </div>
        
        <div className="flex gap-3">
          {isAdmin() && <BackupManager />}
        </div>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">Métricas de Qualidade</p>
                <p className="text-sm text-muted-foreground">Desempenho dos pacientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-success" />
              <div>
                <p className="font-medium">Evolução</p>
                <p className="text-sm text-muted-foreground">Progresso dos tratamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-info" />
              <div>
                <p className="font-medium">Frequência</p>
                <p className="text-sm text-muted-foreground">Taxa de comparecimento</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {isAdmin() && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-warning" />
                <div>
                  <p className="font-medium">Backup & Segurança</p>
                  <p className="text-sm text-muted-foreground">Proteção de dados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dashboard Principal */}
      {hasPermission('relatorios', 'read') && <QualityDashboard />}
    </div>
  );
};

export default QualityDashboardPage;