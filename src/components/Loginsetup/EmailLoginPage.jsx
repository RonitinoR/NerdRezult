import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Email.css";

const EmailLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle Back button click to navigate to the login page
  const handleBackClick = () => {
    navigate("/login"); // This will navigate back to the login page
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState); // Toggle password visibility state
  };

  return (
    <div className="email-container">
      <header className="email-header">
        {/* Back button to navigate to the login page */}
        <button className="back-btn" aria-label="Go back" onClick={handleBackClick}>
          <i className="ti ti-chevron-left back-icon"></i>
        </button>
        <h1 className="email-title">Enter Email</h1>
      </header>
      <main className="email-content">
        <form>
          <div className="input-wrapper email-input">
            <label htmlFor="email" className="visually-hidden">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              className="input-field"
              aria-label="Email"
            />
            <div className="input-label">Email</div>
          </div>

          <div className="input-wrapper password-input">
            <label htmlFor="password" className="visually-hidden">Password</label>
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between password and text
              id="password"
              placeholder="Enter Password"
              className="input-field"
              aria-label="Password"
            />
            <div className="input-label">Password</div>
            <button
              type="button"
              className="show-password-btn"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button type="submit" className="email-btn">Continue</button>
        </form>
        <p className="terms-text">
          By continuing, you agree to our
          <a href="#" className="terms-link">Terms of Service</a> and
          <a href="#" className="terms-link">Privacy Policy</a>.
        </p>
      </main>
    </div>
  );
};

export default EmailLoginPage;