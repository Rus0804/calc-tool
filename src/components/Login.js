import React, { useState } from 'react';
import { supabase } from '../data/db';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // const [user, setUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    setErrorMsg('');
    const res = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error.message);
    }
  }

  async function signUpWithEmail() {
    setLoading(true);
    setErrorMsg('');
    const res = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (res.error) {
      setErrorMsg(res.error.message);
    } else {
      // Optionally inform users to confirm their email
      alert('Sign up successful! Please check your email to confirm your account.');
    }
  }

  return (
    <div className="login-container" style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
        <>
          <h2>{isSigningUp ? 'Sign Up for an Account' : 'Login to Your Account'}</h2>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {isSigningUp ? (
            <button onClick={signUpWithEmail} disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          ) : (
            <button onClick={signInWithEmail} disabled={loading}>
              {loading ? 'Loading...' : 'Login'}
            </button>
          )}
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
          <p>
            {isSigningUp ? (
              <>
                Already have an account?{' '}
                <button onClick={() => setIsSigningUp(false)} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Login here
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button onClick={() => setIsSigningUp(true)} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Sign up here
                </button>
              </>
            )}
          </p>
        </>
    </div>
  );
}
