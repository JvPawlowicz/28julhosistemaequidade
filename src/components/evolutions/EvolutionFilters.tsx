import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface EvolutionFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterTerapeuta: string;
  setFilterTerapeuta: (therapistId: string) => void;
  therapists: Array<{ id: string; full_name: string }>;
}

export const EvolutionFilters: React.FC<EvolutionFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterTerapeuta,
  setFilterTerapeuta,
  therapists,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar paciente ou terapeuta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="finalizada">Finalizada</SelectItem>
              <SelectItem value="pendentesupervisao">Pendente Supervisão</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTerapeuta} onValueChange={setFilterTerapeuta}>
            <SelectTrigger>
              <SelectValue placeholder="Terapeuta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {therapists
                .filter((t, index, self) => self.findIndex(th => th.id === t.id) === index) // Ensure unique therapists
                .map(therapist => (
                  <SelectItem key={therapist.id} value={therapist.id}>
                    {therapist.full_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button className="gap-2">
            <Filter className="h-4 w-4" />
            Aplicar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};