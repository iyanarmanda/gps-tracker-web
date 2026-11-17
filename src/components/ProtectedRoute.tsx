import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/auth.context';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-dvh w-screen items-center justify-center bg-muted/30 text-xs text-muted-foreground">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
