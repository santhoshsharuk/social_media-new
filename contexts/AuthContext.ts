import { createContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<User>;
  follow: (adminId: string) => void;
  unfollow: (adminId: string) => void;
  updateProfile: (updates: { name?: string; bio?: string; photoURL?: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
