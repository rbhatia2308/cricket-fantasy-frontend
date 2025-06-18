import React from 'react';
import { signInWithGoogle } from '../services/firebase';

export default function Login() {
  return (
    <div className="p-4">
      <h1>Login</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}
