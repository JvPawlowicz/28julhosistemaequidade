import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from '@/integrations/supabase/types';

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
  profile?: {
    requires_supervision?: boolean;
  };
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

interface MultiTenantProviderProps {
  children: ReactNode;
}

export const MultiTenantProvider = ({ children }: MultiTenantProviderProps) => {
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);
  const [availableUnits, setAvailableUnits] = useState<Unit[]>([]);
  const [currentUser, setCurrentUser] = useState<Professional | null>(null);
  const { user, loading: authLoading } = useAuth();

  // Fetch all available units
  useEffect(() => {
    async function fetchUnits() {
      const { data, error } = await supabase
        .from('units')
        .select('*');
      if (!error && data) {
        const formattedUnits: Unit[] = data.map(unit => ({
          id: unit.id,
          name: unit.name,
          address: unit.address || '',
          phone: unit.phone || '',
          active: true, // Assuming all fetched units are active for now
          settings: { // Mock settings as they are not in the units table schema
            workingHours: { start: "08:00", end: "18:00" },
            timezone: "America/Sao_Paulo",
            specialties: ["Psicologia", "Terapia Ocupacional", "Fonoaudiologia"]
          }
        }));
        setAvailableUnits(formattedUnits);
      } else {
        console.error('Error fetching units:', error);
      }
    }
    fetchUnits();
  }, []);

  // Fetch current user profile and set initial unit
  useEffect(() => {
    async function fetchUserProfileAndSetUnit() {
      if (user && availableUnits.length > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!profileError && profileData) {
          const userProfessional: Professional = {
            id: user.id,
            name: profileData.full_name || user.email || '',
            email: user.email || '',
            role: profileData.status || 'terapeuta', // Using 'status' as role
            specialty: profileData.council_type || '', // Using 'council_type' as specialty
            units: profileData.unit_id ? [profileData.unit_id] : [], // Assuming unit_id is the primary unit
            permissions: [], // Permissions are hardcoded in PermissionsContext for now
            profile: {
              requires_supervision: profileData.requires_supervision || false
            },
          };
          setCurrentUser(userProfessional);

          // Set initial unit based on user's primary unit or first available
          const storedUnitId = localStorage.getItem('selectedUnit');
          let initialUnit = null;

          if (storedUnitId && userProfessional.units.includes(storedUnitId)) {
            initialUnit = availableUnits.find(u => u.id === storedUnitId);
          } else if (userProfessional.units.length > 0) {
            initialUnit = availableUnits.find(u => u.id === userProfessional.units[0]);
          } else if (userProfessional.role === 'admin' && availableUnits.length > 0) {
            // Admins can see all units, default to the first one if no specific unit is assigned
            initialUnit = availableUnits[0];
          }
          
          if (initialUnit) {
            setCurrentUnit(initialUnit);
            localStorage.setItem('selectedUnit', initialUnit.id);
          }
        } else {
          console.error('Error fetching user profile:', profileError);
        }
      }
    }
    if (!authLoading) { // Only fetch profile once auth is not loading
      fetchUserProfileAndSetUnit();
    }
  }, [user, availableUnits, authLoading]);

  const getUserUnits = React.useCallback((): Unit[] => {
    if (currentUser?.role === 'admin') {
      return availableUnits.filter(unit => unit.active); // Admin sees all active units
    }
    return availableUnits.filter(unit => 
      currentUser?.units.includes(unit.id) && unit.active
    );
  }, [availableUnits, currentUser]);

  const switchUnit = (unitId: string) => {
    if (hasAccessToUnit(unitId)) {
      const unit = availableUnits.find(u => u.id === unitId);
      if (unit) {
        setCurrentUnit(unit);
        localStorage.setItem('selectedUnit', unitId);
      }
    }
  };

  const hasAccessToUnit = (unitId: string): boolean => {
    if (currentUser?.role === 'admin') return true; // Admin has access to all
    return currentUser?.units.includes(unitId) ?? false;
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

export { MultiTenantContext };
export type { MultiTenantContextType };