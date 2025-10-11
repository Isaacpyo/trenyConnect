"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
// If you use Firebase later, you can import your auth listener here.

export type AppUser = {
    name: string; uid: string; email: string | null 
};

type AppContextValue = {
  user: AppUser | null;
  loading: boolean;
  setUser: (u: AppUser | null) => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Replace this with your real auth bootstrap (e.g., Firebase onAuthStateChanged)
  useEffect(() => {
    let isMounted = true;
    // Simulate initial auth check; remove when you wire real auth.
    Promise.resolve().then(() => {
      if (!isMounted) return;
      // Example: start with no user
      setUser(null);
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(() => ({ user, loading, setUser }), [user, loading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}
