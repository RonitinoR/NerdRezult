import React, { useState } from 'react';
import './Add.css';
const Popup = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Function to show popup
  const showPopup = () => {
    setIsPopupVisible(true);
  };

  // Function to close popup
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div>
      {/* Add Button */}
      <button
        className="nav-item-add-btn"
        aria-label="Add new item"
        onClick={showPopup} // Show popup when button is clicked
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5V19M5 12H19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Popup */}
      {isPopupVisible && (
        <div
          id="popup-page"
          style={{
            display: 'block',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h2>Popup Page</h2>
            <p>This is the content of the popup page.</p>
            <button
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                border: 'none',
                backgroundColor: '#ccc',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
              onClick={closePopup} // Close popup when this button is clicked
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;