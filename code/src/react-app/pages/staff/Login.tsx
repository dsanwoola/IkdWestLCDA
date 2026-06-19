import { type FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/react-app/lib/auth';
import { Shield, ArrowLeft, Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Input } from '@/react-app/components/ui/input';

export default function StaffLoginPage() {
  const navigate = useNavigate();
  const { user, isPending, redirectToLogin, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (user && !isPending) {
      navigate('/staff');
    }
  }, [user, isPending, navigate]);

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signInWithEmail(email, password);
    } catch {
      setError('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleSubmitting(true);

    try {
      await redirectToLogin();
    } catch (signInError) {
      const errorCode = signInError && typeof signInError === 'object' && 'code' in signInError
        ? String(signInError.code)
        : '';

      if (errorCode.includes('unauthorized-domain')) {
        setError('This domain is not authorized for Google sign-in yet. Please try again shortly.');
      } else if (errorCode.includes('popup-closed-by-user')) {
        setError('Google sign-in was cancelled. Please try again.');
      } else if (errorCode.includes('popup-blocked')) {
        setError('Your browser blocked the Google sign-in popup. Please allow popups for this site and try again.');
      } else {
        setError('Google sign-in could not be completed. Please try again.');
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-green-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-green-800 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Website
          </Link>
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur">
            <CardContent className="p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Staff Portal
                </h1>
                <p className="text-muted-foreground mt-2">
                  Ikorodu West LCDA Digital Governance Platform
                </p>
              </div>

              {/* Login section */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-lg font-semibold mb-2">Sign in to continue</h2>
                  <p className="text-sm text-muted-foreground">
                    Use your staff email or official Google account to access the portal
                  </p>
                </div>

                <form onSubmit={handleEmailSignIn} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-12 pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-12 pl-10"
                      required
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}
                  <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Sign in with email'
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button 
                  onClick={handleGoogleSignIn}
                  className="w-full h-12 gap-3 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm"
                  disabled={isGoogleSubmitting}
                >
                  {isGoogleSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <div className="pt-4 border-t">
                  <p className="text-xs text-center text-muted-foreground">
                    By signing in, you agree to the LCDA's terms of service and privacy policy. 
                    Access is monitored for security purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-white/60 text-sm">
            © 2024 Ikorodu West LCDA. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
