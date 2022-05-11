import { useSnackbar } from 'notistack';
import React from 'react';

import Button from '@mui/material/Button';

import { Modal } from 'src/components/Modal';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';

export const ThirdPhase = () => {
  const { setSelectedPhase } = React.useContext(VillageContext);
  const { axiosLoggedRequest, user, setUser } = React.useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = React.useState(true);

  if (!user) {
    return null;
  }

  const updateUser = async () => {
    const response = await axiosLoggedRequest({
      method: 'PUT',
      url: `/users/${user.id}`,
      data: { firstLogin: 3 },
    });
    if (response.error) {
      enqueueSnackbar('Une erreur inconnue est survenue...', {
        variant: 'error',
      });
    } else {
      setUser({ ...(user || {}), firstLogin: 3 });
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Modal
        open={isModalOpen}
        title="La phase 3 est active !"
        maxWidth="md"
        fullWidth
        onClose={() => {}}
        noCloseOutsideModal
        ariaDescribedBy="missing-step-desc"
        ariaLabelledBy="missing-step-title"
        actions={
          <>
            <div id="new-user-desc" style={{ minHeight: '15rem', display: 'flex', justifyContent: 'center', textAlign: 'center', marginTop: '2rem' }}>
              <div>
                <p>{'Si vous voulez poursuivre les échanges avec vos pélicopains, retournez sur la phase 2'}</p>
                <Button
                  component="a"
                  onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    event.preventDefault();
                    setSelectedPhase(2);
                    setIsModalOpen(false);
                  }}
                  href={'/'}
                  color="primary"
                  variant={'outlined'}
                  className="navigation__button full-width"
                  style={{
                    justifyContent: 'flex-start',
                    width: 'auto',
                  }}
                >
                  Retourner sur la phase 2
                </Button>
              </div>
              <div>
                <p>{"Si vous souhaitez débuter l'imagination du village idéal, poursuivez sur la phase 3."}</p>
                <Button
                  component="a"
                  onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    event.preventDefault();
                    updateUser();
                    setSelectedPhase(3);
                    setIsModalOpen(false);
                  }}
                  href={'/'}
                  color="primary"
                  variant={'outlined'}
                  className="navigation__button full-width"
                  style={{
                    justifyContent: 'flex-start',
                    width: 'auto',
                  }}
                >
                  Poursuivre sur la phase 3
                </Button>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};
