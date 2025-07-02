import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRealtimeDB } from '@/lib/firebase';
import { ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Added import

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  const validateForm = () => {
    if (!firstName || !lastName) {
      setError('First and last name are required');
      return false;
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!phoneNumber.match(/^\d{8,15}$/)) {
      setError('Please enter a valid phone number (8-15 digits)');
      return false;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const saveUserToDatabase = async (userId: string) => {
    const db = getRealtimeDB();
    const userRef = ref(db, `users/${userId}`);
    
    await set(userRef, {
      firstName,
      lastName,
      email,
      phone: `${phoneCountryCode}${phoneNumber}`,
      createdAt: new Date().toISOString(),
      emailVerified: false,
      roles: ['user'],
      status: 'active',
      lastLogin: null,
      preferences: {},
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        email,
        password,
        firstName,
        lastName,
        phone: `${phoneCountryCode}${phoneNumber}`
      };
      
      // Create user in Firebase Authentication
      const { error: authError } = await signUp(userData);
      
      if (authError) {
        throw new Error(authError.message);
      }

      // Get the current user from Firebase auth
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User creation failed');
      }
      
      // Save user data to Realtime Database
      await saveUserToDatabase(user.uid);

      // Show success toast (using 'default' variant)
      toast({
        title: 'Account Created',
        description: 'Your account has been successfully created!',
        variant: 'default' // Changed from 'success'
      });

      navigate('/verify-email');
    } catch (error: any) {
      let errorMessage = error.message || 'Signup failed. Please try again.';
      
      if (error.message.includes('User already registered')) {
        errorMessage = 'This email is already registered. Try signing in.';
      } else if (error.message.includes('password should be at least')) {
        errorMessage = 'Password must be at least 8 characters';
      }
      
      setError(errorMessage);
      
      // Show error toast
      toast({
        title: 'Signup Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
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
            Create an Account
          </h1>
          <p className="text-slate-400 mt-2">Invest with trust, Trade with confidence</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-slate-300 mb-2 text-sm font-medium">
                  First Name
                </label>
                <Input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-2 text-sm font-medium">
                  Last Name
                </label>
                <Input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-slate-300 mb-2 text-sm font-medium">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-slate-300 mb-2 text-sm font-medium">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="w-1/4">
                  <select
                    value={phoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                    className="w-full h-10 px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="+1">+1 (US)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (AU)</option>
                    <option value="+49">+49 (DE)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+81">+81 (JP)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+86">+86 (CN)</option>
                  </select>
                </div>
                <div className="w-3/4">
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    required
                    className="bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="1234567890"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-4 relative">
              <label className="block text-slate-300 mb-2 text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="mb-6 relative">
              <label className="block text-slate-300 mb-2 text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Password must be at least 8 characters
              </p>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-slate-400">
                  I agree to the <Link to="/terms" className="text-blue-400 hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
                </label>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium py-2 rounded-lg transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} GM Capital. All rights reserved.
        </div>
      </div>
    </div>
  );
}