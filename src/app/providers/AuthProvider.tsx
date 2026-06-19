import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '../../shared/constants/roles';

export interface User {
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, role: Role) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('tm_connect_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('tm_connect_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: Role): Promise<boolean> => {
    setIsLoading(true);
    // Simulate Laravel Sanctum API request
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockUser: User = {
      name: `Demo User (${role})`,
      email: email,
      role: role
    };
    setUser(mockUser);
    localStorage.setItem('tm_connect_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tm_connect_user');
  };

  const switchRole = (newRole: Role) => {
    if (user) {
      const updated = { ...user, role: newRole, name: `Demo User (${newRole})` };
      setUser(updated);
      localStorage.setItem('tm_connect_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
