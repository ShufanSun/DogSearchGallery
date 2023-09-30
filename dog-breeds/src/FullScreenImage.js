import React from 'react';

const FullScreenImage = ({ imageUrl, onClose }) => {
  const enlargeFactor = 2; // Adjust this factor to control the enlargement level

  return (
    <div
      className="full-screen-image"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        cursor: 'pointer',
      }}
    >
      <img
        src={imageUrl}
        alt="Full-Screen Dog"
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: '100%', // Limit the width to the screen width
          maxHeight: '100%', // Limit the height to the screen height
          transform: `scale(${enlargeFactor})`, // Apply the proportional enlargement
          transformOrigin: 'center', // Center the enlargement
        }}
      />
    </div>
  );
};

export default FullScreenImage;
