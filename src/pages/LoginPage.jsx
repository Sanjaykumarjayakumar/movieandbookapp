import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Auth.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/movies");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Ensure user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName || "Google User",
          email: user.email,
          createdAt: new Date(),
        });
      }

      navigate("/movies");
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        setError("You closed the login popup before completing login.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to continue your cinematic journey.</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleEmailLogin} className="auth-form">
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="social-login">
          <p>Or login with</p>
          <button
            onClick={handleGoogleLogin}
            className="auth-btn google-btn"
            disabled={loading}
          >
            {loading ? "Please wait..." : "Continue with Google"}
          </button>
        </div>

        <div className="form-footer">
          <p>
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
