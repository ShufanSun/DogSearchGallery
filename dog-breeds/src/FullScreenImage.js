import React from 'react';

const FullScreenImage = ({ imageUrl, onClose }) => {
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
            maxWidth: '90vw', // Adjust this value to your preference for full-screen size
            maxHeight: '90vh', // Adjust this value to your preference for full-screen size
          }}
      />
    </div>
  );
};

export default FullScreenImage;
