import React, { useRef, useState } from "react";
import { BG_URL, USER_AVATAR } from "../utils/constants";
import { checkValidData } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const name = useRef();
  const email = useRef(null);
  const password = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const handleButtonClick = () => {
    const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);

    if (message) return;

    // SignIn & SignUp Logic
    if (isSignInForm) {
      //SignIn Logic
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value,
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    } else {
      //SignUp Logic
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value,
      )
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
            photoURL: USER_AVATAR,
          })
            .then(() => {
              // Profile updated!
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL,
                }),
              );
            })
            .catch((error) => {
              // An error occurred
              // ...
            });
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          setErrorMessage(errorCode, "+", errorMessage);
          // ..
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
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
              ref={name}
              type="text"
              placeholder="Full Name"
              className="mb-4 w-full rounded bg-gray-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          )}
          <input
            type="text"
            ref={email}
            placeholder="Email Address"
            className="mb-4 w-full rounded bg-gray-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="password"
            ref={password}
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
