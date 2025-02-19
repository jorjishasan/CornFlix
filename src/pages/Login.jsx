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
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy&backgroundColor=ffd1e8",
];

// Get random avatar URL
const getRandomAvatar = () => {
  return AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)];
};

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  
  // Initialize refs with null and use consistent naming
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleButtonClick = async () => {
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
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="absolute h-full w-full">
        <img className="h-full w-full object-cover" alt="logo" src={BG_URL} />
      </div>
      <div className="relative z-10 w-full max-w-md px-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-lg bg-black bg-opacity-80 p-8 shadow-lg"
        >
          <h1 className="mb-6 text-2xl font-bold text-white sm:text-3xl">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>
          {!isSignInForm && (
            <input
              ref={nameRef}
              type="text"
              placeholder="Full Name"
              className="mb-4 w-full rounded bg-gray-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          )}
          <input
            type="text"
            ref={emailRef}
            placeholder="Email Address"
            className="mb-4 w-full rounded bg-gray-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="password"
            ref={passwordRef}
            placeholder="Password"
            className="mb-4 w-full rounded bg-gray-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <p className="mb-4 text-sm font-bold text-red-500">{errorMessage}</p>
          <button
            className="mb-4 w-full rounded bg-red-600 p-3 font-bold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={handleButtonClick}
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>
          <p className="text-sm text-gray-300">
            {isSignInForm ? "New to Netflix? " : "Already registered? "}
            <span
              className="cursor-pointer font-bold text-white hover:underline"
              onClick={toggleSignInForm}
            >
              {isSignInForm ? "Sign Up Now" : "Sign In Now"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
