import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

const provider = new GoogleAuthProvider();

function Login() {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Welcome ${user.displayName}`);
      // You can redirect to home or dashboard here
    } catch (error) {
      console.error("Google sign-in error:", error.message);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
}

export default Login;

