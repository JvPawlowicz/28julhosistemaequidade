import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import type { Evolution } from "@/types/Evolution";

interface EvolutionDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  evolution: Evolution | null;
  getPatientName: (id: string) => string;
  getProfessionalName: (id: string) => string;
  getStatusColor: (status: string) => string;
  canSupervise: boolean;
  supervisionFeedback: string;
  setSupervisionFeedback: (feedback: string) => void;
  onSupervisionAction: (evolutionId: string, action: 'approve' | 'reject') => Promise<void>;
}

export const EvolutionDetailModal: React.FC<EvolutionDetailModalProps> = ({
  isOpen,
  onOpenChange,
  evolution,
  getPatientName,
  getProfessionalName,
  getStatusColor,
  canSupervise,
  supervisionFeedback,
  setSupervisionFeedback,
  onSupervisionAction,
}) => {
  if (!evolution) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {evolution.status === 'Pendente de Supervisão' && canSupervise
              ? 'Supervisão de Evolução'
              : 'Visualizar Evolução'
            } - {getPatientName(evolution.patient_id)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(evolution.status)}>
              {evolution.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {getProfessionalName(evolution.professional_id)}
            </span>
          </div>
          
          {evolution.content?.inappropriate_behavior && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Comportamento Inadequado Relatado</h4>
              <p className="text-red-700">{evolution.content.behavior_description}</p>
            </div>
          )}
          
          <div>
            <h4 className="font-semibold mb-2">Relatório da Sessão</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {evolution.content?.session_report || 'Sem relatório'}
            </p>
          </div>
          
          {evolution.content?.supervision_feedback && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Feedback de Supervisão Anterior</h4>
              <p className="text-yellow-700">{evolution.content.supervision_feedback}</p>
            </div>
          )}
          
          {evolution.status === 'Pendente de Supervisão' && canSupervise && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Ação de Supervisão</h4>
              <div className="space-y-3">
                <div>
                  <Label>Feedback para revisão (obrigatório se solicitar revisão)</Label>
                  <Textarea
                    value={supervisionFeedback}
                    onChange={(e) => setSupervisionFeedback(e.target.value)}
                    placeholder="Descreva os pontos que precisam ser revisados ou melhorados..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onSupervisionAction(evolution.id, 'reject')}
                    variant="outline"
                    disabled={!supervisionFeedback.trim()}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Solicitar Revisão
                  </Button>
                  <Button 
                    onClick={() => onSupervisionAction(evolution.id, 'approve')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar e Co-assinar
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};