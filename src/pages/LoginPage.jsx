import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Auth.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/movies"); // redirect if logged in
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!login(email, password)) {
      setError("Invalid email or password");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to continue your cinematic journey.</p>
        </div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin} className="auth-form">
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
