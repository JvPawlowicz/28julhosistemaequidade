import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useMultiTenant } from "@/contexts/MultiTenantContext";

interface UnitDataIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

const UnitDataIndicator = ({ className = "", showDetails = false }: UnitDataIndicatorProps) => {
  const { currentUnit } = useMultiTenant();

  if (!currentUnit) return null;

  if (showDetails) {
    return (
      <Card className={`p-4 bg-primary-light border-primary-light ${className}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h4 className="font-semibold text-primary text-sm">Dados Filtrados</h4>
            <p className="text-primary text-xs">{currentUnit.name}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Badge variant="outline" className={`gap-1 ${className}`}>
      <MapPin className="h-3 w-3" />
      {currentUnit.name}
    </Badge>
  );
};

export { UnitDataIndicator };
export default UnitDataIndicator;