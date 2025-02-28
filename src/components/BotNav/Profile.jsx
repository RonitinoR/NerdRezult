import React from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
const Profile = () => {
  return (
    <Link to="/Profile" className="nav-item-bottom">
    <div className="nav-icon profileIcon">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6904 13.4763C15.0653 12.8512 14.2174 12.5 13.3334 12.5H6.66671C5.78265 12.5 4.93481 12.8512 4.30968 13.4763C3.68456 14.1014 3.33337 14.9493 3.33337 15.8333V17.5M10 9.16667C11.3807 9.16667 12.5 8.04738 12.5 6.66667C12.5 5.28595 11.3807 4.16667 10 4.16667C8.61929 4.16667 7.5 5.28595 7.5 6.66667C7.5 8.04738 8.61929 9.16667 10 9.16667Z"
          stroke="white"
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <span className="nav-label ProfileText">Profile</span>
  </Link>
  );
};

export default Profile;