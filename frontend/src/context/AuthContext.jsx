import React, { useState, useEffect } from 'react';
import { api, refreshAccessToken } from '../services/api';
import { AuthContext } from './authContextDef';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from sessionStorage or verify with backend
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = sessionStorage.getItem('vww_access_token');
      const savedProfile = sessionStorage.getItem('vww_user_profile');

      if (savedToken && savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setUser(profile);
          setToken(savedToken);

          // Verify token validity with backend
          const me = await api.getMe();
          if (me) {
            setUser(me);
          } else {
            // Attempt silent refresh
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              setToken(refreshed);
              const reMe = await api.getMe();
              if (reMe) setUser(reMe);
            } else {
              api.logout();
              setUser(null);
              setToken(null);
            }
          }
        } catch (e) {
          api.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Silent automatic refresh loop: refreshes token every 12 minutes while active
  useEffect(() => {
    if (!token) return;

    // 12 minutes in ms (before the 15-minute token expires)
    const REFRESH_INTERVAL = 12 * 60 * 1000;
    const interval = setInterval(async () => {
      try {
        const refreshedToken = await refreshAccessToken();
        if (refreshedToken) {
          setToken(refreshedToken);
        } else {
          // Refresh token revoked or expired
          logout();
        }
      } catch (err) {
        // Network offline, will retry on next request
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [token]);

  // Login via Java Spring Boot Backend (Enterprise BCrypt + 15-min JWT + DB Refresh Token)
  const loginWithPassword = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      const authData = await api.login(emailOrUsername, password);
      setUser({
        username: authData.username,
        fullName: authData.fullName,
        role: authData.role
      });
      setToken(authData.accessToken);
      setLoading(false);
      return authData;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // Logout (revokes refresh token from Supabase DB and wipes session)
  const logout = async () => {
    await api.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      loginWithPassword,
      logout,
      isAuthenticated: !!user && !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
}
