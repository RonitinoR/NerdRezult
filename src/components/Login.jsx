import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (error) {
      setError(decodeURIComponent(error));
    } else if (token && provider) {
      localStorage.setItem('token', token);
      localStorage.setItem('authMethod', provider);
      navigate('/homescreen');
    }
  }, [searchParams, navigate]);

  const handleBackClick = () => {
    navigate("/login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error("Please enter both email and password.");
      }

      await login('email', { 
        username: email,
        password: password 
      });
      
      navigate("/HomeScreen");
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login('google');
      // Navigation will happen in useEffect after OAuth callback
    } catch (err) {
      setError('Google authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login('github');
      // Navigation will happen in useEffect after OAuth callback
    } catch (err) {
      setError('GitHub authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="email-page-wrapper">
      <div className="email-container">
        <header className="email-header">
          <button
            className="back-btn"
            aria-label="Go back"
            onClick={handleBackClick}
          >
            &#8592;
          </button>
          <h1 className="email-title">Enter Email</h1>
        </header>
        <main className="email-content">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper email-input">
              <label htmlFor="email" className="visually-hidden">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email Address"
                className="input-field"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              <div className="input-label">Email</div>
            </div>

            <div className="input-wrapper password-input">
              <label htmlFor="password" className="visually-hidden">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter Password"
                className="input-field"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <div className="input-label">Password</div>
              <button
                type="button"
                className="show-password-btn"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" className="email-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Continue"}
            </button>
          </form>
          <p className="terms-text">
            By continuing, you agree to our{" "}
            <Link to="/terms-of-service" className="terms-link">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="terms-link">
              Privacy Policy
            </Link>
          </p>
          <Link to="/Phone-login">
            <button className="Phone-login-button" disabled={isLoading}>
              Use Phone instead
            </button>
          </Link>
          <Link to="/SignUp">
            <button className="signup-button" disabled={isLoading}>
              Sign up for an account
            </button>
          </Link>
          <button className="oauth-button" onClick={handleGoogleLogin} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login with Google"}
          </button>
          <button className="oauth-button" onClick={handleGithubLogin} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login with GitHub"}
          </button>
        </main>
      </div>
    </div>
  );
};

export default Login;









