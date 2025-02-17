import React, { useState } from 'react';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Changed to useNavigate
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    profilePic: '',
  });

  // Password validation function
  const isValidPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  // Password strength validation
  const getPasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const upperCaseCriteria = /[A-Z]/.test(password);
    const lowerCaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /\d/.test(password);
    const specialCharCriteria = /[@$!%*?&]/.test(password);
    const allCriteriaMet = lengthCriteria && upperCaseCriteria && lowerCaseCriteria && numberCriteria && specialCharCriteria;
    return allCriteriaMet ? 'strong' : 'weak';
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors
    setFormErrors({});

    // Check if any required field is empty
    let errors = {};

    if (!name) errors.name = 'Name is required.';
    if (!email) errors.email = 'Email is required.';
    if (!password) errors.password = 'Password is required.';
    if (!confirmPassword) errors.confirmPassword = 'Confirm password is required.';
    if (!role) errors.role = 'Role selection is required.';
    if (!profilePic) errors.profilePic = 'Profile picture is required.';

    if (password && confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (password && !isValidPassword(password)) {
      errors.password = 'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    alert('Sign-up successful!');
  };

  // Handle profile picture upload with validation
  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate the image size (e.g., 2MB limit) and file type
      if (file.size > 2 * 1024 * 1024) {  // 2MB max size
        setFormErrors({ ...formErrors, profilePic: 'File size exceeds 2MB.' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFormErrors({ ...formErrors, profilePic: 'Please upload a valid image file.' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
        setFormErrors({ ...formErrors, profilePic: '' }); // Reset error if valid
      };
      reader.readAsDataURL(file);
    }
  };

  // Navigate back to previous page
  const handleGoBack = () => {
    navigate(-1); // Use navigate(-1) to go back
  };

  // Check if all fields are valid
  const isFormValid = () => {
    return (
      name && email && password && confirmPassword && password === confirmPassword &&
      isValidPassword(password) && role && profilePic
    );
  };

  return (
    <div className="sign-up-container">
      <nav className="nav-bar">
        {/* Back button with icon */}
        <button className="back-button" onClick={handleGoBack}>
          <FaArrowLeft /> Back
        </button>
        <h1 className="sign-up-title">Sign Up</h1>
      </nav>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="profile-container">
          <img
            src={profilePic || "https://cdn.builder.io/api/v1/image/assets/5e63579e9e244520bc959af7510c032f/cf1501e70d1cf0941c8695738654b541abd33b1433733b729892868acd13c180?apiKey=5e63579e9e244520bc959af7510c032f&"}
            alt="User profile"
            className="profile-image"
          />
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            id="file-input"
            className="hidden-file-input"
            onChange={handleProfilePicChange}
          />
          {/* Edit Icon that Triggers File Input */}
          <FaEdit className="edit-icon" onClick={() => document.getElementById('file-input').click()} />
        </div>

        {/* Name Field */}
        <div className="input-field">
          <label htmlFor="name" className="input-label">Name</label>
          <input
            type="text"
            id="name"
            className={`input-text ${formErrors.name ? 'input-error' : ''}`}
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {formErrors.name && <p className="error-message">{formErrors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="input-field">
          <label htmlFor="email" className="input-label">Email</label>
          <input
            type="email"
            id="email"
            className={`input-text ${formErrors.email ? 'input-error' : ''}`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {formErrors.email && <p className="error-message">{formErrors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="password-field">
          <label htmlFor="password" className="visually-hidden">Password</label>
          <input
            type="password"
            id="password"
            className={`input-text ${formErrors.password ? 'input-error' : ''}`}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {formErrors.password && <p className="error-message">{formErrors.password}</p>}
          <p className="password-strength">{getPasswordStrength(password)}</p>
        </div>

        {/* Confirm Password Field */}
        <div className="password-field">
          <label htmlFor="confirm-password" className="visually-hidden">Confirm password</label>
          <input
            type="password"
            id="confirm-password"
            className={`input-text ${formErrors.confirmPassword ? 'input-error' : ''}`}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {formErrors.confirmPassword && <p className="error-message">{formErrors.confirmPassword}</p>}
        </div>

        {/* Role Field */}
        <div className="role-field">
          <label htmlFor="role" className="input-label">Role</label>
          <select
            id="role"
            className="input-text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="client">Client</option>
            <option value="developer">Developer</option>
          </select>
          {formErrors.role && <p className="error-message">{formErrors.role}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="confirm-button" disabled={!isFormValid()}>Confirm</button>
      </form>
    </div>
  );
};

export default Signup;