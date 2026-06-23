import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, ROLE_SHORT_CODES } from '../../shared/constants/roles';
import { API_BASE_URL } from '../../shared/constants/config';


export interface User {
  name: string;
  email: string;
  role: Role;
  sub_role?: string | null;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, role: Role) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const API_BASE = API_BASE_URL;

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
    try {
      const response = await fetch(`${API_BASE}/web-crm/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: 'password123',
        })
      });

      if (response.ok) {
        const json = await response.json();
        if (json.status && json.token) {
          const userSession: User = {
            name: json.user.name,
            email: json.user.email,
            role: json.user.role as Role,
            sub_role: json.user.sub_role || null,
            token: json.token
          };
          setUser(userSession);
          localStorage.setItem('tm_connect_user', JSON.stringify(userSession));
          setIsLoading(false);
          return true;
        }
      }
    } catch (err) {
      console.warn('[AUTH] Backend offline or login failed. Using simulated session:', err);
    }

    // Fallback to simulated login
    const mockUser: User = {
      name: `Demo User (${role})`,
      email: email,
      role: role,
      sub_role: role === Role.TL ? 'Driver Welcome' : null,
      token: 'mock_sanctum_token_12345'
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
      const shortCode = ROLE_SHORT_CODES[newRole] || 'dw';
      const updated: User = { 
        ...user, 
        role: newRole, 
        sub_role: newRole === Role.TL ? 'Driver Welcome' : null,
        name: `Demo User (${newRole})`,
        email: `${shortCode}@truckmitr.com`,
        token: 'mock_sanctum_token_12345'
      };
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
