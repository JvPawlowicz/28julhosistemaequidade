import * as React from 'react';
import { createContext, useContext, ReactNode } from "react";
import { useMultiTenant } from "./useMultiTenant";

export interface Permission {
  resource: string;
  action: string;
  scope?: 'own' | 'unit' | 'global';
}

export interface RolePermissions {
  [key: string]: Permission[];
}

const rolePermissions: RolePermissions = {
  admin: [
    // Admin tem TODAS as permissões de TODOS os perfis
    // Agenda - acesso global
    { resource: 'agenda', action: 'view', scope: 'global' },
    { resource: 'agenda', action: 'create', scope: 'global' },
    { resource: 'agenda', action: 'update', scope: 'global' },
    { resource: 'agenda', action: 'delete', scope: 'global' },
    { resource: 'agenda', action: 'update_status', scope: 'global' },
    
    // Pacientes - acesso global
    { resource: 'pacientes', action: 'view', scope: 'global' },
    { resource: 'pacientes', action: 'create', scope: 'global' },
    { resource: 'pacientes', action: 'update', scope: 'global' },
    { resource: 'pacientes', action: 'delete', scope: 'global' },
    
    // Prontuários - acesso total
    { resource: 'prontuarios', action: 'view', scope: 'global' },
    { resource: 'prontuarios', action: 'create', scope: 'global' },
    { resource: 'prontuarios', action: 'update', scope: 'global' },
    { resource: 'prontuarios', action: 'delete', scope: 'global' },
    
    // Clinical records - acesso total
    { resource: 'clinical_records', action: 'view', scope: 'global' },
    { resource: 'clinical_records', action: 'edit', scope: 'global' },
    { resource: 'clinical_records', action: 'delete', scope: 'global' },
    
    // Evoluções - pode supervisionar todas
    { resource: 'evolucoes', action: 'create', scope: 'global' },
    { resource: 'evolucoes', action: 'update', scope: 'global' },
    { resource: 'evolucoes', action: 'finalize', scope: 'global' },
    { resource: 'evolucoes', action: 'approve', scope: 'global' },
    
    // Supervisão
    { resource: 'supervision', action: 'manage', scope: 'global' },
    
    // Usuários e configurações
    { resource: 'users', action: 'manage', scope: 'global' },
    { resource: 'settings', action: 'manage', scope: 'global' },
    
    // Relatórios - acesso total
    { resource: 'relatorios', action: 'view', scope: 'global' },
    { resource: 'relatorios', action: 'export', scope: 'global' },
    
    // Unidades
    { resource: 'units', action: 'manage', scope: 'global' },
  ],

  coordenador: [
    // Agenda da unidade
    { resource: 'agenda', action: 'view', scope: 'unit' },
    { resource: 'agenda', action: 'create', scope: 'unit' },
    { resource: 'agenda', action: 'update', scope: 'unit' },
    { resource: 'agenda', action: 'update_status', scope: 'unit' },
    
    // Pacientes da unidade
    { resource: 'pacientes', action: 'view', scope: 'unit' },
    { resource: 'pacientes', action: 'create', scope: 'unit' },
    { resource: 'pacientes', action: 'update', scope: 'unit' },
    
    // Prontuários da equipe para supervisão
    { resource: 'prontuarios', action: 'view', scope: 'unit' },
    { resource: 'clinical_records', action: 'view', scope: 'unit' },
    
    // Supervisão de estagiários
    { resource: 'supervision', action: 'manage', scope: 'unit' },
    { resource: 'evolucoes', action: 'approve', scope: 'unit' },
    
    // Relatórios da unidade
    { resource: 'relatorios', action: 'view', scope: 'unit' },
    
    // Configurações limitadas
    { resource: 'settings', action: 'view', scope: 'unit' },
  ],

  terapeuta: [
    // Agenda - apenas própria
    { resource: 'agenda', action: 'view', scope: 'own' },
    { resource: 'agenda', action: 'update_status', scope: 'own' },
    
    // Pacientes - apenas os próprios
    { resource: 'pacientes', action: 'view', scope: 'own' },
    { resource: 'prontuarios', action: 'view', scope: 'own' },
    { resource: 'prontuarios', action: 'create', scope: 'own' },
    { resource: 'prontuarios', action: 'update', scope: 'own' },
    
    // Clinical records - apenas próprios pacientes
    { resource: 'clinical_records', action: 'view', scope: 'own' },
    { resource: 'clinical_records', action: 'edit', scope: 'own' },
    
    // Evoluções - apenas próprias
    { resource: 'evolucoes', action: 'create', scope: 'own' },
    { resource: 'evolucoes', action: 'update', scope: 'own' },
    { resource: 'evolucoes', action: 'finalize', scope: 'own' },
    
    // PTI e Avaliações - apenas próprios pacientes
    { resource: 'pti', action: 'view', scope: 'own' },
    { resource: 'pti', action: 'update', scope: 'own' },
    { resource: 'avaliacoes', action: 'create', scope: 'own' },
    
    // Relatórios pessoais
    { resource: 'relatorios', action: 'view', scope: 'own' },
    
    // Perfil próprio
    { resource: 'perfil', action: 'update', scope: 'own' }
  ],

  estagiario: [
    // Herda todas permissões do terapeuta
    { resource: 'agenda', action: 'view', scope: 'own' },
    { resource: 'agenda', action: 'update_status', scope: 'own' },
    { resource: 'pacientes', action: 'view', scope: 'own' },
    { resource: 'prontuarios', action: 'view', scope: 'own' },
    { resource: 'prontuarios', action: 'create', scope: 'own' },
    { resource: 'prontuarios', action: 'update', scope: 'own' },
    { resource: 'clinical_records', action: 'view', scope: 'own' },
    { resource: 'clinical_records', action: 'edit', scope: 'own' },
    { resource: 'evolucoes', action: 'create', scope: 'own' },
    { resource: 'evolucoes', action: 'update', scope: 'own' },
    // Mas evoluções precisam de supervisão
    { resource: 'evolucoes', action: 'requires_supervision' },
    { resource: 'pti', action: 'view', scope: 'own' },
    { resource: 'pti', action: 'update', scope: 'own' },
    { resource: 'avaliacoes', action: 'create', scope: 'own' },
    { resource: 'relatorios', action: 'view', scope: 'own' },
    { resource: 'perfil', action: 'update', scope: 'own' }
  ],

  recepcao: [
    // Apenas dados não-clínicos
    { resource: 'pacientes', action: 'view_basic', scope: 'unit' },
    { resource: 'pacientes', action: 'create', scope: 'unit' },
    { resource: 'pacientes', action: 'update_basic', scope: 'unit' },
    
    // Agenda - apenas visualização
    { resource: 'agenda', action: 'view', scope: 'unit' },
    
    // SEM acesso a dados clínicos
    { resource: 'prontuarios', action: 'deny' },
    { resource: 'clinical_records', action: 'deny' },
    { resource: 'evolucoes', action: 'deny' },
    { resource: 'pti', action: 'deny' },
    { resource: 'avaliacoes', action: 'deny' }
  ],

  responsavel: [
    // Acesso aos dados do próprio filho/paciente
    { resource: 'agenda', action: 'view', scope: 'own' },
    { resource: 'pacientes', action: 'view_basic', scope: 'own' },
    { resource: 'relatorios', action: 'request', scope: 'own' },
    { resource: 'documentos', action: 'view', scope: 'own' },
    { resource: 'comunicacao', action: 'send', scope: 'own' }
  ]
};

interface PermissionsContextType {
  hasPermission: (resource: string, action: string, scope?: string) => boolean;
  getUserRole: () => string;
  isAdmin: () => boolean;
  isCoordinator: () => boolean;
  isTerapeuta: () => boolean;
  isRecepcao: () => boolean;
  requiresSupervision: () => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | null>(null);

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider = ({ children }: PermissionsProviderProps) => {
  const { currentUser } = useMultiTenant();

  const hasPermission = (resource: string, action: string, scope?: string): boolean => {
    if (!currentUser) return false;

    const userPermissions = rolePermissions[currentUser.role] || [];
    
    // Admin tem acesso total
    if (currentUser.role === 'admin') return true;

    // Verifica se tem permissão negada explícita
    const denied = userPermissions.some(p => 
      p.resource === resource && p.action === 'deny'
    );
    if (denied) return false;

    // Verifica permissões específicas
    return userPermissions.some(permission => {
      const resourceMatch = permission.resource === '*' || permission.resource === resource;
      const actionMatch = permission.action === '*' || permission.action === action;
      const scopeMatch = !scope || permission.scope === scope || permission.scope === 'global';
      
      return resourceMatch && actionMatch && scopeMatch;
    });
  };

  const getUserRole = () => currentUser?.role || '';
  const isAdmin = () => currentUser?.role === 'admin';
  const isCoordinator = () => currentUser?.role === 'coordenador';
  const isTerapeuta = () => ['terapeuta', 'estagiario'].includes(currentUser?.role || '');
  const isRecepcao = () => currentUser?.role === 'recepcao';
  const requiresSupervision = () => currentUser?.role === 'estagiario';

  return (
    <PermissionsContext.Provider
      value={{
        hasPermission,
        getUserRole,
        isAdmin,
        isCoordinator,
        isTerapeuta,
        isRecepcao,
        requiresSupervision
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export { PermissionsContext };