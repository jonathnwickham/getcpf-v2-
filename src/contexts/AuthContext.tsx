import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      userRef.current = session?.user ?? null;
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      userRef.current = session?.user ?? null;
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Inactivity timeout — sign out after 15 minutes of no activity
  useEffect(() => {
    const resetTimer = () => {
      if (!userRef.current) return;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (userRef.current) signOut();
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events = ["mousemove", "keydown", "click", "scroll"] as const;

    if (user) {
      resetTimer();
      events.forEach(e => window.addEventListener(e, resetTimer));
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, [user]);

  const signOut = async () => {
    try { await supabase.auth.signOut(); } catch {}
    // Nuclear clear — remove everything
    localStorage.clear();
    sessionStorage.clear();
    // Force full page reload to clear React state
    window.location.replace("/");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
