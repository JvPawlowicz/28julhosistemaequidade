import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, Clock, User } from "lucide-react";
import type { Evolution } from "@/types/Evolution";

interface EvolutionAnalyticsProps {
  evolutions: Evolution[];
}

export const EvolutionAnalytics: React.FC<EvolutionAnalyticsProps> = ({ evolutions }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{evolutions.length}</p>
                <p className="text-sm text-muted-foreground">Total de Evoluções</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">
                  {evolutions.filter(ev => ev.status === 'Finalizada').length}
                </p>
                <p className="text-sm text-muted-foreground">Finalizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">
                  {evolutions.filter(ev => ev.status === 'Pendente de Supervisão').length}
                </p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <FileText className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Relatório por Período</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20">
              <div className="text-center">
                <User className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Relatório por Terapeuta</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};