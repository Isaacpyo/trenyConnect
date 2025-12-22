"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig"; // adjust path if different


export type AppUser = {
  uid: string;
  email: string | null;
  name: string; // displayName fallback
  photoURL?: string | null;
};

type AppContextValue = {
  user: AppUser | null;
  loading: boolean;
  setUser: (u: AppUser | null) => void; // keep if you still want manual overrides
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

function mapFirebaseUser(u: FirebaseUser): AppUser {
  return {
    uid: u.uid,
    email: u.email,
    name: u.displayName || (u.email ? u.email.split("@")[0] : "User"),
    photoURL: u.photoURL,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) setUser(mapFirebaseUser(fbUser));
      else setUser(null);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const value = useMemo(() => ({ user, loading, setUser }), [user, loading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
}
