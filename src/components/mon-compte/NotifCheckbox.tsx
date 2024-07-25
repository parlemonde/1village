import React, { useContext } from 'react';

import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

import { usePutNotifications } from 'src/api/notifications/notifications.put';
import { UserContext } from 'src/contexts/userContext';

export const NotifCheckbox = () => {
  const { user } = useContext(UserContext);

  const [commentChecked, setCommentChecked] = React.useState(true);
  const [reactionChecked, setReactionChecked] = React.useState(true);
  const [publicationFromAClassChecked, setPublicationFromAClassChecked] = React.useState(true);
  const [publicationFromAdminChecked, setPublicationFromAdminChecked] = React.useState(true);
  const [creationAccountFamilyChecked, setCreationAccountFamilyChecked] = React.useState(true);
  const [phaseOpeningChecked, setPhaseOpeningChecked] = React.useState(true);
  const putNotifications = usePutNotifications({
    userId: user?.id || 0,
    data: {
      commentary: commentChecked,
      reaction: reactionChecked,
      publicationFromSchool: publicationFromAClassChecked,
      publicationFromAdmin: publicationFromAdminChecked,
      creationAccountFamily: creationAccountFamilyChecked,
      openingVillageStep: phaseOpeningChecked,
    },
  });

  const handleCommentChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentChecked(event.target.checked);
  };

  const handleReactionChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReactionChecked(event.target.checked);
  };

  const handlePublicationFromAClassChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublicationFromAClassChecked(event.target.checked);
  };

  const handlePublicationFromAdminChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPublicationFromAdminChecked(event.target.checked);
  };

  const handleCreationAccountFamilyChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreationAccountFamilyChecked(event.target.checked);
  };

  const handlePhaseOpeningChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhaseOpeningChecked(event.target.checked);
  };

  const mappingCheckbox = [
    { label: 'Commentaire sur une de vos publications', checked: commentChecked, handle: handleCommentChecked },
    { label: 'Réaction à une de vos publications', checked: reactionChecked, handle: handleReactionChecked },
    { label: 'Publication d’une classe', checked: publicationFromAClassChecked, handle: handlePublicationFromAClassChecked },
    { label: 'Publication de Pelico', checked: publicationFromAdminChecked, handle: handlePublicationFromAdminChecked },
    { label: 'Création de compte famille', checked: creationAccountFamilyChecked, handle: handleCreationAccountFamilyChecked },
    { label: 'Ouverture de phase', checked: phaseOpeningChecked, handle: handlePhaseOpeningChecked },
  ];

  const handleChoice = () => {
    putNotifications.mutate();
  };

  return (
    <div className="account__panel">
      <h2>Notifications</h2>
      {mappingCheckbox.map((notif, index) => (
        <div key={index} className="account__panel__checkbox" style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox checked={notif.checked} onChange={notif.handle} inputProps={{ 'aria-label': 'controlled' }} />
          <p style={{ marginLeft: '8px' }}>{notif.label}</p>
        </div>
      ))}

      <Button size="small" variant="contained" onClick={handleChoice} style={{ margin: '1rem 0.5rem' }} endIcon={<SendIcon />}>
        Enregister mes choix
      </Button>
    </div>
  );
};
