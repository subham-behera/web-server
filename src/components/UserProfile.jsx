import React, { useState } from 'react';

const UserProfile = () => {
  const [showProfile, setShowProfile] = useState(false);

  const toggleProfile = () => {
    setShowProfile(prev => !prev);
  };

  return (
    <div>
      <button onClick={toggleProfile}>
        {showProfile ? 'Hide Profile' : 'Show Profile'}
      </button>

      {showProfile && (
        <div>
          <h3>User Profile</h3>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john@example.com</p>
          <p><strong>Phone:</strong> +1 234 567 890</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
