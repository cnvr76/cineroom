import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import type React from "react";

const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { isAuthenticated, isAdmin } = useAuthContext();
  if (!isAuthenticated) return <Navigate to="/" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/profile/me" />;
  return children;
};

export default ProtectedRoute;
