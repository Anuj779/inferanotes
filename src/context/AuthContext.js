"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { clientAuth } from "@/lib/firebase";
let guestSession;
async function ensureGuest() {
  const auth = clientAuth();
  if (!auth) throw new Error("Note generation is being configured. Please try again later.");
  await auth.authStateReady();
  if (auth.currentUser) return auth.currentUser;
  guestSession ||= signInAnonymously(auth).then(result => result.user).finally(() => { guestSession = null; });
  try { return await guestSession; }
  catch { throw new Error("Could not start your guest workspace. Please try again later."); }
}
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
  const api = async (path, options = {}) => {
    const user = await ensureGuest();
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
    <AuthContext.Provider value={{ ...state, api }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
