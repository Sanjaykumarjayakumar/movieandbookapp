import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Auth.css";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Email/password signup
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional info to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: new Date(),
      });

      navigate("/movies");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google signup/login
  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // Create new user in Firestore
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName || "Google User",
          email: user.email,
          createdAt: new Date(),
        });
      }

      navigate("/movies");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join our community of movie lovers.</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleEmailSignup} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder=" "
            />
            <label>Username</label>
          </div>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label>Password</label>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="social-login">
          <p>Or sign up with</p>
          <button
            onClick={handleGoogleSignup}
            className="auth-btn google-btn"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Continue with Google"}
          </button>
        </div>

        <div className="form-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
