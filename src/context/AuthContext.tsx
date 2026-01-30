import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  isGuest: boolean;
  isLoading: boolean;
  setGuestMode: (enabled: boolean) => Promise<void>;
  requireAuth: (onSuccess: () => void) => void;
  showAuthPrompt: boolean;
  setShowAuthPrompt: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_MODE_KEY = '@uprep_guest_mode';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      // Check if user was in guest mode
      if (!session) {
        const guestMode = await AsyncStorage.getItem(GUEST_MODE_KEY);
        setIsGuest(guestMode === 'true');
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // User logged in, clear guest mode
        setIsGuest(false);
        AsyncStorage.removeItem(GUEST_MODE_KEY);
      }
    });

    return () => subscription.unsubscribe();
  };

  const setGuestMode = async (enabled: boolean) => {
    setIsGuest(enabled);
    if (enabled) {
      await AsyncStorage.setItem(GUEST_MODE_KEY, 'true');
    } else {
      await AsyncStorage.removeItem(GUEST_MODE_KEY);
    }
  };

  // Call this when an action requires authentication
  const requireAuth = (onSuccess: () => void) => {
    if (session) {
      // User is authenticated, proceed
      onSuccess();
    } else {
      // User is guest, show auth prompt
      setPendingAction(() => onSuccess);
      setShowAuthPrompt(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isGuest,
        isLoading,
        setGuestMode,
        requireAuth,
        showAuthPrompt,
        setShowAuthPrompt,
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
