import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Clock, 
  Phone,
  ChevronDown,
  Check,
  Building2,
  Users,
  Activity
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMultiTenant } from "@/contexts/MultiTenantContext";

const UnitSelector = () => {
  const { currentUnit, getUserUnits, switchUnit } = useMultiTenant();
  const userUnits = getUserUnits();

  if (!currentUnit || userUnits.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-medical-gray rounded-lg">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          {currentUnit?.name || "Nenhuma unidade"}
        </span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 h-10">
          <Building2 className="h-4 w-4" />
          <span className="font-medium">{currentUnit.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <div className="p-2">
          <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
            SUAS UNIDADES
          </div>
          {userUnits.map((unit) => (
            <DropdownMenuItem
              key={unit.id}
              onClick={() => switchUnit(unit.id)}
              className="p-3 cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{unit.name}</span>
                      {currentUnit.id === unit.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {unit.address.split('-')[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {unit.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UnitCard = () => {
  const { currentUnit } = useMultiTenant();

  if (!currentUnit) return null;

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{currentUnit.name}</h3>
              <p className="text-sm text-muted-foreground">{currentUnit.address}</p>
            </div>
          </div>
          <Badge className="bg-success text-success-foreground">Ativa</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {currentUnit.settings.workingHours.start} às {currentUnit.settings.workingHours.end}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{currentUnit.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span>{currentUnit.settings.specialties.length} especialidades</span>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xs text-muted-foreground mb-2">Especialidades:</div>
          <div className="flex gap-1 flex-wrap">
            {currentUnit.settings.specialties.map((specialty) => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitSelector;