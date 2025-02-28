import React from 'react';
import { Link } from 'react-router-dom';
import './Hom.css';  // Assuming you might want a separate CSS file

const Hom = () => {
  return (
    <Link to="/HomeScreen" className="nav-item-bottom">
      <div className="nav-icon homeIcon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M2.5 7.49984L10 1.6665L17.5 7.49984V16.6665C17.5 17.1085 17.3244 17.5325 17.0118 17.845C16.6993 18.1576 16.2754 18.3332 15.8333 18.3332H4.16667C3.72464 18.3332 3.30072 18.1576 2.98816 17.845C2.67559 17.5325 2.5 17.1085 2.5 16.6665V7.49984Z"
            stroke="white"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="nav-label homeText">Home</span>
    </Link>
  );
}

export default Hom;