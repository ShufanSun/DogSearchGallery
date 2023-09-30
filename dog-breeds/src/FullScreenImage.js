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
          maxWidth: '80%', // Adjust this value to your desired enlargement level (e.g., 80% for 80% enlargement)
          maxHeight: '80%', // Adjust this value to your desired enlargement level (e.g., 80% for 80% enlargement)
        }}
      />
    </div>
  );
};

export default FullScreenImage;
