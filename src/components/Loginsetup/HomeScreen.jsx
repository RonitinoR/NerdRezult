import React from "react";
import './HomeScreen.css';
import { initializeInteractions } from "./HS.js";
import { useState,useEffect } from "react";
import './HS.js';
import Messages from "../BotNav/Messages.jsx";
import Hom from "../BotNav/Hom.jsx";
import Add from "../BotNav/Add.jsx";
import Notifications from "../BotNav/Notifications.jsx";
import Profile from "../BotNav/Profile.jsx";
import JobCards from "../Main/JobCards.jsx";
const HomeScreen: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

    const toggleDropdown = () => {
      setIsDropdownOpen((prevState) => !prevState); // Toggle the dropdown state
    };
  
    useEffect(() => {
      initializeInteractions(); // 🔥 Initialize JS interactions
    }, []);

  return (
        <div className="app-container">
        <header className="header">
        <div className="app-container">
      <header className="header">
        <div className="logo">FreelanceHub</div>
        <div className="header-actions">
          {/* Filters Button */}
          <button
            className="filters-btn"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen ? "true" : "false"} // Update ARIA state for accessibility
            onClick={toggleDropdown} // Toggle dropdown visibility
          >
            ☰ Filters
          </button>

          {/* Dropdown Menu (conditionally rendered) */}
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <ul>

              <nav className="navigation-bar">
            <div className="nav-links">
            <a href="#" className="nav-item-active">All Jobs</a>
            <a href="#" className="nav-item">Frontend</a>
            <a href="#" className="nav-item">Backend</a>
            <a href="#" className="nav-item">Full Stack</a>
            <a href="#" className="nav-item">UI/UX</a>
            <a href="#" className="nav-item">Mobile</a>
            </div>
            <div className="nav-actions">
            <form className="search-box" role="search">
                <label htmlFor="search-input" className="visually-hidden">
                Search jobs
                </label>
                <input
                type="search"
                id="search-input"
                placeholder="Search"
                aria-label="Search jobs"
                />
                <button type="submit" aria-label="Submit search">
                🔍
                </button>
            </form>
            </div>
        </nav>
              </ul>
            </div>
          )}

          <div className="balance-display">$2,450.00</div>
          <button className="post-project-btn">Post a Project</button>
          <button className="sign-in-btn">Sign In</button>
        </div>
      </header>
    </div>
        </header>

        <div>
          <JobCards />  {/* Use the JobCards component to render all job cards */}
         </div>
        <nav className="bottom-nav">
        <Hom />
        <Messages />
        <Add/>
        <Notifications />
        <Profile />
        </nav>
        </div>
        
    );
    };

export default HomeScreen;