import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { phoneAuthService } from '../../services/api';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.min.css';
import './PhoneLogin.css';

const PhoneLogin = () => {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [phoneInputInstance, setPhoneInputInstance] = useState(null);
  const phoneInputRef = useRef(null);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  useEffect(() => {
    // Initialize intl-tel-input
    if (phoneInputRef.current) {
      const iti = intlTelInput(phoneInputRef.current, {
        preferredCountries: ["us", "co", "in", "de"],
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
      });
      setPhoneInputInstance(iti);
    }
  }, []); // This effect runs once on mount

  // Separate cleanup effect
  useEffect(() => {
    return () => {
      if (phoneInputInstance) {
        phoneInputInstance.destroy();
      }
    };
  }, [phoneInputInstance]); // This effect handles cleanup when phoneInputInstance changes or component unmounts

  const handleStartVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!phoneInputInstance) {
        throw new Error('Phone input not initialized');
      }

      if (!phoneInputInstance.isValidNumber()) {
        throw new Error('Please enter a valid phone number');
      }

      const phoneNumber = phoneInputInstance.getNumber(); // Gets full number with country code
      await phoneAuthService.startVerification(phoneNumber);
      setShowVerification(true);
      setCountdown(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanPhone = phoneInputInstance.getNumber();
      console.log('Sending verification request:', {
        phone_number: cleanPhone,
        otp: verificationCode
      });
      
      const response = await phoneAuthService.verifyCode(cleanPhone, verificationCode);
      
      if (response.access_token) {
        // Show success message
        alert('Verification successful!');
        // Navigate to dashboard
        navigate('/HomeScreen');
      }
    } catch (err) {
      setError(err.message);
      console.error('Verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phone-login-container">
      <h2>Phone Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={showVerification ? handleVerifyCode : handleStartVerification}>
        <div className="input-group">
          <label>Phone Number</label>
          <input
            ref={phoneInputRef}
            type="tel"
            className="phone-input"
            disabled={showVerification}
            required
          />
        </div>

        {showVerification && (
          <div className="input-group">
            <label>Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              maxLength="6"
              placeholder="Enter 6-digit code"
              required
            />
            {countdown > 0 ? (
              <p className="resend-timer">Resend code in {countdown}s</p>
            ) : (
              <button
                type="button"
                className="resend-button"
                onClick={handleStartVerification}
                disabled={loading}
              >
                Resend Code
              </button>
            )}
          </div>
        )}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Processing...' : showVerification ? 'Verify Code' : 'Send Code'}
        </button>
      </form>

      <p className="login-alternative">
        Or <a href="/login">login with email</a>
      </p>
    </div>
  );
};

export default PhoneLogin;
