import { useState, useEffect } from 'react';
import { mockUsers } from './mock-data';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
  phone?: string;
  location?: string;
  joinDate?: string;
  status?: string;
  projects?: string[];
  skills?: string[];
  certifications?: string[];
  languages?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Simple in-memory auth store (in production, use proper session management)
let currentUser: User | null = null;

export const auth = {
  // Login function
  async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (mock authentication)
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In production, verify password hash
    // For demo, we'll accept any password for existing users
    if (password.length < 1) {
      throw new Error('Invalid password');
    }
    
    currentUser = user;
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('ganttflow_user', JSON.stringify(user));
    }
    
    return user;
  },
  
  // Register function
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    department?: string;
  }): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Create new user (in production, save to database)
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'team-member',
      department: userData.department || 'General',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      projects: [],
      skills: [],
      certifications: [],
      languages: ['English']
    };
    
    currentUser = newUser;
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('ganttflow_user', JSON.stringify(newUser));
    }
    
    return newUser;
  },
  
  // Logout function
  logout(): void {
    currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ganttflow_user');
    }
  },
  
  // Get current user
  getCurrentUser(): User | null {
    if (currentUser) {
      return currentUser;
    }
    
    // Check localStorage on client side
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ganttflow_user');
      if (stored) {
        try {
          currentUser = JSON.parse(stored);
          return currentUser;
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('ganttflow_user');
        }
      }
    }
    
    return null;
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },
  
  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<User> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update user data
    const updatedUser = { ...user, ...updates };
    currentUser = updatedUser;
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('ganttflow_user', JSON.stringify(updatedUser));
    }
    
    return updatedUser;
  },
  
  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, verify current password and update hash
    // For demo, we'll just accept the change
    console.log('Password changed for user:', user.email);
  }
};

// React hook for authentication
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing user on mount
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await auth.login(email, password);
      setUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    department?: string;
  }) => {
    setIsLoading(true);
    try {
      const user = await auth.register(userData);
      setUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    auth.logout();
    setUser(null);
  };
  
  const updateProfile = async (updates: Partial<User>) => {
    setIsLoading(true);
    try {
      const user = await auth.updateProfile(updates);
      setUser(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };
}
