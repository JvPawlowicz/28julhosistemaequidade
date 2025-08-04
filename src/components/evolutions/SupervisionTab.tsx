import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmptyState } from "@/components/EmptyState";
import { MessageSquare, CheckCircle, AlertCircle, FileText, Clock, User } from "lucide-react";
import type { Evolution } from "@/types/Evolution";

interface SupervisionTabProps {
  pendingSupervisionEvolutions: Evolution[];
  getPatientName: (id: string) => string;
  getProfessionalName: (id: string) => string;
  onApproveEvolution: (id: string) => Promise<void>;
  onRequestEvolutionRevision: (evolution: Evolution) => void;
}

export const SupervisionTab: React.FC<SupervisionTabProps> = ({
  pendingSupervisionEvolutions,
  getPatientName,
  getProfessionalName,
  onApproveEvolution,
  onRequestEvolutionRevision,
}) => {
  return (
    <div className="space-y-4">
      <Alert>
        <MessageSquare className="h-4 w-4" />
        <AlertDescription>
          Aqui você pode supervisionar evoluções de estagiários e fornecer feedback.
        </AlertDescription>
      </Alert>
      
      {pendingSupervisionEvolutions.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="Nenhuma supervisão pendente"
          description="Todas as evoluções foram supervisionadas."
        />
      ) : (
        pendingSupervisionEvolutions.map((evolution) => (
          <Card key={evolution.id} className="border-warning/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{getPatientName(evolution.patient_id)}</h3>
                  <p className="text-sm text-muted-foreground">
                    Profissional: {getProfessionalName(evolution.professional_id)}
                  </p>
                </div>
                <Badge className="bg-warning text-warning-foreground">
                  Aguardando Supervisão
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Relatório da Sessão:</h4>
                  <p className="text-sm bg-accent p-3 rounded-lg">
                    {evolution.content?.session_report || 'Sem relatório'}
                  </p>
                </div>
                
                {evolution.content?.inappropriate_behavior && (
                  <div>
                    <h4 className="font-medium mb-2">Comportamento Inadequado:</h4>
                    <p className="text-sm bg-red-50 p-3 rounded-lg">
                      {evolution.content.behavior_description}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onApproveEvolution(evolution.id)}
                    className="gap-2 bg-success text-success-foreground hover:bg-success/90"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Aprovar e Co-assinar
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => onRequestEvolutionRevision(evolution)}
                    className="gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Solicitar Revisão
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};