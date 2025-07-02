import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        throw new Error(error.message);
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Form validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Clear form and switch to sign-in after successful registration
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
      });
      
      setActiveTab('signin');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleDemoAccess = () => {
    // Set demo credentials
    handleInputChange('email', 'demo@gmcapitalfx.com');
    handleInputChange('password', 'demopassword');
    setActiveTab('signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <img 
            src="/Main Logo PNG final.png" 
            alt="GM Capital FX" 
            className="h-24 w-24 mx-auto mb-3 sm:mb-4 object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            GM Capital FX
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">Professional Trading Platform</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-white text-center">
              Welcome to Trading
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-400 text-center">
                {error}
              </div>
            )}
            
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => {
                setActiveTab(value as 'signin' | 'signup');
                setError(null);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-slate-700 mb-4">
                <TabsTrigger 
                  value="signin" 
                  className="text-white data-[state=active]:bg-slate-600 text-sm"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="text-white data-[state=active]:bg-slate-600 text-sm"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email" className="text-slate-300 text-sm">
                      Email
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white text-sm h-10"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signin-password" className="text-slate-300 text-sm">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white text-sm h-10"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-blue-400 hover:text-blue-300 text-xs"
                      onClick={() => navigate('/forgot-password')}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium text-sm h-10"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Signing In...
                      </div>
                    ) : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="signup-firstname" className="text-slate-300 text-sm">
                        First Name
                      </Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="signup-firstname"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="pl-10 bg-slate-700 border-slate-600 text-white text-sm h-10"
                          placeholder="First name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="signup-lastname" className="text-slate-300 text-sm">
                        Last Name
                      </Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="signup-lastname"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="pl-10 bg-slate-700 border-slate-600 text-white text-sm h-10"
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-email" className="text-slate-300 text-sm">
                      Email
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 bg-slate-700 border-slate-600 text-white text-sm h-10"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-password" className="text-slate-300 text-sm">
                      Password
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white text-sm h-10"
                        placeholder="Create password (min 8 characters)"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.password && formData.password.length < 8 && (
                      <p className="text-red-400 text-xs mt-1">
                        Password must be at least 8 characters
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="signup-confirm" className="text-slate-300 text-sm">
                      Confirm Password
                    </Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10 pr-10 bg-slate-700 border-slate-600 text-white text-sm h-10"
                        placeholder="Confirm password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium text-sm h-10"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </div>
                    ) : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Access Button */}
        <div className="mt-4 text-center">
          <Button 
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            onClick={handleDemoAccess}
          >
            Continue as Demo User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;