import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import "./Phone.css";

const PhoneLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!phoneNumber.trim()) {
        throw new Error("Please enter a valid phone number");
      }

      await login('phone', { 
        phone_number: phoneNumber 
      });
      
      navigate('/HomeScreen');
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <header className="login-header">
          <h1 className="login-title">Welcome back.</h1>
          <p className="login-subtitle">Log in to your account</p>
        </header>

        {error && <div className="error-message">{error}</div>}

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
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              required
              aria-required="true"
            />
          </div>

          <p className="login-disclaimer">
            You will receive an SMS verification that may apply message and data
            rates.
          </p>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Sending code..." : "Log in"}
          </button>
        </form>

        <Link to="/login">
          <button className="email-login-button" disabled={isLoading}>
            Use Email instead
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PhoneLoginPage;
