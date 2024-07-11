import React from 'react';

import Checkbox from '@mui/material/Checkbox';

export const NotifCheckbox = () => {
  const [commentChecked, setCommentChecked] = React.useState(true);
  const [reactionChecked, setReactionChecked] = React.useState(true);
  const [publicationFromAClassChecked, setPublicationFromAClassChecked] = React.useState(true);
  const [publicationFromAdminChecked, setPublicationFromAdminChecked] = React.useState(true);
  const [creationAccountFamilyChecked, setCreationAccountFamilyChecked] = React.useState(true);
  const [phaseOpeningChecked, setPhaseOpeningChecked] = React.useState(true);

  const handleCommentChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentChecked(event.target.checked);
  }

  const mappingCheckbox = [
    { label: 'Commentaire sur une de vos publications', checked: commentChecked, handle: handleCommentChecked },
    { label: 'Réaction à une de vos publications', checked: reactionChecked, handle: setReactionChecked },
    { label: 'Publication d’une classe', checked: publicationFromAClassChecked, handle: setPublicationFromAClassChecked },
    { label: 'Publication de Pelico', checked: publicationFromAdminChecked, handle: setPublicationFromAdminChecked },
    { label: 'Création de compte famille', checked: creationAccountFamilyChecked, handle: setCreationAccountFamilyChecked },
    { label: 'Ouverture de phase', checked: phaseOpeningChecked, handle: setPhaseOpeningChecked },
  ];

  return (
    <div className="account__panel">
      <h2>Notifications</h2>
      {mappingCheckbox.map((notif) => {
        <div className="account__panel__checkbox">
          <Checkbox checked={notif.checked} onChange={notif.handle} inputProps={{ 'aria-label': 'controlled' }} />
          <p>{notif.label}</p>
        </div>;
      })}
    </div>
  );
};
