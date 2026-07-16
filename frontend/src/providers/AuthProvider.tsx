import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, MockAuthService } from '../services/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateOnboarding: (role: UserProfile['role'], organization: string) => void;
  loginAsDemoRole: (role: UserProfile['role']) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const authService = new MockAuthService();

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

  const register = async (fullName: string, email: string) => {
    setLoading(true);
    try {
      const profile = await authService.register(fullName, email);
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

  const loginAsDemoRole = async (role: UserProfile['role']) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    // Custom pre-configured persona profiles matching the hackathon demo
    const demoProfiles: Record<UserProfile['role'], UserProfile> = {
      Citizen: {
        id: 'USR-CIT-01',
        fullName: 'Juan Dela Cruz',
        email: 'citizen.juan@gmail.com',
        role: 'Citizen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
        organization: 'Ward 4 Neighbors Association',
        createdAt: '2026-07-17',
      },
      'Government Official': {
        id: 'USR-GOV-02',
        fullName: 'Mayor Roberto Santos',
        email: 'mayor.santos@metrocity.gov',
        role: 'Government Official',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
        organization: 'Office of the Executive Mayor',
        createdAt: '2026-07-17',
      },
      Auditor: {
        id: 'USR-AUD-03',
        fullName: 'Maria Santos',
        email: 'm.santos@auditor.org',
        role: 'Auditor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
        organization: 'Municipality of Salay',
        createdAt: '2026-07-17',
      },
      Administrator: {
        id: 'USR-ADM-04',
        fullName: 'System Overseer',
        email: 'admin.overseer@salay.ai',
        role: 'Administrator',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
        organization: 'Salay Core Engine Controls',
        createdAt: '2026-07-17',
      },
    };

    const profile = demoProfiles[role];
    authService.saveUser(profile);
    setUser(profile);
    setLoading(false);
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
        loginAsDemoRole,
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
