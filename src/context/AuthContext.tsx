import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "author" | "user";
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

// Mock users for initial development
const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password",
    role: "admin" as const,
    avatar: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password",
    role: "author" as const,
    avatar: "https://i.pravatar.cc/150?u=jane",
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
    avatar: "https://i.pravatar.cc/150?u=admin",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved session in localStorage
    const savedUser = localStorage.getItem("tech_blog_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("tech_blog_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock login logic
    const matchedUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (matchedUser) {
      const { password, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      localStorage.setItem(
        "tech_blog_user",
        JSON.stringify(userWithoutPassword)
      );
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid email or password");
      throw new Error("Invalid email or password");
    }

    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if user already exists
    if (MOCK_USERS.some((u) => u.email === email)) {
      toast.error("User with this email already exists");
      setIsLoading(false);
      throw new Error("User with this email already exists");
    }

    // Create new user
    const newUser = {
      id: String(MOCK_USERS.length + 1),
      name,
      email,
      role: "user" as const,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`,
    };

    // In a real app, we would send this to an API
    // For now, just simulate success
    setUser(newUser);
    localStorage.setItem("tech_blog_user", JSON.stringify(newUser));
    toast.success("Account created successfully");
    setIsLoading(false);
  };

  // Helper function to handle the popup window and listen for messages
  const handleOAuthPopup = (url: string, provider: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      const popupWidth = 600;
      const popupHeight = 700;
      const left = window.innerWidth / 2 - popupWidth / 2;
      const top = window.innerHeight / 2 - popupHeight / 2;

      // Open the popup
      const popup = window.open(
        url,
        `${provider}AuthPopup`,
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`
      );

      // If popup is blocked or closed immediately
      if (!popup) {
        reject(new Error(`${provider} popup was blocked or closed`));
        return;
      }

      // Poll to check if the popup window was closed manually
      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer);
          reject(
            new Error(`Authentication cancelled: ${provider} popup closed`)
          );
        }
      }, 500);

      // For the mock implementation, simulate a successful authentication after 2 seconds
      setTimeout(() => {
        clearInterval(pollTimer);

        // Generate random user data
        const randomId = Math.random().toString(36).substring(2, 15);
        const userData = {
          id: randomId,
          name: `${provider} User`,
          email: `user_${randomId}@${provider.toLowerCase()}.com`,
          role: "user" as const,
          avatar: `https://i.pravatar.cc/150?u=${provider.toLowerCase()}_${randomId}`,
        };

        resolve(userData);

        // Close the popup
        if (!popup.closed) {
          popup.close();
        }
      }, 2000);

      // In a real implementation, we would use window.addEventListener('message', ...)
      // to receive OAuth tokens from the popup
    });
  };

  const signupWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Construct Google OAuth URL
      const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
      const redirectUri = encodeURIComponent(window.location.origin);
      const clientId = "your-google-client-id";
      const scope = encodeURIComponent("profile email");
      const responseType = "token";

      const googleLoginUrl =
        `${googleAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}` +
        `&scope=${scope}&response_type=${responseType}`;

      // Handle the popup and wait for authentication
      const userData = await handleOAuthPopup(googleLoginUrl, "Google");

      // Save the user data
      setUser(userData);
      localStorage.setItem("tech_blog_user", JSON.stringify(userData));
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
    setIsLoading(true);
    try {
      // Construct GitHub OAuth URL
      const githubAuthUrl = "https://github.com/login/oauth/authorize";
      const redirectUri = encodeURIComponent(window.location.origin);
      const clientId = "your-github-client-id";
      const scope = encodeURIComponent("user:email");

      const githubLoginUrl =
        `${githubAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}` +
        `&scope=${scope}`;

      // Handle the popup and wait for authentication
      const userData = await handleOAuthPopup(githubLoginUrl, "GitHub");

      // Save the user data
      setUser(userData);
      localStorage.setItem("tech_blog_user", JSON.stringify(userData));
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
    localStorage.removeItem("tech_blog_user");
    toast.success("Logged out successfully");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("tech_blog_user", JSON.stringify(userData));
    toast.success("User updated successfully");
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
