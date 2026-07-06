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
    const storedUser = localStorage.getItem('tm_connect_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Restore session immediately so UI works without a re-login
        setUser(parsed);
        // Then silently re-fetch from /me to get any updated san_password, san_username, etc.
        if (parsed?.token) {
          fetch(`${API_BASE}/web-crm/me`, {
            headers: {
              'Authorization': `Bearer ${parsed.token}`,
              'Accept': 'application/json',
            },
          })
            .then(r => r.json())
            .then(json => {
              if (json?.status && json?.user) {
                const refreshed: User = {
                  ...parsed,
                  san_username:  json.user.san_username  || parsed.san_username,
                  san_password:  json.user.san_password  || parsed.san_password,
                  san_extension: json.user.san_extension || parsed.san_extension,
                };
                setUser(refreshed);
                localStorage.setItem('tm_connect_user', JSON.stringify(refreshed));
              }
              setIsLoading(false);
            })
            .catch(() => {
              /* network error — keep stored session */
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      } catch (e) {
        localStorage.removeItem('tm_connect_user');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, _role?: Role, password?: string): Promise<User | null> => {
    setIsLoading(true);

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
          password: password,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json.status && json.token) {
          // Parse the exact role from the backend
          const userRole = (json.user.role as Role);
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

      setIsLoading(false);
      return null;

    } catch (err) {
      clearTimeout(timeoutId);
      setIsLoading(false);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
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
