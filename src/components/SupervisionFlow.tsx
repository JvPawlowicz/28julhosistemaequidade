import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  FileText,
  User,
  Calendar
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/contexts/usePermissions";

interface PendingEvolution {
  id: number;
  paciente: string;
  estagiario: string;
  supervisor: string;
  dataSessione: string;
  dataSubmissao: string;
  conteudo: string;
  observacoes?: string;
  status: 'pendente' | 'revisao_solicitada' | 'aprovada';
}

const SupervisionFlow = () => {
  const { hasPermission, getUserRole } = usePermissions();
  const { toast } = useToast();
  const [selectedEvolution, setSelectedEvolution] = useState<PendingEvolution | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [pendingEvolutions, setPendingEvolutions] = useState<PendingEvolution[]>([
    {
      id: 1,
      paciente: "João Silva Santos, 12 anos",
      estagiario: "Julia Mendes",
      supervisor: "Dra. Ana Costa",
      dataSessione: "2024-01-15",
      dataSubmissao: "2024-01-15",
      conteudo: "Sessão focada em desenvolvimento da comunicação verbal. Paciente demonstrou maior iniciativa para solicitar objetos de interesse utilizando palavras isoladas. Foram trabalhadas atividades de atenção compartilhada com resultados positivos. Observou-se diminuição de comportamentos estereotipados durante as atividades estruturadas.",
      status: 'pendente'
    },
    {
      id: 2,
      paciente: "Maria Oliveira Santos, 8 anos",
      estagiario: "Julia Mendes",
      supervisor: "Dra. Ana Costa",
      dataSessione: "2024-01-12",
      dataSubmissao: "2024-01-13",
      conteudo: "Trabalhada coordenação motora fina através de atividades lúdicas. Paciente conseguiu realizar movimentos de pinça com maior precisão. Atividades de encaixe foram bem aceitas.",
      observacoes: "Precisa detalhar melhor os objetivos específicos trabalhados e incluir observações sobre autorregulação emocional.",
      status: 'revisao_solicitada'
    }
  ]);

  const handleApprove = (evolutionId: number) => {
    setPendingEvolutions(prev => 
      prev.map(ev => 
        ev.id === evolutionId 
          ? { ...ev, status: 'aprovada' }
          : ev
      )
    );
    
    toast({
      title: "Evolução aprovada",
      description: "A evolução foi aprovada e co-assinada com sucesso."
    });
    setIsDialogOpen(false);
  };

  const handleRequestRevision = (evolutionId: number) => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback obrigatório",
        description: "É necessário fornecer um feedback para solicitar revisão.",
        variant: "destructive"
      });
      return;
    }

    setPendingEvolutions(prev => 
      prev.map(ev => 
        ev.id === evolutionId 
          ? { ...ev, status: 'revisao_solicitada', observacoes: feedback }
          : ev
      )
    );
    
    toast({
      title: "Revisão solicitada",
      description: "O estagiário foi notificado sobre as correções necessárias."
    });
    setFeedback("");
    setIsDialogOpen(false);
  };

  const openEvolutionDetail = (evolution: PendingEvolution) => {
    setSelectedEvolution(evolution);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-warning text-warning-foreground';
      case 'revisao_solicitada': return 'bg-destructive text-destructive-foreground';
      case 'aprovada': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente de Supervisão';
      case 'revisao_solicitada': return 'Revisão Solicitada';
      case 'aprovada': return 'Aprovada e Co-assinada';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return Clock;
      case 'revisao_solicitada': return XCircle;
      case 'aprovada': return CheckCircle;
      default: return AlertCircle;
    }
  };

  // Se não for coordenador, não exibir este componente
  if (!hasPermission('supervision', 'manage')) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Fila de Supervisão
        </h2>
        <p className="text-muted-foreground">
          Evoluções pendentes de aprovação dos estagiários
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-warning" />
              <div>
                <p className="text-2xl font-bold">
                  {pendingEvolutions.filter(e => e.status === 'pendente').length}
                </p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-destructive" />
              <div>
                <p className="text-2xl font-bold">
                  {pendingEvolutions.filter(e => e.status === 'revisao_solicitada').length}
                </p>
                <p className="text-sm text-muted-foreground">Em Revisão</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-success" />
              <div>
                <p className="text-2xl font-bold">
                  {pendingEvolutions.filter(e => e.status === 'aprovada').length}
                </p>
                <p className="text-sm text-muted-foreground">Aprovadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Evoluções */}
      <Card>
        <CardHeader>
          <CardTitle>Evoluções para Supervisão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingEvolutions.map((evolution) => {
              const StatusIcon = getStatusIcon(evolution.status);
              
              return (
                <div 
                  key={evolution.id} 
                  className="p-4 border border-medical-border rounded-lg cursor-pointer hover:bg-medical-gray/50 transition-colors"
                  onClick={() => openEvolutionDetail(evolution)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{evolution.paciente}</h4>
                        <p className="text-sm text-muted-foreground">
                          Estagiário: {evolution.estagiario}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(evolution.status)}>
                      {getStatusText(evolution.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-muted-foreground">Data da Sessão</p>
                      <p className="font-medium">{new Date(evolution.dataSessione).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Submetido em</p>
                      <p className="font-medium">{new Date(evolution.dataSubmissao).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {evolution.conteudo}
                  </p>

                  {evolution.observacoes && (
                    <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm">
                      <p className="font-medium text-destructive">Feedback da Supervisão:</p>
                      <p className="text-muted-foreground">{evolution.observacoes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Supervisão de Evolução Clínica
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvolution && (
            <div className="space-y-6">
              {/* Informações do Paciente */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Paciente</p>
                      <p className="font-medium">{selectedEvolution.paciente}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estagiário</p>
                      <p className="font-medium">{selectedEvolution.estagiario}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data da Sessão</p>
                      <p className="font-medium">{new Date(selectedEvolution.dataSessione).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conteúdo da Evolução */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conteúdo da Evolução</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedEvolution.conteudo}
                  </p>
                </CardContent>
              </Card>

              {/* Feedback/Observações Anteriores */}
              {selectedEvolution.observacoes && (
                <Card className="border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive">Feedback Anterior</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedEvolution.observacoes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Ações de Supervisão */}
              {selectedEvolution.status !== 'aprovada' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ação de Supervisão</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Feedback para o estagiário (opcional para aprovação, obrigatório para revisão):</label>
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Comentários sobre a evolução, orientações para melhoria, aspectos positivos observados..."
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleApprove(selectedEvolution.id)}
                        className="flex-1 gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Aprovar e Co-assinar
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleRequestRevision(selectedEvolution.id)}
                        className="flex-1 gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Solicitar Revisão
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedEvolution.status === 'aprovada' && (
                <Card className="border-success/20 bg-success/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium text-success">Evolução Aprovada e Co-assinada</p>
                        <p className="text-sm text-muted-foreground">
                          Esta evolução foi aprovada e está assinada digitalmente por você.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupervisionFlow;