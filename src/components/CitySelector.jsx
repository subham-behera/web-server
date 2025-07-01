import React, { useState } from 'react';

const CitySelector = () => {
  // State to handle the selected city
  const [selectedCity, setSelectedCity] = useState('');

  // Function to handle city selection
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  return (
    <div>
      <select onChange={handleCityChange}>
        <option value="">Select a city</option>
        <option value="New York">New York</option>
        <option value="Los Angeles">Los Angeles</option>
        <option value="Chicago">Chicago</option>
      </select>

      {selectedCity && <p>You selected: {selectedCity}</p>}
    </div>
  );
};

export default CitySelector;
