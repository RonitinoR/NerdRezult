import React from 'react';
import { Link } from 'react-router-dom';
import './Notifi.css';
const Notifications = () => {
  return (
    <Link to="/notifications" className="nav-item-bottom">
      <div className="nav-icon notificationsIcon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M11.4417 17.4998C11.2952 17.7524 11.0849 17.962 10.8319 18.1078C10.5788 18.2535 10.292 18.3302 10 18.3302C9.70802 18.3302 9.42116 18.2535 9.16814 18.1078C8.91513 17.962 8.70484 17.7524 8.55833 17.4998M15 6.6665C15 5.34042 14.4732 4.06865 13.5355 3.13097C12.5979 2.19329 11.3261 1.6665 10 1.6665C8.67392 1.6665 7.40215 2.19329 6.46447 3.13097C5.52678 4.06865 5 5.34042 5 6.6665C5 12.4998 2.5 14.1665 2.5 14.1665H17.5C17.5 14.1665 15 12.4998 15 6.6665Z"
            stroke="white"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="nav-label notificationsText">Notifications</span>
    </Link>
  );
};

export default Notifications;