import React, { useState } from 'react';

interface SaveButtonProps {
  handleSave: () => Promise<void>;
}

const SaveButton: React.FC<SaveButtonProps> = ({ handleSave }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await handleSave();
    setIsLoading(false);
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Saving...' : 'Save changes'}
    </button>
  );
};

export default SaveButton;
