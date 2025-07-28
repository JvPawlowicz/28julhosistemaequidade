import * as React from 'react';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthActions = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signOut, ...rest } = useAuth();

  // Wrappers que usam navigate corretamente
  const signInWithNavigate = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (!result.error) {
      setTimeout(() => navigate('/'), 1000);
    }
    return result;
  };

  const signOutWithNavigate = async () => {
    await signOut();
    navigate('/login');
  };

  return {
    ...rest,
    signIn: signInWithNavigate,
    signUp,
    signOut: signOutWithNavigate,
  };
};
