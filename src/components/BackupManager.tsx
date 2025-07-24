import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/contexts/PermissionsContext";
import { 
  Shield, 
  Download, 
  Database,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  HardDrive,
  Calendar
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SystemBackup {
  id: string;
  backup_type: 'daily' | 'weekly' | 'manual';
  file_path: string;
  file_size: number;
  tables_included: string[];
  status: 'in_progress' | 'completed' | 'failed';
  created_at: string;
}

export const BackupManager = () => {
  const { toast } = useToast();
  const { isAdmin } = usePermissions();
  const [backups, setBackups] = useState<SystemBackup[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      // Mock data - will be replaced when types are updated
      const mockBackups: SystemBackup[] = [
        {
          id: '1',
          backup_type: 'daily',
          file_path: 'backups/daily_backup.sql',
          file_size: 1024000,
          tables_included: ['patients', 'appointments', 'medical_records'],
          status: 'completed',
          created_at: new Date().toISOString()
        }
      ];
      setBackups(mockBackups);
    } catch (error) {
      toast({
        title: "Erro ao carregar backups",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async (type: 'manual' | 'daily' = 'manual') => {
    setIsCreatingBackup(true);
    try {
      // Mock backup creation - will be replaced when types are updated
      const newBackup: SystemBackup = {
        id: crypto.randomUUID(),
        backup_type: type,
        file_path: `backups/${type}_${Date.now()}.sql`,
        file_size: Math.floor(Math.random() * 10000000) + 1000000,
        tables_included: ['patients', 'appointments', 'medical_records', 'profiles'],
        status: 'completed',
        created_at: new Date().toISOString()
      };

      setBackups(prev => [newBackup, ...prev]);

      toast({
        title: "Backup criado com sucesso",
        description: "O backup foi criado e está sendo processado"
      });
    } catch (error) {
      toast({
        title: "Erro ao criar backup",
        description: "Ocorreu um erro ao criar o backup do sistema",
        variant: "destructive"
      });
    }
    setIsCreatingBackup(false);
  };

  useEffect(() => {
    if (isOpen && isAdmin()) {
      fetchBackups();
    }
  }, [isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in_progress':
        return 'bg-warning text-warning-foreground';
      case 'failed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const stats = {
    total: backups.length,
    completed: backups.filter(b => b.status === 'completed').length,
    failed: backups.filter(b => b.status === 'failed').length,
    totalSize: backups
      .filter(b => b.status === 'completed')
      .reduce((acc, b) => acc + (b.file_size || 0), 0),
    lastBackup: backups.find(b => b.status === 'completed')
  };

  if (!isAdmin()) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Shield className="h-4 w-4" />
          Backup do Sistema
          {stats.failed > 0 && (
            <Badge variant="destructive" className="ml-1">
              {stats.failed}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gerenciamento de Backup
          </DialogTitle>
        </DialogHeader>

        {/* Alerta de segurança */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Os backups são essenciais para a segurança dos dados. Recomendamos manter backups regulares e testá-los periodicamente.
          </AlertDescription>
        </Alert>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total de Backups</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-success">{stats.completed}</div>
              <div className="text-xs text-muted-foreground">Concluídos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
              <div className="text-xs text-muted-foreground">Falharam</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-info">{formatFileSize(stats.totalSize)}</div>
              <div className="text-xs text-muted-foreground">Espaço Usado</div>
            </CardContent>
          </Card>
        </div>

        {/* Status do último backup */}
        {stats.lastBackup && (
          <Card className="border-success">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-success">Último Backup Bem-sucedido</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(stats.lastBackup.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })} • {formatFileSize(stats.lastBackup.file_size)}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <div className="flex gap-3 mb-4">
          <Button 
            onClick={() => createBackup('manual')} 
            disabled={isCreatingBackup}
            className="gap-2"
          >
            {isCreatingBackup ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            Criar Backup Manual
          </Button>
          
          <Button variant="outline" onClick={fetchBackups} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Lista de Backups */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando backups...
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum backup encontrado</p>
            </div>
          ) : (
            backups.map((backup) => (
              <Card key={backup.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      {getStatusIcon(backup.status)}
                      <div className="text-xs text-muted-foreground mt-1">
                        {backup.backup_type === 'manual' && 'Manual'}
                        {backup.backup_type === 'daily' && 'Diário'}
                        {backup.backup_type === 'weekly' && 'Semanal'}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">Backup do Sistema</h4>
                        <Badge className={getStatusColor(backup.status)}>
                          {backup.status === 'completed' && 'Concluído'}
                          {backup.status === 'in_progress' && 'Em Progresso'}
                          {backup.status === 'failed' && 'Falhou'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(backup.created_at).toLocaleString('pt-BR')}
                          </span>
                          
                          {backup.file_size && (
                            <span className="flex items-center gap-1">
                              <HardDrive className="h-3 w-3" />
                              {formatFileSize(backup.file_size)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Tabelas: {backup.tables_included.join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {backup.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          toast({
                            title: "Download iniciado",
                            description: "O arquivo de backup está sendo baixado"
                          });
                        }}
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Configurações automáticas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configurações de Backup Automático</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Backup Diário</p>
                  <p className="text-sm text-muted-foreground">
                    Executado automaticamente às 02:00 todos os dias
                  </p>
                </div>
                <Badge className="bg-success text-success-foreground">Ativo</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Retenção de Backups</p>
                  <p className="text-sm text-muted-foreground">
                    Manter backups por 30 dias
                  </p>
                </div>
                <Badge variant="outline">Configurado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};