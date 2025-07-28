import { useContext } from 'react';
import { MultiTenantContext, MultiTenantContextType } from './MultiTenantContext';

export const useMultiTenant = (): MultiTenantContextType => {
  const context = useContext(MultiTenantContext);
  if (!context) {
    throw new Error('useMultiTenant must be used within a MultiTenantProvider');
  }
  return context;
};
