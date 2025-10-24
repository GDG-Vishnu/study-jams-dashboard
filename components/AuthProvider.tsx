"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextShape = {
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    try {
      const flag = localStorage.getItem("admin_logged_in");
      setIsAdmin(flag === "true");
    } catch (e) {
      setIsAdmin(false);
    }
  }, []);

  const login = () => {
    try {
      localStorage.setItem("admin_logged_in", "true");
    } catch (e) {}
    setIsAdmin(true);
  };

  const logout = () => {
    try {
      localStorage.removeItem("admin_logged_in");
    } catch (e) {}
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
