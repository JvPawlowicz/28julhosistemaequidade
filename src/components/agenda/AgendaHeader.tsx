import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Plus, Brain } from "lucide-react";
import { SmartScheduler } from "@/components/SmartScheduler";
import { useMultiTenant } from "@/contexts/useMultiTenant";
import { usePermissions } from "@/contexts/usePermissions";
import { UnitDataIndicator } from "@/components/UnitDataIndicator";

interface AgendaHeaderProps {
  onNewAppointmentClick: () => void;
}

export const AgendaHeader: React.FC<AgendaHeaderProps> = ({ onNewAppointmentClick }) => {
  const { currentUnit } = useMultiTenant();
  const { getUserRole, isAdmin } = usePermissions();
  const [showSmartScheduler, setShowSmartScheduler] = React.useState(false);

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-primary">
          {isAdmin() ? 'Agenda Global' : getUserRole() === 'terapeuta' ? 'Minha Agenda' : 'Agenda da Unidade'}
        </h1>
        <p className="text-muted-foreground">
          {isAdmin() && currentUnit ? `Visualizando: ${currentUnit.name}` : 'Gerencie atendimentos'}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
        <Dialog open={showSmartScheduler} onOpenChange={setShowSmartScheduler}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Brain className="h-4 w-4" />
              Agendamento Inteligente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agendamento Inteligente Coordenado</DialogTitle>
            </DialogHeader>
            <SmartScheduler />
          </DialogContent>
        </Dialog>
        <Button size="sm" className="gap-2" onClick={onNewAppointmentClick}>
          <Plus className="h-4 w-4" />
          Novo Agendamento
        </Button>
      </div>
    </div>
  );
};