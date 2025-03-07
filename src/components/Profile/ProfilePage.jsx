import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Star, ChevronDown, Plus, X, Users, UserIcon, ArrowLeft } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Input,
  Badge,
} from "./ui";

const ProfilePage = () => {
  // Define all state variables at the top of the component
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State variables
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [profileData, setProfileData] = useState({
    ownerName: "",
    certificate: "",
    role: "",
    projects: 0,
    followers: 0,
    earnings: 0,
    rating: 0,
    skills: [],
    certified: "",
    projectLinks: [],
    projectsName: "",
    profileImage: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newProjectLink, setNewProjectLink] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [projectLinks, setProjectLinks] = useState([]);
  const [projectNames, setProjectNames] = useState([]);

  // Handler functions
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadError('');
      
      try {
        setProfileData({ ...profileData, profileImage: URL.createObjectURL(file) });
        setIsUploading(false);
      } catch (error) {
        setUploadError('Failed to upload image');
        setIsUploading(false);
      }
    }
  };

  const handleSkillChange = (index, value) => {
    const newSkills = [...profileData.skills];
    newSkills[index] = value;
    setProfileData({ ...profileData, skills: newSkills });
  };

  const removeSkill = (index) => {
    const newSkills = profileData.skills.filter((_, i) => i !== index);
    setProfileData({ ...profileData, skills: newSkills });
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const handleCertificationKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCertification();
    }
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const handleProjectLinkKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddProjectLink();
    }
  };

  const handleAddProjectLink = () => {
    if (newProjectLink.trim()) {
      setProjectLinks([...projectLinks, newProjectLink.trim()]);
      setNewProjectLink("");
    }
  };

  const handleProjectNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddProjectName();
    }
  };

  const handleAddProjectName = () => {
    if (newProjectName.trim()) {
      setProjectNames([...projectNames, newProjectName.trim()]);
      setNewProjectName("");
    }
  };

  const removeItem = (type, value) => {
    switch (type) {
      case 'certification':
        setCertifications(certifications.filter(cert => cert !== value));
        break;
      case 'projectLink':
        setProjectLinks(projectLinks.filter(link => link !== value));
        break;
      case 'project':
        setProjectNames(projectNames.filter(name => name !== value));
        break;
      default:
        break;
    }
  };

  const sortSkills = () => {
    const sorted = [...profileData.skills].sort();
    setProfileData({
      ...profileData,
      skills: sorted
    });
  };

  return (
    <div className="fixed inset-0 overflow-auto" 
      style={{
        background: "linear-gradient(to bottom, rgba(226, 253, 218, 0.59), rgba(38, 146, 4, 0.34))"
      }}>
      <div className="max-w-2xl mx-auto my-8">
        {/* Back Button */}
        <button
          className="hover:bg-gray-100 p-2 rounded-full absolute top-6 left-6"
          onClick={() => navigate('/HomeScreen')}
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>

        <div className="rounded-2xl shadow-sm overflow-hidden"
          style={{
            background: "linear-gradient(45deg, rgba(226, 253, 218, 0.59), rgba(38, 146, 4, 0.34))",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)"
          }}>
          {/* Profile Header */}
          <div className="relative p-8 pb-4 rounded-t-2xl">
            <div className="flex items-start gap-6">
              <div className="relative flex flex-col items-center">
                <div className="relative">
                  <Avatar 
                    className="w-32 h-32 rounded-full border-4 border-white shadow-md cursor-pointer transition-transform hover:scale-105"
                    onClick={handleAvatarClick}
                  >
                    <AvatarImage 
                      src={profileData.profileImage} 
                      alt="Profile"
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-200">
                      <UserIcon className="w-16 h-16 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                  />
                  <div className="absolute -bottom-4 right-1/2 translate-x-1/2 flex gap-2">
                    <button
                      onClick={handleAvatarClick}
                      className="bg-white/80 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:bg-white/90 transition-colors border border-gray-300 disabled:opacity-50"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-6 h-6 text-gray-600" />
                      )}
                    </button>
                  </div>
                  {uploadError && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-full max-w-xs bg-red-100 text-red-600 text-sm py-1 px-2 rounded text-center">
                      {uploadError}
                    </div>
                  )}
                </div>
                <div className="mt-4 space-y-3">
                  <Badge variant="secondary">
                    <Input
                      value={profileData.role}
                      onChange={(e) =>
                        setProfileData({ ...profileData, role: e.target.value })
                      }
                      className="bg-white/80 backdrop-blur-sm text-center w-full"
                    />
                  </Badge>
                  <div className="flex justify-center gap-2">
                    <Button size="icon" variant="secondary">
                      <Users className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-3 mt-4">
                {/* Profile title */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
                </div>

                {/* Owner Name input */}
                <div>
                  <label className="text-sm text-gray-500">Owner Name</label>
                  <Input
                    value={profileData.ownerName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        ownerName: e.target.value,
                      })
                    }
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Certificate input */}
                <div>
                  <label className="text-sm text-gray-500">
                    Owned a Certificate
                  </label>
                  <Input
                    value={profileData.certificate}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        certificate: e.target.value,
                      })
                    }
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-6 pt-2 pb-2"
            style={{
              background: "rgba(255, 255, 255, 0.5)"
            }}>
            <div className="text-center">
              <Input
                type="number"
                value={profileData.projects}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    projects: parseInt(e.target.value),
                  })
                }
                className="text-center text-2xl font-semibold"
              />
              <div className="text-sm text-gray-500">Projects</div>
            </div>
            <div className="text-center">
              <Input
                type="number"
                value={profileData.followers}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    followers: parseInt(e.target.value),
                  })
                }
                className="text-center text-2xl font-semibold"
              />
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <Input
                type="number"
                value={profileData.earnings}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    earnings: parseInt(e.target.value),
                  })
                }
                className="text-center text-2xl font-semibold"
              />
              <div className="text-sm text-gray-500">Earnings</div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="p-6 space-y-6"
            style={{
              background: "rgba(255, 255, 255, 0.5)"
            }}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Sort:</span>
              <Button
                variant="ghost"
                onClick={sortSkills}
                className="text-sm flex items-center gap-2"
              >
                Skills
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Rating */}
            <div className="p-4 rounded-lg" 
              style={{
                background: "linear-gradient(45deg, rgba(226, 253, 218, 0.59), rgba(38, 146, 4, 0.34))",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)"
              }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 cursor-pointer ${
                        star <= profileData.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() =>
                        setProfileData({
                          ...profileData,
                          rating: profileData.rating === star ? 0 : star
                        })
                      }
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    <UserIcon className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm" style={{ color: "var(--text-light)" }}>
                  If you are looking for better results in effective price
                  connect with her and look what she has done for me
                </p>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-4 gap-2 p-4 rounded-lg" 
              style={{
                background: "linear-gradient(45deg, rgba(226, 253, 218, 0.59), rgba(38, 146, 4, 0.34))",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)"
              }}>
              {profileData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="justify-center"
                >
                  <Input
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    className="bg-white/80 backdrop-blur-sm text-center w-full"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeSkill(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </Badge>
              ))}
            </div>

            {/* Add Skill Input */}
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleSkillKeyPress}
                placeholder="Add new skill"
                className="bg-white/80 backdrop-blur-sm"
              />
              <Button onClick={addSkill} className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200">
                <Plus className="w-6 h-6" />
              </Button>
            </div>

            {/* Dropdowns */}
            <div className="space-y-4 relative p-4 rounded-lg"
              style={{
                background: "linear-gradient(45deg, rgba(226, 253, 218, 0.59), rgba(38, 146, 4, 0.34))",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)"
              }}>
              {/* Certified Input */}
              <div className="relative" style={{ zIndex: 30 }}>
                <label className="text-sm text-gray-500 block mb-2">
                  Certified
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={handleCertificationKeyPress}
                    placeholder="Add new certification"
                    className="bg-white/80 backdrop-blur-sm"
                  />
                  <Button onClick={handleAddCertification} className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200">
                    <Plus className="w-6 h-6" />
                  </Button>
                </div>
                <Select
                  value={profileData.certified}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, certified: value })
                  }
                >
                  <SelectTrigger className="w-full mt-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.8)"
                    }}>
                    <SelectValue placeholder="Select certification" />
                  </SelectTrigger>
                  <SelectContent
                    className="w-full bg-white"
                    position="popper"
                    sideOffset={5}
                  >
                    {certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-1"
                      >
                        <SelectItem value={cert}>{cert}</SelectItem>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeItem("certification", cert);
                          }}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Project Links Input */}
              <div className="relative" style={{ zIndex: 20 }}>
                <label className="text-sm text-gray-500 block mb-2">
                  Links to projects
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newProjectLink}
                    onChange={(e) => setNewProjectLink(e.target.value)}
                    onKeyPress={handleProjectLinkKeyPress}
                    placeholder="Add new project link"
                    className="bg-white/80 backdrop-blur-sm"
                  />
                  <Button onClick={handleAddProjectLink} className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200">
                    <Plus className="w-6 h-6" />
                  </Button>
                </div>
                <Select
                  value={profileData.projectLinks[0]}
                  onValueChange={(value) =>
                    setProfileData({
                      ...profileData,
                      projectLinks: [value, ...profileData.projectLinks.slice(1)]
                    })
                  }
                >
                  <SelectTrigger className="w-full mt-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.8)"
                    }}>
                    <SelectValue placeholder="Select project link" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-white" position="popper" sideOffset={5}>
                    {projectLinks.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-1">
                        <SelectItem value={link}>
                          {link}
                        </SelectItem>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeItem('projectLink', link);
                          }}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Projects Input */}
              <div className="relative" style={{ zIndex: 10 }}>
                <label className="text-sm text-gray-500 block mb-2">Projects</label>
                <div className="flex gap-2">
                  <Input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyPress={handleProjectNameKeyPress}
                    placeholder="Add new project"
                    className="bg-white/80 backdrop-blur-sm"
                  />
                  <Button onClick={handleAddProjectName} className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200">
                    <Plus className="w-6 h-6" />
                  </Button>
                </div>
                <Select
                  value={profileData.projectsName}
                  onValueChange={(value) =>
                    setProfileData({ ...profileData, projectsName: value })
                  }
                >
                  <SelectTrigger className="w-full mt-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.8)"
                    }}>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-white" position="popper" sideOffset={5}>
                    {projectNames.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-1">
                        <SelectItem value={project}>
                          {project}
                        </SelectItem>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeItem('project', project);
                          }}
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
