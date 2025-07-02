// src/pages/VerifyEmail.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getAuth, sendEmailVerification, applyActionCode } from 'firebase/auth';
import { getDatabase, ref, update } from 'firebase/database';

export default function VerifyEmail() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    // Redirect if email is already verified
    if (user?.emailVerified) {
      navigate('/dashboard');
    }
    
    // Handle email verification from link
    const urlParams = new URLSearchParams(window.location.search);
    const actionCode = urlParams.get('oobCode');
    const mode = urlParams.get('mode');
    
    if (actionCode && mode === 'verifyEmail') {
      verifyEmail(actionCode);
    }
  }, [user, navigate]);

  const verifyEmail = async (actionCode: string) => {
    try {
      setIsLoading(true);
      
      // Apply the email verification code
      await applyActionCode(auth, actionCode);
      
      // Update verification status in Realtime Database
      if (user) {
        const db = getDatabase();
        await update(ref(db, `users/${user.uid}`), {
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString()
        });
      }
      
      toast({
        title: "Email verified successfully!",
        description: "Your email has been confirmed",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Email verification failed", error);
      toast({
        title: "Verification failed",
        description: "The verification link is invalid or has expired",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      
      if (!auth.currentUser) {
        throw new Error("No authenticated user");
      }
      
      await sendEmailVerification(auth.currentUser);
      
      toast({
        title: "Confirmation email resent!",
        description: "Please check your email again",
      });
    } catch (error) {
      console.error("Error resending verification email", error);
      toast({
        title: "Failed to resend email",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-700">
        <div className="text-center">
          <div className="mx-auto mb-4">
            <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLoading ? "Processing..." : "Verify Your Email"}
          </h1>
          
          {user ? (
            <>
              <p className="text-slate-400 mb-6">
                We've sent a confirmation link to<br />
                <span className="font-medium text-blue-400">{user.email}</span>
              </p>
              
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <p className="text-slate-300 text-sm">
                  Can't find the email? Check your spam folder or 
                  <button 
                    onClick={handleResend}
                    className="text-blue-400 ml-1 font-medium disabled:opacity-50"
                    disabled={isLoading}
                  >
                    resend confirmation
                  </button>
                </p>
              </div>
            </>
          ) : (
            <p className="text-slate-400 mb-6">
              Please sign in to verify your email address
            </p>
          )}
          
          <Link 
            to="/login" 
            className="inline-block text-blue-400 hover:text-blue-300 font-medium"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}