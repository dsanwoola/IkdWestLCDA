import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/react-app/lib/firebase";
import { installApiFetchShim } from "@/react-app/lib/firebaseApi";

type AppUser = {
  id: string;
  uid: string;
  email: string;
  google_user_data: {
    name: string | null;
    given_name: string | null;
    family_name: string | null;
    email: string | null;
    email_verified: boolean;
    picture: string | null;
  };
};

type AuthContextValue = {
  user: AppUser | null;
  firebaseUser: User | null;
  isPending: boolean;
  redirectToLogin: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  exchangeCodeForSessionToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

installApiFetchShim(() => auth.currentUser);

const toAppUser = (firebaseUser: User): AppUser => ({
  id: firebaseUser.uid,
  uid: firebaseUser.uid,
  email: firebaseUser.email || "",
  google_user_data: {
    name: firebaseUser.displayName,
    given_name: firebaseUser.displayName?.split(" ")[0] || null,
    family_name: firebaseUser.displayName?.split(" ").slice(1).join(" ") || null,
    email: firebaseUser.email,
    email_verified: firebaseUser.emailVerified,
    picture: firebaseUser.photoURL,
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const authReadyFallback = window.setTimeout(() => {
      setIsPending(false);
    }, 6000);

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      window.clearTimeout(authReadyFallback);
      setFirebaseUser(nextUser);
      setIsPending(false);
    });

    return () => {
      window.clearTimeout(authReadyFallback);
      unsubscribe();
    };
  }, []);

  const redirectToLogin = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user: firebaseUser ? toAppUser(firebaseUser) : null,
    firebaseUser,
    isPending,
    redirectToLogin,
    signInWithEmail,
    logout,
    exchangeCodeForSessionToken: async () => undefined,
  }), [firebaseUser, isPending, logout, redirectToLogin, signInWithEmail]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
