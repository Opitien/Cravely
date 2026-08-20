import React, { createContext, useState, useContext } from 'react';

// The shape of a logged-in user
export interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;          // null means "not logged in"
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // user is null when not logged in, and a User object when logged in
  const [user, setUser] = useState<User | null>(null);

  /**
   * Simulated login — in a real app this would call your backend API.
   * For now: any non-empty email + password "works".
   */
  const login = async (email: string, password: string): Promise<void> => {
    // Simulate a network delay (like a real API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email || !password) {
      throw new Error('Please fill in all fields.');
    }

    // Create a fake user from the email
    const name = email.split('@')[0]; // e.g. "opitien" from "opitien@gmail.com"
    setUser({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
      email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=FF5A5F&color=fff&size=200`,
    });
  };

  /**
   * Simulated sign up — saves the name the user provides.
   */
  const signUp = async (name: string, email: string, password: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!name || !email || !password) {
      throw new Error('Please fill in all fields.');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    setUser({
      name,
      email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=FF5A5F&color=fff&size=200`,
    });
  };

  /**
   * Logout clears the user from state, sending them back to the login screen.
   */
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so any component can easily access auth state
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
