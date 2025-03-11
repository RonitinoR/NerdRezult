import React, { useState } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { authService } from '../../services/api';

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client'
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('File size exceeds 2MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('password', formData.password);
      submitData.append('role', formData.role);
      if (profileImageFile) {
        submitData.append('profile_pic', profileImageFile);
      }
      const response = await authService.signup(submitData);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('authMethod', 'email');
        navigate('/login');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-auto" style={{
      background: "linear-gradient(to bottom, rgba(226, 253, 218, 0.59), rgba(38, 146, 4, 0.34))"
    }}>
      <div className="max-w-md mx-auto my-8">
        <button className="hover:bg-gray-100 p-2 rounded-full absolute top-6 left-6" onClick={() => navigate('/')}>
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="rounded-2xl shadow-sm overflow-hidden mx-4" style={{
          background: "linear-gradient(45deg, rgba(226, 253, 218, 0.59), rgba(38, 146, 4, 0.34))",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)"
        }}>
          <div className="relative p-6">
            <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">Create Account</h1>
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-4 border-white shadow-md">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-10 h-10 text-gray-400" />
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {['name', 'email', 'password', 'confirm Password'].map((field) => (
                <div key={field}>
                  <label className="text-sm text-gray-500 block mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={field.includes('password') ? 'password' : 'text'}
                    name={field}
                    placeholder={`Enter your ${field.toLowerCase().replace(/([A-Z])/g, ' $1')}`}
                    className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                    onChange={handleInputChange}
                    value={formData[field]}
                  />
                </div>
              ))}
              <div className="mt-4">
                <label className="text-sm text-gray-500 block mb-2">Select Role</label>
                <div className="flex gap-3">
                  {['client', 'freelancer'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                        formData.role === role 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/80 text-gray-700 hover:bg-green-50'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, role }))}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-4 bg-green-500 text-white py-2.5 rounded-lg hover:bg-green-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
