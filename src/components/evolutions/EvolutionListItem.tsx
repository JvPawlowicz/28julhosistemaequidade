import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Edit, Plus, CheckCircle, AlertCircle } from "lucide-react";
import type { Evolution } from "@/types/Evolution";

interface EvolutionListItemProps {
  evolution: Evolution;
  getPatientName: (id: string) => string;
  getProfessionalName: (id: string) => string;
  getStatusColor: (status: string) => string;
  canEditEvolution: boolean;
  canSupervise: boolean;
  currentUserId: string | undefined;
  onView: (evolution: Evolution) => void;
  onApprove: (id: string) => void;
  onRequestRevision: (evolution: Evolution) => void;
  onAddAdendum: (id: string) => void;
}

export const EvolutionListItem: React.FC<EvolutionListItemProps> = ({
  evolution,
  getPatientName,
  getProfessionalName,
  getStatusColor,
  canEditEvolution,
  canSupervise,
  currentUserId,
  onView,
  onApprove,
  onRequestRevision,
  onAddAdendum,
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-semibold text-lg">{getPatientName(evolution.patient_id)}</h3>
              <p className="text-sm text-muted-foreground">
                Profissional: {getProfessionalName(evolution.professional_id)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(evolution.status)}>
              {evolution.status}
            </Badge>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {evolution.content?.session_report || 'Sem relatório'}
          </p>
          
          {evolution.content?.inappropriate_behavior && (
            <div className="mt-2 p-2 bg-red-50 rounded-lg">
              <p className="text-xs text-red-700 font-medium">
                ⚠️ Comportamento inadequado relatado
              </p>
            </div>
          )}

          {evolution.content?.supervision_feedback && (
            <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-700 font-medium">
                💭 Feedback de supervisão: {evolution.content.supervision_feedback}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-1"
            onClick={() => onView(evolution)}
          >
            <Eye className="h-3 w-3" />
            Visualizar
          </Button>
          
          {canEditEvolution && evolution.status === 'Rascunho' && 
           evolution.professional_id === currentUserId && (
            <Button size="sm" variant="outline" className="gap-1">
              <Edit className="h-3 w-3" />
              Editar
            </Button>
          )}
          
          {evolution.status === 'Pendente de Supervisão' && canSupervise && (
            <>
              <Button 
                size="sm" 
                onClick={() => onApprove(evolution.id)}
                className="gap-1 bg-success text-success-foreground hover:bg-success/90"
              >
                <CheckCircle className="h-3 w-3" />
                Aprovar
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onRequestRevision(evolution)}
                className="gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                Solicitar Revisão
              </Button>
            </>
          )}
          
          {evolution.status === 'Finalizada' && evolution.professional_id === currentUserId && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onAddAdendum(evolution.id)}
              className="gap-1"
            >
              <Plus className="h-3 w-3" />
              Adendo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};