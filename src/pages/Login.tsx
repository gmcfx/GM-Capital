import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = location.state?.from?.pathname || '/dashboard';
  const { signIn, resetPassword } = useAuth();

  const validateForm = () => {
    setError(null);
    
    if (!email) {
      setError('Please enter your email address');
      return false;
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      setError('Please enter your password');
      return false;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
        duration: 2000,
      });
      
      navigate(from, { replace: true });
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please confirm your email address first';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        throw error;
      }

      toast({
        title: "Password reset sent!",
        description: "Check your email for a password reset link",
        duration: 3000,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send password reset email';
      setError(errorMessage);
      toast({
        title: "Password Reset Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@gmcapitalfx.com');
    setPassword('demopassword');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4">
            <img 
              src="/Main Logo PNG final.png" 
              alt="GM Capital Logo"
              className="w-28 h-28 mx-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-slate-400 mt-2">Sign in to your trading account</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center">
              Account Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-400 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2 text-sm font-medium">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white h-10"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
              
              <div className="relative">
                <label className="block text-slate-300 mb-2 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-700 border-slate-600 text-white h-10 pr-10"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-slate-400">
                    Remember me
                  </label>
                </div>
                
                <button 
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium h-10"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button 
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 w-full"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Use Demo Account
          </Button>
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} GM Capital. All rights reserved.
        </div>
      </div>
    </div>
  );
}