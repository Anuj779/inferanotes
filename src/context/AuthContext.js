"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { clientAuth, googleProvider } from "@/lib/firebase";
const AuthContext = createContext({});
export function AuthProvider({ children }) {
  const [state, setState] = useState({
    user: null,
    loading: true,
    configured: true,
  });
  useEffect(() => {
    const auth = clientAuth();
    if (!auth) {
      queueMicrotask(() =>
        setState({ user: null, loading: false, configured: false }),
      );
      return;
    }
    return onAuthStateChanged(auth, (user) =>
      setState({ user, loading: false, configured: true }),
    );
  }, []);
  const loginWithGoogle = async () => {
    const auth = clientAuth();
    if (!auth)
      throw new Error("Sign-in is being configured. Please try again later.");
    return (await signInWithPopup(auth, googleProvider)).user;
  };
  const logout = async () => {
    const auth = clientAuth();
    if (auth) await signOut(auth);
  };
  const api = async (path, options = {}) => {
    const user = clientAuth()?.currentUser;
    if (!user) throw new Error("Please sign in to continue.");
    const res = await fetch(path, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
    });
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("The service did not respond. Please try again.");
    }
    if (!res.ok) {
      const error = new Error(data.error || "Request failed.");
      error.code = data.code;
      throw error;
    }
    return data;
  };
  return (
    <AuthContext.Provider value={{ ...state, loginWithGoogle, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
