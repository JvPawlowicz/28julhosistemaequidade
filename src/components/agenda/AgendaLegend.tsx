import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AgendaLegend: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Legenda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded"></div>
            <span className="text-sm">Psicologia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary rounded"></div>
            <span className="text-sm">Terapia Ocupacional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-warning rounded"></div>
            <span className="text-sm">Fonoaudiologia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-success rounded"></div>
            <span className="text-sm">Fisioterapia</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Badge className="bg-success text-success-foreground">Realizado</Badge>
          <Badge className="bg-primary text-primary-foreground">Confirmado</Badge>
          <Badge className="bg-warning text-warning-foreground">Agendado</Badge>
          <Badge className="bg-destructive text-destructive-foreground">Faltou</Badge>
          <Badge className="bg-muted text-muted-foreground">Cancelado</Badge>
        </div>
      </CardContent>
    </Card>
  );
};