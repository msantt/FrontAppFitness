import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

// Criação do contexto de autenticação
const AuthContext = createContext({});

// Provider do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há usuário logado ao iniciar o app
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Função de registro
  const register = async (userData) => {
    setLoading(true);
    const result = await authService.register(userData);
    setLoading(false);
    return result;
  };

  // Função de login
  const login = async (email, password) => {
    setLoading(true);
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
    }
    setLoading(false);
    return result;
  };

  // Função de logout
  const logout = async () => {
    setLoading(true);
    const result = await authService.logout();
    if (result.success) {
      setUser(null);
    }
    setLoading(false);
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
