import { useSnackbar } from 'notistack';
import React from 'react';

import Button from '@mui/material/Button';

import { Modal } from 'src/components/Modal';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';

export const SecondPhase = () => {
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
      data: { firstLogin: 2 },
    });
    if (response.error) {
      enqueueSnackbar('Une erreur inconnue est survenue...', {
        variant: 'error',
      });
    } else {
      setUser({ ...(user || {}), firstLogin: 2 });
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Modal
        open={isModalOpen}
        title="La phase 2 est active, et l'identité de vos Pélicopains est dévoilée !"
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
                <p>Si vous n&apos;avez pas encore résolu l&apos;énigme avec votre classe, retournez sur la phase 1.</p>
                <Button
                  component="a"
                  onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    event.preventDefault();
                    updateUser();
                    setSelectedPhase(1);
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
                  Retournez sur la phase 1
                </Button>
              </div>
              <div>
                <p>Si vous souhaitez débuter les échanges avec vos Pélicopains, poursuivez sur la phase 2.</p>
                <Button
                  component="a"
                  onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    event.preventDefault();
                    updateUser();
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
                  Poursuivez sur la phase 2
                </Button>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};
