// src/context/AuthContext.jsx
//
// Bungkus <App> kamu dengan <AuthProvider> di main.jsx / App.jsx:
//
//   <AuthProvider>
//     <App />
//   </AuthProvider>
//
// Lalu di halaman Login/Register/Dashboard yang SUDAH ADA, tinggal pakai:
//   const { user, login, register, logout, loading } = useAuth();

import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken, clearToken } from "../lib/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true saat cek token awal load

  // Saat app pertama kali dibuka, cek apakah ada token tersimpan & masih valid
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { user, token } = await api.login({ email, password });
    setToken(token);
    setUser(user);
    return user;
  }

  async function register({ name, email, password, role }) {
    const { user, token } = await api.register({ name, email, password, role });
    setToken(token);
    setUser(user);
    return user;
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === "ADMIN" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
