import React, { useState, useEffect, useCallback } from 'react';
import './Add.css';
import ProjectPage from '../Projectscreen/projectpage';

const Popup = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const showPopup = () => {
    setIsPopupVisible(true);
  };

  const closePopup = useCallback(() => {
    setIsPopupVisible(false);
  }, []);

  // Handle Escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isPopupVisible) {
        closePopup();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isPopupVisible, closePopup]);

  // Handle clicking outside the popup
  const handleOutsideClick = (event) => {
    if (event.target.id === 'popup-page') {
      closePopup();
    }
  };

  return (
    <div>
      {/* Add Button */}
      <button
        className="nav-item-add-btn"
        aria-label="Add new item"
        onClick={showPopup}
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
          onClick={handleOutsideClick}
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
              position: 'relative',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#E2FDDA',
              padding: '20px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90%',
              overflowY: 'auto',
            }}
          >
            {/* Close (X) Button */}
            <button
              onClick={closePopup}
              aria-label="Close popup"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            <ProjectPage isPopup={true} onClose={closePopup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;

