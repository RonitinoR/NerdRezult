import React, { useState, useEffect, useRef } from "react";

import { ArrowLeft, Camera, Plus, X } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Input } from "../../components/Profile/ui/input"; // Alternative path



function ProjectPage({ isPopup, onClose, projectId }) {

const [isFloating, setIsFloating] = useState(false);

const [newSkill, setNewSkill] = useState("");

const fileInputRef = useRef(null);

const navigate = useNavigate();

const [profileImage, setProfileImage] = useState(null);

const [form, setForm] = useState({

projectName: "",

clientName: "",

details: "",

skills: [],

payPerHour: "", // Just store the number

duration: "", // Just store the number

githubLink: "",

startDate: "",

endDate: "",

projects: 0,

followers: 0,

earnings: 0,

});



useEffect(() => {

const fetchProjectData = async () => {

try {

if (projectId) {

// Only fetch if projectId exists

const response = await fetch(`/api/projects/${projectId}`); // Replace with your API endpoint

if (response.ok) {

const data = await response.json();

setForm(data);

setProfileImage(

data.profileImage ||

"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80",

); //Set image if it exists.

} else {

console.error("Failed to fetch project data");

}

} else {

setProfileImage(

"https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80",

);

}

} catch (error) {

console.error("Error fetching project data:", error);

}

};



fetchProjectData();

}, [projectId]);



useEffect(() => {

const handleScroll = () => {

const scrollPosition = window.scrollY;

setIsFloating(scrollPosition > 100);

};



window.addEventListener("scroll", handleScroll);

return () => window.removeEventListener("scroll", handleScroll);

},);



const handleInputChange = (e) => {

const { name, value } = e.target;

setForm((prev) => ({ ...prev, [name]: value }));

};



const handleAddSkill = (e) => {

e.preventDefault();

if (newSkill.trim()) {

setForm((prev) => ({

...prev,

skills: [...prev.skills, newSkill.trim()],

}));

setNewSkill("");

}

};



const handleSkillKeyPress = (e) => {

if (e.key === 'Enter') {

e.preventDefault();

handleAddSkill(e);

}

};



const removeSkill = (indexToRemove) => {

setForm((prev) => ({

...prev,

skills: prev.skills.filter((_, index) => index !== indexToRemove),

}));

};



const handleSubmit = async (e) => {

e.preventDefault();

try {

let response;

if (projectId) {

response = await fetch(`/api/projects/${projectId}`, {

// Replace with your API endpoint

method: "PUT",

headers: { "Content-Type": "application/json" },

body: JSON.stringify({ ...form, profileImage }),

});

} else {

response = await fetch("/api/projects", {

// Replace with your API endpoint

method: "POST",

headers: { "Content-Type": "application/json" },

body: JSON.stringify({ ...form, profileImage }),

});

}

if (response.ok) {

console.log("Form submitted:", { ...form, profileImage });

if (isPopup && onClose) {

onClose();

} else {

navigate("/projects"); // Navigate to projects list after submission

}

} else {

console.error("Failed to submit form");

}

} catch (error) {

console.error("Error submitting form:", error);

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

<div
  className={`${isPopup ? "" : "min-h-screen"}`}
  style={{
    background: isPopup
      ? "linear-gradient(#E2FDDA 59%, #269204 134%)"
      : "linear-gradient(to bottom, #ffffff 0%, #e8f5e9 100%)",
  }}
>
{!isPopup && (

<div className="bg-white p-4 sticky top-0 z-10 shadow-sm">

<div className="max-w-2xl mx-auto flex justify-between items-center">

<button

className="hover:bg-gray-100 p-2 rounded-full"

onClick={() => navigate(-1)}

>

<ArrowLeft className="w-6 h-6 text-gray-600" />

</button>

<button

onClick={handleSubmit}

className="bg-[#2563EB] text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"

>

{projectId ? "Update" : "Apply"}

</button>

</div>

</div>

)}



<div className="max-w-2xl mx-auto px-4">

<div className="relative mt-4">

<div className="relative w-full h-64 rounded-2xl bg-center bg-cover"

style={{ backgroundImage: `url(${profileImage})` }}

>

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



<div className="grid grid-cols-3 gap-4 p-6" style={{
  background: isPopup ? "linear-gradient(#E2FDDA 59%, #269204 134%)" : "white"
}}>
<div className="text-center">
<Input
  type="number"
  id="projects"
  name="projects"
  value={form.projects}
  onChange={handleInputChange}
  className="text-center text-2xl font-semibold bg-white"
  min="0"
  placeholder="0"
/>
<div className="text-sm text-gray-500">Projects</div>
</div>
<div className="text-center">
<Input
  type="number"
  id="followers"
  name="followers"
  value={form.followers}
  onChange={handleInputChange}
  className="text-center text-2xl font-semibold bg-white"
  min="0"
  placeholder="0"
/>
<div className="text-sm text-gray-500">Followers</div>
</div>
<div className="text-center">
<Input
  type="number"
  id="earnings"
  name="earnings"
  value={form.earnings}
  onChange={handleInputChange}
  className="text-center text-2xl font-semibold bg-white"
  min="0"
  placeholder="0"
/>
<div className="text-sm text-gray-500">Earnings</div>
</div>
</div>
</div>



<form
  onSubmit={handleSubmit}
  className={`rounded-2xl p-6 shadow-sm mb-8 ${
    isFloating ? "transition-transform duration-300 transform translate-y-2" : ""
  }`}
  style={{
    background: isPopup ? "linear-gradient(#E2FDDA 59%, #269204 134%)" : "white"
  }}
>
<div className="space-y-5">
<div>
<label
  className="block text-sm font-medium text-gray-600 mb-1.5"
  htmlFor="projectName"
>
Name of the project
</label>
<input
  type="text"
  id="projectName"
  name="projectName"
  value={form.projectName}
  onChange={handleInputChange}
  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  style={{
    background: isPopup ? "rgba(255, 255, 255, 0.5)" : "white"
  }}
  placeholder="Enter project name"
/>
</div>
<div>
<label
  className="block text-sm font-medium text-gray-600 mb-1.5"
  htmlFor="clientName"
>
Client Name
</label>
<input
  type="text"
  id="clientName"
  name="clientName"
  value={form.clientName}
  onChange={handleInputChange}
  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  style={{
    background: isPopup ? "rgba(255, 255, 255, 0.5)" : "white"
  }}
  placeholder="Enter client name"
/>
</div>
<div>
<label
  className="block text-sm font-medium text-gray-600 mb-1.5"
  htmlFor="details"
>
Project Details
</label>
<textarea
  id="details"
  name="details"
  value={form.details}
  onChange={handleInputChange}
  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  style={{
    background: isPopup ? "rgba(255, 255, 255, 0.5)" : "white"
  }}
  rows={4}
  placeholder="Enter project details"
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-600 mb-1.5">
Skills Required
</label>
<div className="flex flex-wrap gap-2 mb-2" style={{
  background: isPopup ? "rgba(255, 255, 255, 0.5)" : "white",
  borderRadius: "0.75rem",
  padding: "0.75rem"
}}>
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
  onKeyPress={handleSkillKeyPress}
  className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  style={{
    background: isPopup ? "rgba(255, 255, 255, 0.5)" : "white"
  }}
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
<label
  className="block text-sm font-medium text-gray-400 mb-1.5"  // Lightened text color
  htmlFor="payPerHour"
>
Pay Per Hour
</label>
<div className="relative">
<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
<input
  type="number"
  id="payPerHour"
  name="payPerHour"
  min="0"
  step="0.01"
  value={form.payPerHour}
  onChange={(e) => setForm(prev => ({
    ...prev,
    payPerHour: e.target.value
  }))}
  className="w-full p-3 pl-7 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white/80"
  style={{
    background: isPopup ? "rgba(255, 255, 255, 0.8)" : "white"
  }}
  placeholder="0.00"
/>
</div>
</div>
<div>
<label
  className="block text-sm font-medium text-gray-400 mb-1.5"  // Lightened text color
  htmlFor="duration"
>
Duration
</label>
<div className="relative">
<input
  type="number"
  id="duration"
  name="duration"
  min="0"
  step="0.5"
  value={form.duration}
  onChange={(e) => setForm(prev => ({
    ...prev,
    duration: e.target.value
  }))}
  className="w-full p-3 pr-12 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white/80"
  style={{
    background: isPopup ? "rgba(255, 255, 255, 0.8)" : "white"
  }}
  placeholder="0.0"
/>
<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">hrs</span>
</div>
</div>
</div>
<div>
<label
  className="block text-sm font-medium text-gray-600 mb-1.5"
  htmlFor="githubLink"
>
Github Link
</label>
<input
  type="url"
  id="githubLink"
  name="githubLink"
  value={form.githubLink}
  onChange={handleInputChange}
  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  style={{
    background: isPopup ? "rgba(255, 255, 255, 0.5)" : "white"
  }}
  placeholder="Enter Github link"
/>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label
  className="block text-sm font-medium text-gray-600 mb-1.5"
  htmlFor="startDate"
>
Start Date
</label>
<input
  type="date"
  id="startDate"
  name="startDate"
  value={form.startDate}
  onChange={handleInputChange}
  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  style={{
    background: isPopup ? "rgba(255, 255, 255, 0.5)" : "white"
  }}
/>
</div>
<div>
<label
  className="block text-sm font-medium text-gray-400 mb-1.5"  // Lightened text color
  htmlFor="endDate"
>
End Date
</label>
<input
  type="date"
  id="endDate"
  name="endDate"
  value={form.endDate}
  onChange={handleInputChange}
  className="w-full p-3 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent bg-white/80"
  style={{
    background: isPopup ? "rgba(255, 255, 255, 0.8)" : "white"
  }}
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
      {projectId ? "Update Project" : "Create Project"}
    </button>
  </div>
)}
</div>
);

}

export default ProjectPage;
