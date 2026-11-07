import type { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { bindLocalDataToUser } from '@/shared/db/localUserScope';
import { getSupabaseClient } from '@/shared/api/supabase';
import { signInWithGoogle, signInWithPassword, signOut, signUp } from './authService';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  authError: string | null;
  signUp: typeof signUp;
  signInWithPassword: typeof signInWithPassword;
  signInWithGoogle: typeof signInWithGoogle;
  signOut: typeof signOut;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function messageFromError(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let receivedInitialSession = false;
    let client: ReturnType<typeof getSupabaseClient>;

    const applySession = async (nextSession: Session | null) => {
      if (!active) return;
      try {
        if (nextSession) await bindLocalDataToUser(nextSession.user.id);
        if (!active) return;
        setSession(nextSession);
        setAuthError(null);
      } catch (error) {
        if (active) {
          setSession(null);
          setAuthError(messageFromError(error));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    try {
      client = getSupabaseClient();
    } catch (error) {
      setAuthError(messageFromError(error));
      setLoading(false);
      return () => {
        active = false;
      };
    }

    const { data } = client.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'INITIAL_SESSION') {
        receivedInitialSession = true;
        void applySession(nextSession);
        return;
      }
      void Promise.resolve().then(() => applySession(nextSession));
    });

    void client.auth
      .getSession()
      .then(({ data: sessionData, error }) => {
        if (!active || receivedInitialSession) return;
        if (error) throw error;
        return applySession(sessionData.session);
      })
      .catch((error: unknown) => {
        if (active) {
          setAuthError(messageFromError(error));
          setLoading(false);
        }
      });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      authError,
      signUp,
      signInWithPassword,
      signInWithGoogle,
      signOut,
    }),
    [session, loading, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
