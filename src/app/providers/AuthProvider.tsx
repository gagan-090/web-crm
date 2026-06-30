import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, ROLE_SHORT_CODES } from '../../shared/constants/roles';
import { API_BASE_URL } from '../../shared/constants/config';


export interface User {
  id?: number;
  name: string;
  email: string;
  role: Role;
  sub_role?: string | null;
  token?: string;
  san_username?: string | null;
  san_password?: string | null;
  san_extension?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, role?: Role, password?: string) => Promise<User | null>;
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

  const login = async (email: string, role?: Role, password?: string): Promise<User | null> => {
    setIsLoading(true);
    const mockRole = role || Role.TH;
    const mockUser: User = {
      id: 999,
      name: `Demo User (${ROLE_SHORT_CODES[mockRole] || mockRole})`,
      email: email,
      role: mockRole,
      sub_role: mockRole === Role.TL ? 'Driver Welcome' : null,
      token: 'mock_sanctum_token_12345',
      san_username: 'demo_san',
      san_password: 'password',
      san_extension: '178'
    };

    // If browser is offline, instantly return mock user without fetch to prevent hanging
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      console.warn('[AUTH] Browser offline. Instantly logging in with simulated session.');
      setUser(mockUser);
      localStorage.setItem('tm_connect_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return mockUser;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(`${API_BASE}/web-crm/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password || 'password123',
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json.status && json.token) {
          const userRole = (json.user.role as Role) || role || Role.TH;
          const userSession: User = {
            id: json.user.id,
            name: json.user.name,
            email: json.user.email,
            role: userRole,
            sub_role: json.user.sub_role || null,
            token: json.token,
            san_username: json.user.san_username || null,
            san_password: json.user.san_password || null,
            san_extension: json.user.san_extension || null,
          };
          setUser(userSession);
          localStorage.setItem('tm_connect_user', JSON.stringify(userSession));
          setIsLoading(false);
          return userSession;
        }
      }

      // If backend returns non-ok status, fallback to simulated session for demo representation
      console.warn('[AUTH] Login API returned non-ok status. Falling back to mock user.');
      setUser(mockUser);
      localStorage.setItem('tm_connect_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return mockUser;

    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('[AUTH] Backend offline or request timed out. Using simulated session:', err);
      setUser(mockUser);
      localStorage.setItem('tm_connect_user', JSON.stringify(mockUser));
      setIsLoading(false);
      return mockUser;
    }
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
