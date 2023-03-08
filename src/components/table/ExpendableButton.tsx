import React from 'react';

const ExpendableButton = ({ isOpen, toggle }) => {
  return (
    <button onClick={toggle}>
      <span
        className="material-symbols-outlined"
        style={{
          transform: `rotate(${isOpen ? 180 : 0}deg)`,
          transition: 'all 0.25s',
        }}
      >
        expand_more
      </span>
    </button>
  );
};

export default ExpendableButton;
