import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClerkProvider, useUser, useClerk, useSignIn, useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const ClerkAuthContext = createContext(null);

const rawPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';
const isClerkKeyValid =
  rawPublishableKey &&
  (rawPublishableKey.startsWith('pk_test_') || rawPublishableKey.startsWith('pk_live_')) &&
  !rawPublishableKey.includes('placeholder');

// Internal sync component that runs inside ClerkProvider when valid
function ClerkSyncInner({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const navigate = useNavigate();

  const [syncedMember, setSyncedMember] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shlloka_member_user') || 'null');
    } catch {
      return null;
    }
  });
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      if (!email) return;

      const clerkPayload = {
        clerkId: user.id,
        email,
        firstName: user.firstName || 'Devotee',
        lastName: user.lastName || 'Yatri',
        avatarUrl: user.imageUrl || null,
        mobile: user.primaryPhoneNumber?.phoneNumber || null,
      };

      setSyncing(true);
      api
        .syncClerkMember(clerkPayload)
        .then((res) => {
          if (res?.member && res?.token) {
            localStorage.setItem('shlloka_member_token', res.token);
            localStorage.setItem('shlloka_member_user', JSON.stringify(res.member));
            setSyncedMember(res.member);
          }
        })
        .catch((err) => {
          console.warn('Clerk DB sync note:', err.message);
        })
        .finally(() => {
          setSyncing(false);
        });
    }
  }, [isLoaded, isSignedIn, user]);

  const signInWithGoogle = async (redirectUrl = '/account') => {
    if (signIn) {
      try {
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: redirectUrl,
        });
      } catch (err) {
        console.error('Google Sign-In Error:', err);
        throw err;
      }
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('shlloka_member_token');
    localStorage.removeItem('shlloka_member_user');
    setSyncedMember(null);
    if (clerkSignOut) {
      await clerkSignOut();
    }
    navigate('/login');
  };

  const contextValue = {
    isClerkEnabled: true,
    isLoaded,
    isSignedIn: !!isSignedIn,
    user: syncedMember || (user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.imageUrl,
    } : null),
    clerkUser: user,
    syncing,
    signInWithGoogle,
    logout: handleLogout,
  };

  return (
    <ClerkAuthContext.Provider value={contextValue}>
      {children}
    </ClerkAuthContext.Provider>
  );
}

// Fallback Provider when Clerk key is not yet set or during offline/mock dev testing
function FallbackAuthProvider({ children }) {
  const navigate = useNavigate();
  const [member, setMember] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shlloka_member_user') || 'null');
    } catch {
      return null;
    }
  });

  const signInWithGoogle = async (redirectUrl = '/account') => {
    // Graceful demonstration simulation when Clerk/Google OAuth credentials are in developer sandbox
    const simulatedClerkUser = {
      clerkId: 'google_sub_devotee_google_shlloka_com',
      email: 'devotee.google@shlloka.com',
      firstName: 'Kailash',
      lastName: 'Devotee',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    };

    try {
      const res = await api.googleAuth(simulatedClerkUser);
      if (res?.member && res?.token) {
        localStorage.setItem('shlloka_member_token', res.token);
        localStorage.setItem('shlloka_member_user', JSON.stringify(res.member));
        setMember(res.member);
        const target = decodeURIComponent(redirectUrl || '/account');
        navigate(target, { replace: true });
      }
    } catch (err) {
      console.warn('Fallback Google Sync:', err);
      const target = decodeURIComponent(redirectUrl || '/account');
      navigate(target, { replace: true });
    }
  };

  const logout = () => {
    localStorage.removeItem('shlloka_member_token');
    localStorage.removeItem('shlloka_member_user');
    setMember(null);
    navigate('/login');
  };

  return (
    <ClerkAuthContext.Provider
      value={{
        isClerkEnabled: false,
        isLoaded: true,
        isSignedIn: !!member,
        user: member,
        clerkUser: null,
        syncing: false,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </ClerkAuthContext.Provider>
  );
}

export function ClerkAuthProvider({ children }) {
  const navigate = useNavigate();

  if (isClerkKeyValid) {
    return (
      <ClerkProvider
        publishableKey={rawPublishableKey}
        navigate={(to) => navigate(to)}
      >
        <ClerkSyncInner>{children}</ClerkSyncInner>
      </ClerkProvider>
    );
  }

  return <FallbackAuthProvider>{children}</FallbackAuthProvider>;
}

export function useClerkAuth() {
  const context = useContext(ClerkAuthContext);
  if (!context) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider');
  }
  return context;
}
