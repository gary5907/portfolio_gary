import { useAuth } from "../auth/authContext";
import { Navigate } from "react-router";
import type { ReactElement } from "react";

type ProtectedRouteProps = {
  children: ReactElement;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected } = useAuth();

  if (!isConnected) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
