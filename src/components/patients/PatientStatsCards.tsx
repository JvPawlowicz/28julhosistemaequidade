import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, AlertCircle, CheckCircle } from "lucide-react";
import { useMultiTenant } from "@/contexts/useMultiTenant";

interface PatientStats {
  total: number;
  displayed: number;
  ativos: number;
  triagem: number;
  pausados: number;
}

interface PatientStatsCardsProps {
  stats: PatientStats;
  isAdmin: boolean;
}

export const PatientStatsCards: React.FC<PatientStatsCardsProps> = ({ stats, isAdmin }) => {
  const { currentUnit } = useMultiTenant();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.displayed}</p>
              <p className="text-sm text-muted-foreground">
                {isAdmin && currentUnit ? `${currentUnit.name}` : 'Meus Pacientes'}
              </p>
            </div>
          </div>
          {isAdmin && (
            <div className="mt-2 text-xs text-muted-foreground">
              Total sistema: {stats.total} • Nesta unidade: {stats.displayed}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-success" />
            <div>
              <p className="text-2xl font-bold">{stats.ativos}</p>
              <p className="text-sm text-muted-foreground">Em Atendimento</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-warning" />
            <div>
              <p className="text-2xl font-bold">{stats.triagem}</p>
              <p className="text-sm text-muted-foreground">Em Triagem</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold">{stats.pausados}</p>
              <p className="text-sm text-muted-foreground">Pausados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};