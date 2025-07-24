import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Unit {
  id: string;
  name: string;
  address: string;
  phone: string;
  active: boolean;
  settings: {
    workingHours: { start: string; end: string };
    timezone: string;
    specialties: string[];
  };
}

export interface Professional {
  id: string;
  name: string;
  email: string;
  role: string;
  specialty: string;
  units: string[]; // IDs das unidades onde pode atuar
  permissions: string[];
}

interface MultiTenantContextType {
  currentUnit: Unit | null;
  availableUnits: Unit[];
  currentUser: Professional | null;
  switchUnit: (unitId: string) => void;
  hasAccessToUnit: (unitId: string) => boolean;
  getUserUnits: () => Unit[];
}

const MultiTenantContext = createContext<MultiTenantContextType | null>(null);

// Mock data - Em produção, viria do Supabase
const mockUnits: Unit[] = [
  {
    id: "unit-centro",
    name: "Centro",
    address: "Rua Principal, 123 - Centro",
    phone: "(16) 3333-1111",
    active: true,
    settings: {
      workingHours: { start: "08:00", end: "18:00" },
      timezone: "America/Sao_Paulo",
      specialties: ["Psicologia", "Terapia Ocupacional", "Fonoaudiologia"]
    }
  },
  {
    id: "unit-norte",
    name: "Norte",
    address: "Av. Norte, 456 - Jardim Norte",
    phone: "(16) 3333-2222",
    active: true,
    settings: {
      workingHours: { start: "07:00", end: "17:00" },
      timezone: "America/Sao_Paulo",
      specialties: ["Terapia Ocupacional", "Fisioterapia"]
    }
  },
  {
    id: "unit-sul",
    name: "Sul",
    address: "Rua Sul, 789 - Vila Sul",
    phone: "(16) 3333-3333",
    active: true,
    settings: {
      workingHours: { start: "08:00", end: "19:00" },
      timezone: "America/Sao_Paulo",
      specialties: ["Psicologia", "Fonoaudiologia", "Neuropsicologia"]
    }
  }
];

const mockCurrentUser: Professional = {
  id: "prof-1",
  name: "Dr. João Silva",
  email: "joao.silva@equidade.com",
  role: "admin",
  specialty: "Administração",
  units: ["unit-centro", "unit-norte", "unit-sul"], // Admin tem acesso a todas
  permissions: ["view_all_units", "manage_users", "view_reports"]
};

interface MultiTenantProviderProps {
  children: ReactNode;
}

export const MultiTenantProvider = ({ children }: MultiTenantProviderProps) => {
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [availableUnits] = useState<Unit[]>(mockUnits);
  const [currentUser] = useState<Professional>(mockCurrentUser);

  // Inicializar com a primeira unidade disponível para o usuário
  useEffect(() => {
    const userUnits = getUserUnits();
    if (userUnits.length > 0 && !currentUnit) {
      setCurrentUnit(userUnits[0]);
    }
  }, [currentUser]);

  const switchUnit = (unitId: string) => {
    if (hasAccessToUnit(unitId)) {
      const unit = availableUnits.find(u => u.id === unitId);
      if (unit) {
        setCurrentUnit(unit);
        // Em produção, salvaria no localStorage/sessionStorage
        localStorage.setItem('selectedUnit', unitId);
      }
    }
  };

  const hasAccessToUnit = (unitId: string): boolean => {
    return currentUser.units.includes(unitId);
  };

  const getUserUnits = (): Unit[] => {
    return availableUnits.filter(unit => 
      currentUser.units.includes(unit.id) && unit.active
    );
  };

  return (
    <MultiTenantContext.Provider
      value={{
        currentUnit,
        availableUnits,
        currentUser,
        switchUnit,
        hasAccessToUnit,
        getUserUnits
      }}
    >
      {children}
    </MultiTenantContext.Provider>
  );
};

export const useMultiTenant = () => {
  const context = useContext(MultiTenantContext);
  if (!context) {
    throw new Error('useMultiTenant must be used within a MultiTenantProvider');
  }
  return context;
};