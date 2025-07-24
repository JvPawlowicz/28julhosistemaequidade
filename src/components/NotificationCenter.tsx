import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/useAuth";
import { 
  Bell, 
  Calendar, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Clock,
  X,
  Settings
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'authorization_expiry' | 'evaluation_due' | 'system';
  priority: 'low' | 'normal' | 'high' | 'critical';
  read_at: string | null;
  action_url: string | null;
  created_at: string;
  expires_at: string | null;
}

export const NotificationCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Temporarily using mock data until types are updated
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Agendamento para amanhã',
          message: 'Você tem um agendamento com João Silva às 14:00',
          type: 'appointment',
          priority: 'normal',
          read_at: null,
          action_url: '/app/agenda',
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      toast({
        title: "Erro ao carregar notificações",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const markAsRead = async (notificationId: string) => {
    // Mock implementation - will be replaced when types are updated
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, read_at: new Date().toISOString() }
          : n
      )
    );
  };

  const markAllAsRead = async () => {
    try {
      // Mock implementation - will be replaced when types are updated
      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      );

      toast({ title: "Todas as notificações foram marcadas como lidas" });
    } catch (error) {
      toast({
        title: "Erro ao marcar todas como lidas",
        variant: "destructive"
      });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Mock implementation - will be replaced when types are updated
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      toast({
        title: "Erro ao excluir notificação",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, fetchNotifications]); 

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === 'high' || priority === 'critical') {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }

    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-primary" />;
      case 'authorization_expiry':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'evaluation_due':
        return <CheckCircle className="h-4 w-4 text-info" />;
      case 'system':
        return <Info className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-l-4 border-l-destructive bg-destructive/5';
      case 'high':
        return 'border-l-4 border-l-warning bg-warning/5';
      case 'normal':
        return 'border-l-4 border-l-primary bg-primary/5';
      case 'low':
        return 'border-l-4 border-l-muted bg-muted/5';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} não lidas</Badge>
            )}
          </DialogTitle>
          
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Marcar todas como lidas
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh]">
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando notificações...
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className={`${getPriorityColor(notification.priority)} ${!notification.read_at ? 'shadow-md' : 'opacity-75'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{notification.title}</h4>
                            {!notification.read_at && (
                              <Badge variant="secondary" className="text-xs">Nova</Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </span>
                            
                            {notification.expires_at && (
                              <span className="text-warning">
                                Expira {formatDistanceToNow(new Date(notification.expires_at), {
                                  addSuffix: true,
                                  locale: ptBR
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-1">
                        {!notification.read_at && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 p-0 hover:bg-destructive/10"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {notification.action_url && (
                      <div className="mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            window.location.href = notification.action_url!;
                            if (!notification.read_at) {
                              markAsRead(notification.id);
                            }
                          }}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};