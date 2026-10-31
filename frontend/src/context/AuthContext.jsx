import React, { useState, useEffect } from 'react';
import { api, refreshAccessToken } from '../services/api';
import { AuthContext } from './authContextDef';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session - strictly in-memory (no tokens stored in sessionStorage or localStorage to prevent theft)
  useEffect(() => {
    // Clear any residual storage in browser
    try {
      sessionStorage.removeItem('vww_access_token');
      sessionStorage.removeItem('vww_refresh_token');
      sessionStorage.removeItem('vww_user_profile');
      localStorage.removeItem('vww_auth_token');
      localStorage.removeItem('vww_user_profile');
    } catch (e) {}
    setLoading(false);
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
