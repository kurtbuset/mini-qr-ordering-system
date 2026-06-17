import { Navigate } from "react-router";
import {
  useAuthStore,
  selectIsAuthenticated,
  selectIsLoading,
} from "../../store/authStore";
import { Role } from "../../types/role";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
}) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore(selectIsLoading);
  const hasRole = useAuthStore((state) => state.hasRole);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full border-t-brand-500 animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
