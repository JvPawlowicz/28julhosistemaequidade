import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/contexts/PermissionsContext";
import { 
  Clock, 
  Users, 
  Plus,
  Calendar,
  Phone,
  AlertCircle,
  CheckCircle,
  Filter
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WaitingListItem {
  id: string;
  patient_id: string;
  specialty: string;
  priority_level: number;
  preferred_time_slots: any;
  notes: string;
  status: 'waiting' | 'contacted' | 'scheduled' | 'cancelled';
  added_date: string;
  last_contact_date: string | null;
  estimated_wait_weeks: number | null;
  patient: {
    full_name: string;
    phone: string;
  };
}

const WaitingListModal = () => {
  const { toast } = useToast();
  const { hasPermission } = usePermissions();
  const [isOpen, setIsOpen] = useState(false);
  const [waitingList, setWaitingList] = useState<WaitingListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');

  const fetchWaitingList = async () => {
    setLoading(true);
    try {
      // Mock waiting list data - will be replaced when types are updated
      const mockData: WaitingListItem[] = [
        {
          id: '1',
          patient_id: 'p1',
          specialty: 'psicologia',
          priority_level: 4,
          preferred_time_slots: { monday: ['14:00-15:00'], tuesday: ['09:00-10:00'] },
          notes: 'Paciente com urgência para início do tratamento',
          status: 'waiting',
          added_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          last_contact_date: null,
          estimated_wait_weeks: 2,
          patient: {
            full_name: 'Ana Silva',
            phone: '(11) 99999-9999'
          }
        },
        {
          id: '2',
          patient_id: 'p2',
          specialty: 'fonoaudiologia',
          priority_level: 2,
          preferred_time_slots: { wednesday: ['15:00-16:00'] },
          notes: '',
          status: 'contacted',
          added_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          last_contact_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          estimated_wait_weeks: 4,
          patient: {
            full_name: 'Carlos Santos',
            phone: '(11) 88888-8888'
          }
        }
      ];
      setWaitingList(mockData);
    } catch (error) {
      toast({
        title: "Erro ao carregar fila de espera",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      // Mock status update - will be replaced when types are updated
      setWaitingList(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, status: status as any, last_contact_date: status === 'contacted' ? new Date().toISOString() : item.last_contact_date }
            : item
        )
      );

      toast({ title: "Status atualizado com sucesso" });
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchWaitingList();
    }
  }, [isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-warning text-warning-foreground';
      case 'contacted':
        return 'bg-info text-info-foreground';
      case 'scheduled':
        return 'bg-success text-success-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-destructive';
    if (priority >= 3) return 'text-warning';
    return 'text-muted-foreground';
  };

  const filteredList = waitingList.filter(item => {
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    const specialtyMatch = filterSpecialty === 'all' || item.specialty === filterSpecialty;
    return statusMatch && specialtyMatch;
  });

  const stats = {
    total: waitingList.length,
    waiting: waitingList.filter(item => item.status === 'waiting').length,
    contacted: waitingList.filter(item => item.status === 'contacted').length,
    highPriority: waitingList.filter(item => item.priority_level >= 4).length,
  };

  if (!hasPermission('agenda', 'read')) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Clock className="h-4 w-4" />
          Fila de Espera
          {stats.highPriority > 0 && (
            <Badge variant="destructive" className="ml-1">
              {stats.highPriority}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Fila de Espera
          </DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-warning">{stats.waiting}</div>
              <div className="text-xs text-muted-foreground">Aguardando</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-info">{stats.contacted}</div>
              <div className="text-xs text-muted-foreground">Contatados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-destructive">{stats.highPriority}</div>
              <div className="text-xs text-muted-foreground">Prioridade Alta</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="waiting">Aguardando</SelectItem>
              <SelectItem value="contacted">Contatado</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Especialidades</SelectItem>
              <SelectItem value="psicologia">Psicologia</SelectItem>
              <SelectItem value="fonoaudiologia">Fonoaudiologia</SelectItem>
              <SelectItem value="terapia_ocupacional">Terapia Ocupacional</SelectItem>
              <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando fila de espera...
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum paciente na fila</p>
            </div>
          ) : (
            filteredList.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`text-2xl font-bold ${getPriorityColor(item.priority_level)}`}>
                        {item.priority_level}
                      </div>
                      <div className="text-xs text-muted-foreground">Prioridade</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.patient.full_name}</h4>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === 'waiting' && 'Aguardando'}
                          {item.status === 'contacted' && 'Contatado'}
                          {item.status === 'scheduled' && 'Agendado'}
                          {item.status === 'cancelled' && 'Cancelado'}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="capitalize">{item.specialty.replace('_', ' ')}</span>
                        {item.patient.phone && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="flex items-center gap-1 inline-flex">
                              <Phone className="h-3 w-3" />
                              {item.patient.phone}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Aguardando há {formatDistanceToNow(new Date(item.added_date), {
                          locale: ptBR
                        })}
                        {item.estimated_wait_weeks && (
                          <span className="ml-2">• Estimativa: {item.estimated_wait_weeks} semanas</span>
                        )}
                      </div>
                      
                      {item.notes && (
                        <p className="text-sm mt-2 p-2 bg-muted rounded-lg">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {item.status === 'waiting' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(item.id, 'contacted')}
                      >
                        Contatar
                      </Button>
                    )}
                    
                    {item.status === 'contacted' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(item.id, 'scheduled')}
                      >
                        Agendar
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateStatus(item.id, 'cancelled')}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaitingListModal;