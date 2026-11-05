import NetInfo from '@react-native-community/netinfo';
import type { Session, User } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type Team from '@/shared/db/model/team';
import { bindLocalDataToUser } from '@/shared/db/localUserScope';
import { getSupabaseClient } from '@/shared/api/supabase';
import { getTeamForUser } from '@/features/createTeam/model/createTeam';
import { signInWithGoogle, signInWithPassword, signOut, signUp } from './authService';

export type TeamStatus = 'checking' | 'required' | 'ready' | 'error';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  team: Team | null;
  loading: boolean;
  authError: string | null;
  teamStatus: TeamStatus;
  teamError: string | null;
  refreshTeamStatus: () => Promise<TeamStatus>;
  signUp: typeof signUp;
  signInWithPassword: typeof signInWithPassword;
  signInWithGoogle: typeof signInWithGoogle;
  signOut: typeof signOut;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function messageFromError(error: unknown): string {
  return error instanceof Error ? error.message : 'Произошла непредвиденная ошибка.';
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [teamStatus, setTeamStatus] = useState<TeamStatus>('checking');
  const [teamError, setTeamError] = useState<string | null>(null);
  const userId = session?.user.id;

  const refreshTeamStatus = useCallback(async (): Promise<TeamStatus> => {
    const userId = session?.user.id;
    if (!userId) {
      setTeam(null);
      setTeamStatus('required');
      return 'required';
    }

    setTeamStatus('checking');
    setTeamError(null);
    try {
      const currentTeam = await getTeamForUser(userId);
      setTeam(currentTeam);
      const status = currentTeam ? 'ready' : 'required';
      setTeamStatus(status);
      return status;
    } catch (error) {
      setTeamError(messageFromError(error));
      setTeamStatus('error');
      return 'error';
    }
  }, [session?.user.id]);

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
        if (!nextSession) {
          setTeam(null);
          setTeamStatus('required');
        }
      } catch (error) {
        if (active) {
          setSession(null);
          setTeam(null);
          setTeamStatus('required');
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

  useEffect(() => {
    if (!userId) return;
    void refreshTeamStatus();
  }, [userId, refreshTeamStatus]);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        if (active) void refreshTeamStatus();
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [userId, refreshTeamStatus]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      team,
      loading,
      authError,
      teamStatus,
      teamError,
      refreshTeamStatus,
      signUp,
      signInWithPassword,
      signInWithGoogle,
      signOut,
    }),
    [session, team, loading, authError, teamStatus, teamError, refreshTeamStatus],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
