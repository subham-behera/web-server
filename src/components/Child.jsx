import React from 'react';

const Child = ({ name, onAction }) => {
  return (
    <div>
      <h3>Child Component</h3>
      <p>Hello, {name}</p>
      <button onClick={onAction}>Click Me</button>
    </div>
  );
};

export default Child;
