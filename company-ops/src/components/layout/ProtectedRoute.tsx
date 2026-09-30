import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { canAccessRoute, defaultRouteForRole } from "@/lib/rbac";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const location = useLocation();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (!canAccessRoute(currentUser.role, location.pathname)) {
    return <Navigate to={defaultRouteForRole(currentUser.role)} replace />;
  }
  return <>{children}</>;
}
