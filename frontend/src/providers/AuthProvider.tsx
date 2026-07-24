import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, RealAuthService } from '../services/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, role?: UserProfile['role'], organization?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateOnboarding: (role: UserProfile['role'], organization: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const authService = new RealAuthService();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Session Continuity check
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const profile = await authService.login(email, password);
      setUser(profile);
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName: string, email: string, role?: UserProfile['role'], organization?: string, password?: string) => {
    setLoading(true);
    try {
      const profile = await authService.register(fullName, email, role, organization, password);
      setUser(profile);
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateOnboarding = (role: UserProfile['role'], organization: string) => {
    if (!user) return;
    const updated = {
      ...user,
      role,
      organization: organization || 'Metro City Civic Council',
    };
    authService.saveUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed inside an AuthProvider wrapper.');
  }
  return context;
};
