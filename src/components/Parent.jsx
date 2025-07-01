import React, { useState } from 'react';
import Child from './Child';

const Parent = () => {
  const [message, setMessage] = useState('No action yet.');

  const handleChildClick = () => {
    setMessage('Child triggered this!');
  };

  return (
    <div>
      <h2>Parent Component</h2>
      <p>{message}</p>
      <Child name="Arjun" onAction={handleChildClick} />
    </div>
  );
};

export default Parent;
