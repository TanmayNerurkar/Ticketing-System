import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';
import { getToken, clearToken } from '../api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .fetchMe()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const result = await authApi.login(email, password);
      setUser(result.user);
      navigate('/dashboard');
      return result;
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

