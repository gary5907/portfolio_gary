import type { ReactElement } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../auth/authContext";

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
