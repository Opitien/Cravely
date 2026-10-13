import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { Session, User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean; // true until the stored session has been read on startup
  signIn: (email: string, password: string) => Promise<void>;
  /** Resolves `needsConfirmation: true` when the project requires email confirmation. */
  signUp: (name: string, email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  /** True after the user opened a password-reset link; the app should ask for a new password. */
  isPasswordRecovery: boolean;
  clearPasswordRecovery: () => void;
}

/**
 * Email links (sign-up confirmation, password reset) open the app with the session
 * tokens in the URL fragment: cravely://#access_token=...&refresh_token=...&type=recovery
 */
function parseAuthFragment(url: string) {
  const fragment = url.split('#')[1];
  if (!fragment) return null;
  const params = new URLSearchParams(fragment);
  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');
  if (!access_token || !refresh_token) return null;
  return { access_token, refresh_token, type: params.get('type') };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const url = Linking.useLinkingURL();

  // Native: turn auth deep links into a session. (On web, supabase-js reads the URL itself.)
  useEffect(() => {
    if (!url || Platform.OS === 'web') return;
    const tokens = parseAuthFragment(url);
    if (!tokens) return;
    supabase.auth
      .setSession({ access_token: tokens.access_token, refresh_token: tokens.refresh_token })
      .then(({ error }) => {
        if (!error && tokens.type === 'recovery') setIsPasswordRecovery(true);
      });
  }, [url]);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      .finally(() => setIsLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
      if (event === 'SIGNED_OUT') {
        setIsPasswordRecovery(false);
        // Don't leak one account's cached data into the next sign-in.
        queryClient.clear();
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [queryClient]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        emailRedirectTo: Linking.createURL('/'),
      },
    });
    if (error) throw error;
    return { needsConfirmation: !data.session };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: Linking.createURL('/'),
    });
    if (error) throw error;
  };

  const clearPasswordRecovery = useCallback(() => setIsPasswordRecovery(false), []);

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    setIsPasswordRecovery(false);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        isPasswordRecovery,
        clearPasswordRecovery,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
