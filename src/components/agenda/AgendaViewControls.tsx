import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AgendaViewControlsProps {
  currentDateDisplay: string;
  view: 'day' | 'week' | 'month';
  setView: (view: 'day' | 'week' | 'month') => void;
  onPrevClick: () => void;
  onNextClick: () => void;
}

export const AgendaViewControls: React.FC<AgendaViewControlsProps> = ({
  currentDateDisplay,
  view,
  setView,
  onPrevClick,
  onNextClick,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={onPrevClick}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold">{currentDateDisplay}</h3>
              <Button size="sm" variant="ghost" onClick={onNextClick}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant={view === 'day' ? 'default' : 'outline'}
              onClick={() => setView('day')}
            >
              Dia
            </Button>
            <Button 
              size="sm" 
              variant={view === 'week' ? 'default' : 'outline'}
              onClick={() => setView('week')}
            >
              Semana
            </Button>
            <Button 
              size="sm" 
              variant={view === 'month' ? 'default' : 'outline'}
              onClick={() => setView('month')}
            >
              Mês
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};