import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AuthRedirectProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireManager?: boolean;
}

/**
 * Higher-order component for handling authentication-based redirects
 * @param children - The component to render if conditions pass
 * @param requireAuth - If true, redirects non-authenticated users to login
 * @param requireAdmin - If true, redirects non-admin users away
 * @param requireManager - If true, allows both ADMIN and MANAGER roles
 */
const AuthRedirect: React.FC<AuthRedirectProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireManager = false,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If we're on login or signup page and already authenticated, redirect to dashboard
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/dashboard" replace />;
  }

  // If accessing manager dashboard, verify ADMIN or MANAGER role
  if (isAuthenticated && user && location.pathname === "/manager-dashboard") {
    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      return <Navigate to="/" replace />;
    }
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (isAuthenticated && user) {
    // Admin-only pages
    if (requireAdmin && user.role !== "ADMIN") {
      return <Navigate to="/" replace />;
    }

    // Manager pages (accessible by both managers and admins)
    if (requireManager && user.role !== "ADMIN" && user.role !== "MANAGER") {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthRedirect; 