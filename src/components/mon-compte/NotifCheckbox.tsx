import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';

import { usePutNotifications } from 'src/api/notifications/notifications.put';
import { UserContext } from 'src/contexts/userContext';

export const NotifCheckbox = () => {
  const { user } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();

  const [commentChecked, setCommentChecked] = React.useState(true);
  // ---------- Uncomment the following lines to add more checkboxes ----------
  // const [reactionChecked, setReactionChecked] = React.useState(true);
  // const [publicationFromAClassChecked, setPublicationFromAClassChecked] = React.useState(true);
  // const [publicationFromAdminChecked, setPublicationFromAdminChecked] = React.useState(true);
  // const [creationAccountFamilyChecked, setCreationAccountFamilyChecked] = React.useState(true);
  // const [phaseOpeningChecked, setPhaseOpeningChecked] = React.useState(true);
  const putNotifications = usePutNotifications({
    userId: user?.id || 0,
    data: {
      commentary: commentChecked,
      reaction: false,
      publicationFromSchool: false,
      publicationFromAdmin: false,
      creationAccountFamily: false,
      openingVillageStep: false,
    },
  });

  const handleCommentChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentChecked(event.target.checked);
  };

  // ---------- Uncomment the following lines to add more checkboxes ----------

  // const handleReactionChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setReactionChecked(event.target.checked);
  // };

  // const handlePublicationFromAClassChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPublicationFromAClassChecked(event.target.checked);
  // };

  // const handlePublicationFromAdminChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPublicationFromAdminChecked(event.target.checked);
  // };

  // const handleCreationAccountFamilyChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setCreationAccountFamilyChecked(event.target.checked);
  // };

  // const handlePhaseOpeningChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPhaseOpeningChecked(event.target.checked);
  // };

  const mappingCheckbox = [
    { label: 'Commentaire d’une classe sur une de vos publications', checked: commentChecked, handle: handleCommentChecked },
    // ---------- Uncomment the following lines to add more checkboxes ----------
    // { label: 'Réaction à une de vos publications', checked: reactionChecked, handle: handleReactionChecked },
    // { label: 'Publication d’une classe', checked: publicationFromAClassChecked, handle: handlePublicationFromAClassChecked },
    // { label: 'Publication de Pélico', checked: publicationFromAdminChecked, handle: handlePublicationFromAdminChecked },
    // { label: 'Création de compte famille', checked: creationAccountFamilyChecked, handle: handleCreationAccountFamilyChecked },
    // { label: 'Ouverture de phase', checked: phaseOpeningChecked, handle: handlePhaseOpeningChecked },
  ];

  const handleChoice = () => {
    putNotifications.mutate();
    if (putNotifications.isSuccess) {
      enqueueSnackbar('Modifications mises à jour !', {
        variant: 'success',
      });
    }
    if (putNotifications.isError) {
      enqueueSnackbar('Une erreur est survenue...', {
        variant: 'error',
      });
    }
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

      <Button size="small" variant="contained" onClick={handleChoice} style={{ margin: '1rem 0.5rem' }}>
        Enregister mes choix
      </Button>
    </div>
  );
};
