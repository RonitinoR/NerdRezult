import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ChevronDown, ArrowRight, Camera, Plus, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

function ProjectPage({ isPopup, onClose }) {
  const [isFloating, setIsFloating] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const fileInputRef = useRef(null);
  const location = useLocation();
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80");
  const [form, setForm] = useState({
    projectName: '',
    clientName: '',
    details: '',
    skills: [],
    payPerHour: '',
    duration: '',
    githubLink: '',
    startDate: '',
    endDate: '',
    projects: '0',
    followers: '0',
    earnings: '0',
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsFloating(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      setForm(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { ...form, profileImage });
    if (isPopup && onClose) {
      onClose();
    }
  };

  const handleProfilePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`${isPopup ? '' : 'min-h-screen'} bg-[#f5f7f5]`} 
         style={{ background: isPopup ? 'white' : 'linear-gradient(to bottom, #ffffff 0%, #e8f5e9 100%)' }}>
      
      {!isPopup && (
        <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <button className="hover:bg-gray-100 p-2 rounded-full">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button 
              onClick={handleSubmit}
              className="bg-[#2563EB] text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4">
        <div className="relative mt-4">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-64 object-cover rounded-2xl"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button 
              onClick={handleProfilePicClick}
              className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex justify-around text-center py-6">
            <div>
              <label htmlFor="projects" className="block text-gray-600 text-sm">Projects</label>
              <input
                type="number"
                id="projects"
                name="projects"
                value={form.projects}
                onChange={handleInputChange}
                className="text-xl w-12 text-center border border-gray-300 rounded" 
              />
            </div>
            <div>
              <label htmlFor="followers" className="block text-gray-600 text-sm">Followers</label>
              <input
                type="number"
                id="followers"
                name="followers"
                value={form.followers}
                onChange={handleInputChange}
                className="text-xl w-12 text-center border border-gray-300 rounded" 
              />
            </div>
            <div>
              <label htmlFor="earnings" className="block text-gray-600 text-sm">Earnings</label>
              <input
                type="number"
                id="earnings"
                name="earnings"
                value={form.earnings}
                onChange={handleInputChange}
                className="text-xl w-12 text-center border border-gray-300 rounded" 
              />
            </div>
          </div>
        </div>

        <form 
          onSubmit={handleSubmit}
          className={`bg-white rounded-2xl p-6 shadow-sm mb-8 ${
            isFloating ? 'transition-transform duration-300 transform translate-y-2' : ''
          }`}
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5" htmlFor="projectName">
                Name of the project
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={form.projectName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5" htmlFor="clientName">
                Client Name
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={form.clientName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter client name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5" htmlFor="details">
                Project Details
              </label>
              <textarea
                id="details"
                name="details"
                value={form.details}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter project details"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Skills Required
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a skill"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5" htmlFor="payPerHour">
                  Pay Per Hour
                </label>
                <input
                  type="text"
                  id="payPerHour"
                  name="payPerHour"
                  value={form.payPerHour}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5" htmlFor="duration">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter duration"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5" htmlFor="githubLink">
                Github Link
              </label>
              <input
                type="url"
                id="githubLink"
                name="githubLink"
                value={form.githubLink}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Github link"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5" htmlFor="startDate">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5" htmlFor="endDate">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {isPopup && (
        <div className="flex justify-end mt-4 px-4 pb-4">
          <button
            onClick={handleSubmit}
            className="bg-[#2563EB] text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectPage;