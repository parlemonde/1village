import React from 'react';

interface PasswordMessagesDisplayerProps {
  isErrors: boolean;
  badLengthMessage: string;
  missingDigitsMessage: string;
}

const PasswordMessagesDisplayer = ({ isErrors, badLengthMessage, missingDigitsMessage }: PasswordMessagesDisplayerProps) => {
  const passwordRequirementsMessage = '12 lettres minimum, une majuscule, une minusucle, un caractère spécial et un chiffre';
  return isErrors ? (
    <>
      {badLengthMessage.length > 0 && (
        <>
          {badLengthMessage}
          <br />
        </>
      )}
      {missingDigitsMessage}
    </>
  ) : (
    <>{passwordRequirementsMessage}</>
  );
};

export default PasswordMessagesDisplayer;
