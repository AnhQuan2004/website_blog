import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role?: "ADMIN" | "DEFAULT" | "MANAGER";
  avatar?: string;
  bio?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signupWithGoogle: () => Promise<void>;
  signupWithGithub: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API base URL for authentication
const API_URL = "/api";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved token in localStorage
    const token = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("user_data");
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log(`Attempting to login with email: ${email}`);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      // Check for non-JSON responses (like HTML error pages)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Non-JSON response received:", await response.text().catch(() => "Could not get response text"));
        throw new Error("Server returned an invalid response. Please try again later.");
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Login failed:", data);
        throw new Error(data.message || data.error || "Login failed");
      }
      
      if (!data.token) {
        console.error("No token in response:", data);
        throw new Error("Authentication token missing from response");
      }
      
      console.log("Login successful:", { userId: data.user?.id });
      
      // Save token and user data
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));
      
      setUser(data.user);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log("Signing up with:", { name, email, password });
      
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      // Check for non-JSON responses (like HTML error pages)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned an invalid response. Please try again later.");
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
      
      console.log("Signup successful:", data);
      
      // Save token and user data
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_data", JSON.stringify(data.user));
      
      setUser(data.user);
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error instanceof Error ? error.message : "Signup failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithGoogle = async () => {
    // For now, we'll keep the mock implementation for social login
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const randomId = Math.random().toString(36).substring(2, 15);
      const userData = {
        id: randomId,
        name: `Google User`,
        email: `user_${randomId}@google.com`,
        role: "DEFAULT" as const,
        avatar: `https://i.pravatar.cc/150?u=google_${randomId}`,
      };
      
      setUser(userData);
      localStorage.setItem("user_data", JSON.stringify(userData));
      toast.success("Signed up with Google successfully");
    } catch (error) {
      toast.error("Failed to sign up with Google");
      console.error("Google auth error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithGithub = async () => {
    // For now, we'll keep the mock implementation for social login
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const randomId = Math.random().toString(36).substring(2, 15);
      const userData = {
        id: randomId,
        name: `GitHub User`,
        email: `user_${randomId}@github.com`,
        role: "DEFAULT" as const,
        avatar: `https://i.pravatar.cc/150?u=github_${randomId}`,
      };
      
      setUser(userData);
      localStorage.setItem("user_data", JSON.stringify(userData));
      toast.success("Signed up with GitHub successfully");
    } catch (error) {
      toast.error("Failed to sign up with GitHub");
      console.error("GitHub auth error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    toast.success("Logged out successfully");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        signupWithGoogle,
        signupWithGithub,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
