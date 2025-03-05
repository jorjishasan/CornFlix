import React, { useRef, useState } from "react";
import { BG_URL } from "../utils/constants";
import { checkValidData } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import { setShowWelcomeModal, setCredits, setLoading } from "../redux/creditSlice";
import { initializeUserCredits } from "../services/creditService";

// Array of cool avatar URLs
const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna&backgroundColor=d1ffd7",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=ffdfbf",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=e2d1ff",
];

// Get random avatar URL
const getRandomAvatar = () => {
  return AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
};

// Demo credentials
const DEMO_CREDENTIALS = {
  email: "jorjis@cornflix.app",
  password: "12345678Yy",
};

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const signInButtonRef = useRef(null);

  const handleGuestLogin = () => {
    // If on signup page, switch to signin first
    if (!isSignInForm) {
      setIsSignInForm(true);
    }

    // Fill demo credentials
    if (emailRef.current && passwordRef.current) {
      emailRef.current.value = DEMO_CREDENTIALS.email;
      passwordRef.current.value = DEMO_CREDENTIALS.password;
    }

    // Click the signin button using ref
    setTimeout(() => {
      signInButtonRef.current?.click();
    }, 100);
  };

  const handleButtonClick = async () => {
    setIsLoading(true);
    try {
      // Get values safely with null checks
      const emailValue = emailRef.current?.value;
      const passwordValue = passwordRef.current?.value;
      const nameValue = nameRef.current?.value;

      if (!emailValue || !passwordValue) {
        setErrorMessage("Please fill in all required fields");
        return;
      }

      // Validate inputs
      const message = checkValidData(emailValue, passwordValue);
      if (message) {
        setErrorMessage(message);
        return;
      }

      // Additional validation for signup
      if (!isSignInForm && (!nameValue || nameValue.trim() === "")) {
        setErrorMessage("Please enter your name");
        return;
      }

      dispatch(setLoading(true));
      setErrorMessage(null);

      if (isSignInForm) {
        // Sign In Flow
        const userCredential = await signInWithEmailAndPassword(
          auth,
          emailValue,
          passwordValue
        );
        
        const user = userCredential.user;
        
        // Update Redux store with user info
        dispatch(
          addUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );

        // Get and set credits
        const credits = await initializeUserCredits(user.uid);
        dispatch(setCredits(credits));
      } else {
        // Sign Up Flow
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          emailValue,
          passwordValue
        );
        
        const user = userCredential.user;
        const displayName = nameValue.trim();
        const photoURL = getRandomAvatar();
        
        // Update profile first
        await updateProfile(user, {
          displayName,
          photoURL,
        });

        // Initialize credits
        const credits = await initializeUserCredits(user.uid);
        
        // Update Redux store
        dispatch(
          addUser({
            uid: user.uid,
            email: user.email,
            displayName,
            photoURL,
          })
        );
        
        // Set credits in Redux
        dispatch(setCredits(credits));
        
        // Show welcome modal - remove setTimeout
        dispatch(setShowWelcomeModal(true));
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrorMessage(
        error.code === "auth/email-already-in-use"
          ? "Email already registered. Please sign in."
          : error.message
      );
    } finally {
      dispatch(setLoading(false));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Netflix-style background */}
      <div className="absolute inset-0">
        {/* Base background color */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Background image with Netflix-style blend */}
        <img 
          className="absolute inset-0 h-full w-full object-cover opacity-60" 
          alt="background" 
          src={BG_URL} 
        />

        {/* Netflix signature gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        
        {/* Additional ambient lighting */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="backdrop-blur-sm bg-black/75 rounded-2xl p-8 shadow-2xl border border-white/[0.05]">
          <h1 className="text-3xl font-bold text-white mb-8">
            {isSignInForm ? "Welcome Back" : "Create Account"}
          </h1>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {!isSignInForm && (
              <input
                ref={nameRef}
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-white/5 rounded-lg text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              />
            )}

            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 bg-white/5 rounded-lg text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
            />

            <input
              ref={passwordRef}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/5 rounded-lg text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
            />

            {errorMessage && (
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-sm text-red-400">{errorMessage}</p>
              </div>
            )}

            {isSignInForm ? (
              <button
                ref={signInButtonRef}
                onClick={handleButtonClick}
                disabled={isLoading}
                className="w-full py-3 bg-red-600 rounded-lg text-white font-medium transition-all hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            ) : (
              <button
                onClick={handleButtonClick}
                disabled={isLoading}
                className="w-full py-3 bg-red-600 rounded-lg text-white font-medium transition-all hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-red-600"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            )}

            <div className="flex flex-col gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsSignInForm(!isSignInForm);
                  setErrorMessage(null);
                }}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {isSignInForm ? "New to Cornflix? Sign Up Now" : "Already have an account? Sign In"}
              </button>

              {/* Updated Guest Button with new avatar icon */}
              <button
                type="button"
                onClick={handleGuestLogin}
                className="relative group px-4 py-3 bg-white/5 rounded-lg border border-white/10 text-white transition-all hover:bg-white/10"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 6a2 2 0 100 4 2 2 0 000-4z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 15c0-1.1-1.79-2-4-2s-4 .9-4 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Continue as Guest
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
