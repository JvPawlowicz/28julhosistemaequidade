import React from 'react';
import { EmptyState } from "@/components/EmptyState";
import { FileText } from "lucide-react";
import { EvolutionListItem } from "./EvolutionListItem";
import type { Evolution } from "@/types/Evolution";

interface EvolutionListProps {
  evolutions: Evolution[];
  getPatientName: (id: string) => string;
  getProfessionalName: (id: string) => string;
  getStatusColor: (status: string) => string;
  canCreateEvolution: boolean;
  canEditEvolution: boolean;
  canSupervise: boolean;
  currentUserId: string | undefined;
  onViewEvolution: (evolution: Evolution) => void;
  onApproveEvolution: (id: string) => void;
  onRequestEvolutionRevision: (evolution: Evolution) => void;
  onAddEvolutionAdendum: (id: string) => void;
  onNewEvolutionClick: () => void;
}

export const EvolutionList: React.FC<EvolutionListProps> = ({
  evolutions,
  getPatientName,
  getProfessionalName,
  getStatusColor,
  canCreateEvolution,
  canEditEvolution,
  canSupervise,
  currentUserId,
  onViewEvolution,
  onApproveEvolution,
  onRequestEvolutionRevision,
  onAddEvolutionAdendum,
  onNewEvolutionClick,
}) => {
  return (
    <div className="space-y-4">
      {evolutions.map((evolution) => (
        <EvolutionListItem
          key={evolution.id}
          evolution={evolution}
          getPatientName={getPatientName}
          getProfessionalName={getProfessionalName}
          getStatusColor={getStatusColor}
          canEditEvolution={canEditEvolution}
          canSupervise={canSupervise}
          currentUserId={currentUserId}
          onView={onViewEvolution}
          onApprove={onApproveEvolution}
          onRequestRevision={onRequestEvolutionRevision}
          onAddAdendum={onAddEvolutionAdendum}
        />
      ))}
      
      {evolutions.length === 0 && (
        <EmptyState
          icon={FileText}
          title="Nenhuma evolução encontrada"
          description="Não há evoluções que correspondam aos filtros aplicados."
          actionLabel={canCreateEvolution ? "Nova Evolução" : undefined}
          onAction={canCreateEvolution ? onNewEvolutionClick : undefined}
        />
      )}
    </div>
  );
};