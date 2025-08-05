import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables, Enums } from '@/integrations/supabase/types';

export type Unit = Tables<'units'> & {
  active: boolean;
  settings: {
    workingHours: { start: string; end: string };
    timezone: string;
    specialties: string[];
  };
};

export interface Professional {
  id: string;
  name: string;
  email: string;
  role: Enums<'app_role'> | 'responsavel'; // Use Supabase enum for roles, add 'responsavel'
  specialty: Enums<'specialty'> | null; // Use Supabase enum for specialty
  units: string[]; // IDs das unidades onde pode atuar
  requires_supervision: boolean; // Directly from profiles table
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
          ...unit,
          active: true, // Assuming all fetched units are active for now
          settings: { // Mock settings as they are not in the units table schema
            workingHours: { start: "08:00", end: "18:00" },
            timezone: "America/Sao_Paulo",
            specialties: ["psicologia", "terapia_ocupacional", "fonoaudiologia"] // Use enum values
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
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, requires_supervision, unit_id, status, council_type')
          .eq('user_id', user.id)
          .single();

        // Fetch user roles
        const { data: userRolesData, error: userRolesError } = await supabase
          .from('user_roles')
          .select('role, specialty, unit_id')
          .eq('user_id', user.id);

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          return;
        }
        if (userRolesError) {
          console.error('Error fetching user roles:', userRolesError);
          return;
        }

        // Determine the primary role and associated units
        let primaryRole: Enums<'app_role'> | 'responsavel' = 'responsavel'; // Default for non-professional users
        let userSpecialty: Enums<'specialty'> | null = null;
        let assignedUnitIds: string[] = [];

        if (userRolesData && userRolesData.length > 0) {
          // Prioritize admin, then coordinator, then therapist/estagiario, then recepcao
          const rolesOrder: (Enums<'app_role'>)[] = ['admin', 'coordenador', 'terapeuta', 'estagiario', 'recepcao'];
          const sortedRoles = userRolesData.sort((a, b) => rolesOrder.indexOf(a.role) - rolesOrder.indexOf(b.role));
          
          primaryRole = sortedRoles[0].role;
          userSpecialty = sortedRoles[0].specialty;
          assignedUnitIds = userRolesData.map(ur => ur.unit_id).filter((id): id is string => id !== null);
        } else if (profileData) {
          // Fallback if no user_roles, assume a basic role based on profile status or default
          // This part might need adjustment based on how you assign roles initially
          primaryRole = (profileData.status as Enums<'app_role'>) || 'terapeuta'; 
          userSpecialty = (profileData.council_type as Enums<'specialty'>) || null;
          if (profileData.unit_id) {
            assignedUnitIds.push(profileData.unit_id);
          }
        }

        const userProfessional: Professional = {
          id: user.id,
          name: profileData.full_name || user.email || '',
          email: user.email || '',
          role: primaryRole,
          specialty: userSpecialty,
          units: assignedUnitIds,
          requires_supervision: profileData.requires_supervision || false,
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