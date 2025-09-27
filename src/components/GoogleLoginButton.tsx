import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { Button } from '@/components/ui/button';

const GoogleLoginButton = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // User is already logged in, redirect to dashboard
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      
      // Optional: Add custom parameters
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      // The signed-in user info
      const user = result.user;
      
      // Only log non-sensitive info in development
      if (process.env.NODE_ENV === 'development') {
        console.log('User signed in successfully:', {
          uid: user?.uid,
          email: user?.email,
          displayName: user?.displayName
        });
      }
      
      // Redirect to dashboard on successful login
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error during sign in:', error);
      
      // Handle specific error codes
      switch (error.code) {
        case 'auth/unauthorized-domain':
          alert(`🚨 Domain Authorization Error\n\nThe domain "${window.location.origin}" is not authorized for Firebase Authentication.\n\nTo fix this:\n1. Go to Firebase Console → Authentication → Settings → Authorized domains\n2. Add "${window.location.hostname}" to the list\n3. Try signing in again`);
          break;
        case 'auth/popup-closed-by-user':
          // User cancelled login - no action needed
          break;
        case 'auth/popup-blocked':
          alert('Popup was blocked by browser. Please allow popups and try again.');
          break;
        case 'auth/cancelled-popup-request':
          // Popup request cancelled - no action needed
          break;
        case 'auth/operation-not-allowed':
          alert('Google sign-in is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.');
          break;
        case 'auth/invalid-api-key':
          alert('Invalid Firebase API key. Please check your .env.local file.');
          break;
        default:
          alert(`An error occurred during sign in: ${error.message}\n\nPlease check the console for more details.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render the button if user is already logged in
  if (user) {
    return (
      <div className="w-full bg-green-50 border border-green-200 rounded-lg py-4 px-6 text-center">
        <p className="text-green-800">You are already signed in. Redirecting...</p>
      </div>
    );
  }

  return (
    <Button 
      className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleGoogleLogin}
      disabled={loading}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
          <span className="font-medium">Signing in...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="font-medium">Sign up with Google</span>
        </>
      )}
    </Button>
  );
};

export default GoogleLoginButton;