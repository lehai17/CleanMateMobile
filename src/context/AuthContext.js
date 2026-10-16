import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { TOKEN_KEY } from "../api/axios";
import { meApi } from "../api/auth";

const Ctx = createContext(undefined);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync("cm_user");
    setToken(null);
    setUser(null);
  };
  const refreshUser = async (currentUser) => {
    await SecureStore.setItemAsync("cm_user", JSON.stringify(currentUser));
    setUser(currentUser);
  };
  const login = async (currentUser, accessToken) => {
    await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
    await refreshUser(currentUser);
    setToken(accessToken);
  };
  const restore = async () => {
    setLoading(true);
    try {
      const accessToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!accessToken) return;
      const currentUser = await meApi();
      await refreshUser(currentUser);
      setToken(accessToken);
    } catch {
      await logout();
    } finally { setLoading(false); }
  };
  useEffect(() => { restore(); }, []);
  const value = useMemo(() => ({ user, token, login, logout, restore, refreshUser, loading }), [user, token, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useAuth() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}
