import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePermissions } from "@/contexts/usePermissions";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import UnitDataIndicator from "@/components/UnitDataIndicator";

interface EvolutionHeaderProps {
  onNewEvolutionClick: () => void;
}

export const EvolutionHeader: React.FC<EvolutionHeaderProps> = ({ onNewEvolutionClick }) => {
  const { isAdmin, getUserRole, hasPermission } = usePermissions();
  const { currentUnit } = useMultiTenant();

  const canCreateEvolution = hasPermission('clinical_records', 'create');
  const userRole = getUserRole();

  return (
    <div className="space-y-6">
      <UnitDataIndicator showDetails />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {isAdmin() ? 'Evoluções - Todas as Unidades' : 
             userRole === 'coordenador' ? 'Evoluções e Supervisão' : 'Minhas Evoluções'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin() && currentUnit ? `Visualizando: ${currentUnit.name}` : 
             userRole === 'coordenador' ? 'Gerencie evoluções e supervisão' :
             userRole === 'estagiario' ? 'Suas evoluções e supervisões pendentes' :
             'Suas evoluções clínicas'}
          </p>
        </div>
        
        {canCreateEvolution && (
          <Button className="gap-2" onClick={onNewEvolutionClick}>
            <Plus className="h-4 w-4" />
            Nova Evolução
          </Button>
        )}
      </div>
    </div>
  );
};