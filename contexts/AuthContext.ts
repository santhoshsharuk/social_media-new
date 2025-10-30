import { createContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<User>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<User>;
  follow: (adminId: string) => void;
  unfollow: (adminId: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
