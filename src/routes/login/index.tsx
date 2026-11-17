import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth.context';
import type { FormEvent } from 'react';

const Login = () => {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!errorMessage) return;

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({ username, password });
      void navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Login failed, try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh w-screen items-center justify-center bg-muted/30 p-4">
      {errorMessage && (
        <div className="fixed top-4 z-50 mx-auto max-w-sm animate-in fade-in slide-in-from-top-2 duration-200 sm:left-auto sm:mx-0 sm:w-88">
          <Alert
            variant="destructive"
            className="flex items-center justify-between gap-3 bg-background py-2.5 shadow-lg"
          >
            <AlertDescription className="text-xs font-medium">
              {errorMessage}
            </AlertDescription>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              aria-label="Dismiss error"
              className="shrink-0 rounded-sm px-1.5 py-0.5 text-sm leading-none opacity-70 transition-opacity hover:opacity-100"
            >
              &times;
            </button>
          </Alert>
        </div>
      )}

      <Card className="w-full max-w-sm shadow-xs">
        <CardHeader className="space-y-1">
          <div className="mb-1 flex items-center gap-2.5">
            <CardTitle className="text-base">GPS Tracker</CardTitle>
          </div>
          <CardDescription className="text-xs">Login here.</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                required
                disabled={isSubmitting}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isSubmitting}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
