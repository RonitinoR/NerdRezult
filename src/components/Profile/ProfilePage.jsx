import React, { useState, useEffect } from "react";
import { Phone, Star, ChevronDown, Plus, X, Users, UserIcon } from "lucide-react";
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
  const [profileData, setProfileData] = useState({
    ownerName: "",
    certificate: "",
    role: "",
    projects: 0,
    followers: 0,
    earnings: 0,
    rating: 0,
    skills:[],
    certified: "",
    projectLinks:[],
    projectsName: "",
  });

  const [sortOrder, setSortOrder] = useState("asc");
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/profile"); // Replace with your actual API endpoint
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  },);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Uploading image:", file);
      // Here you would typically handle the image upload to your server
    }
  };

  const sortSkills = () => {
    const sortedSkills = [...profileData.skills].sort((a, b) => {
      return sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a);
    });
    setProfileData({ ...profileData, skills: sortedSkills });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleSkillChange = (index, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      skills: prevData.skills.map((skill, i) =>
        i === index ? value : skill
      ),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setProfileData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setProfileData((prevData) => ({
      ...prevData,
      skills: prevData.skills.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="relative bg-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-start gap-6">
            <div className="relative flex flex-col items-center">
              <div className="relative">
                <Avatar className="w-32 h-32 rounded-full border-4 border-white shadow-md">
                  <AvatarImage src="/Users/anoopreddy/Downloads/Itachi.jpeg" />
                  <AvatarFallback>
                    <UserIcon className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-upload"
                  className="absolute -bottom-4 right-1/2 translate-x-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full cursor-pointer hover:bg-white/90 transition-colors border border-gray-300"
                >
                  <Plus className="w-6 h-6 text-gray-600" />
                  <input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div className="mt-4">
                <Badge variant="secondary">
                  <Input
                    value={profileData.role}
                    onChange={(e) =>
                      setProfileData({ ...profileData, role: e.target.value })
                    }
                    className="bg-white/80 backdrop-blur-sm text-center w-full"
                  />
                </Badge>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">
                Profile
              </h2>
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
              <div className="flex justify-end gap-4 mt-2">
                <Button size="icon" variant="secondary">
                  <Users className="w-4 h-4" /> {/* Use the Users icon from Lucide React */}
                </Button>
                <Button size="icon" variant="secondary">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-6 bg-gray-100">
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
        <div className="p-6 space-y-6">
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
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">Rating</span>
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
                      setProfileData({ ...profileData, rating: star })
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
              <p className="text-sm text-gray-600">
                If you are looking for better results in effective price
                connect with her and look what she has done for me
              </p>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-4 gap-2">
            {profileData.skills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="justify-center"
              >
                <Input
                  value={skill}
                  onChange={(e) =>
                    handleSkillChange(index, e.target.value)
                  }
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
              placeholder="Add new skill"
              className="bg-white/80 backdrop-blur-sm"
            />
            <Button onClick={addSkill}>Add</Button>
          </div>

          {/* Dropdowns */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Certified</label>
              <Select
                value={profileData.certified}
                onValueChange={(value) =>
                  setProfileData({ ...profileData, certified: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masters in computer science">
                    Masters in computer science
                  </SelectItem>
                  <SelectItem value="PhD in AI">PhD in AI</SelectItem>
                  <SelectItem value="BSc in Computer Engineering">
                    BSc in Computer Engineering
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-500">
                Links to projects
              </label>
              <Select
                value={profileData.projectLinks[0]}
                onValueChange={(value) =>
                  setProfileData({
                    ...profileData,
                    projectLinks: [
                      value,
                      ...profileData.projectLinks.slice(1),
                    ],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project link" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="https://github/project1.nerdrezult">
                    https://github/project1.nerdrezult
                  </SelectItem>
                  <SelectItem value="https://github/project2.nerdrezult">
                    https://github/project2.nerdrezult
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-500">Projects</label>
              <Select
                value={profileData.projectsName}
                onValueChange={(value) =>
                  setProfileData({ ...profileData, projectsName: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Masters in computer science">
                    Masters in computer science
                  </SelectItem>
                  <SelectItem value="AI Research Project">
                    AI Research Project
                  </SelectItem>
                  <SelectItem value="Machine Learning Implementation">
                    Machine Learning Implementation
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;






