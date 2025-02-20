import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Email.css";

const EmailLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
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
            &#8592; {/* Left arrow for back button */}
          </button>
          <h1 className="email-title">Enter Email</h1>
        </header>
        <main className="email-content">
          <form>
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

            <button type="submit" className="email-btn">
              Continue
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
  .
</p>
        </main>
      </div>
    </div>
  );
};

export default EmailLoginPage;
