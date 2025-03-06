import React, { useState } from 'react';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { authService } from '../../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null); // Add this state
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

  // Handle profile picture upload with validation
  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors({ ...formErrors, profilePic: 'File size exceeds 2MB.' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setFormErrors({ ...formErrors, profilePic: 'Please upload a valid image file.' });
        return;
      }

      setProfilePicFile(file); // Store the actual file
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result); // Store the preview URL
        setFormErrors({ ...formErrors, profilePic: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please fix the form errors before submitting.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('password', password);
      formData.append('role', role);
      
      if (profilePicFile) {
        formData.append('profile_pic', profilePicFile);
      }

      const response = await authService.signup(formData);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('authMethod', 'email');
        navigate('/login');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-up-container">
      <nav className="nav-bar">
        <button className="back-button" onClick={() => navigate('/login')}>
          <FaArrowLeft /> Back
        </button>
        <h1 className="sign-up-title">Sign Up</h1>
      </nav>

      {error && <div className="error-alert">{error}</div>}

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="profile-container">
          <img
            src={profilePic || "https://cdn.builder.io/api/v1/image/assets/5e63579e9e244520bc959af7510c032f/cf1501e70d1cf0941c8695738654b541abd33b1433733b729892868acd13c180?apiKey=5e63579e9e244520bc959af7510c032f&"}
            alt="User profile"
            className="profile-image"
          />
          <input
            type="file"
            accept="image/*"
            id="file-input"
            className="hidden-file-input"
            onChange={handleProfilePicChange}
          />
          <FaEdit className="edit-icon" onClick={() => document.getElementById('file-input').click()} />
        </div>

        <div className="input-field">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={formErrors.name ? 'error' : ''}
          />
          {formErrors.name && <span className="error-message">{formErrors.name}</span>}
        </div>

        <div className="input-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={formErrors.email ? 'error' : ''}
          />
          {formErrors.email && <span className="error-message">{formErrors.email}</span>}
        </div>

        <div className="input-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={formErrors.password ? 'error' : ''}
          />
          {formErrors.password && <span className="error-message">{formErrors.password}</span>}
        </div>

        <div className="input-field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={formErrors.confirmPassword ? 'error' : ''}
          />
          {formErrors.confirmPassword && <span className="error-message">{formErrors.confirmPassword}</span>}
        </div>

        <div className="input-field">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="submit-button" 
          disabled={isLoading}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
