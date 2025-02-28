import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Login.css';

const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission
    navigate('/HomeScreen'); // Navigate to HomeScreen
  };

  return (
    <div className="login-wrapper"> {/* Central wrapper div */}
      <div className="login-container"> {/* Content container */}
        <header className="login-header">
          <h1 className="login-title">Welcome back.</h1>
          <p className="login-subtitle">Log in to your account</p>
        </header>

        <form className="phone-input-container" onSubmit={handleLogin}>
          <div className="phone-input-field">
            <div className="country-selector">
              <div className="country-flag" aria-hidden="true"></div>
              <span className="country-code">+1</span>
              <svg
                width="14"
                height="10"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <label htmlFor="phone-input" className="visually-hidden">
              Mobile number
            </label>
            <input
              type="tel"
              id="phone-input"
              placeholder="Mobile number"
              className="phone-input"
              required
              aria-required="true"
            />
          </div>

          <p className="login-disclaimer">
            You will receive an SMS verification that may apply message and data
            rates.
          </p>

          <button type="submit" className="login-button">
            Log in
          </button>
        </form>

        <Link to="/email-login">
          <button className="email-login-button">Use email instead</button>
        </Link>

        <Link to="/SignUp">
          <button className="signup-button">Sign up for an account</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;