import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';

import Button from '@mui/material/Button';

import { Modal } from 'src/components/Modal';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { axiosRequest } from 'src/utils/axiosRequest';

export const SecondPhase = () => {
  const { setSelectedPhase } = useContext(VillageContext);
  const { user, setUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const urlForm =
    'https://docs.google.com/forms/d/e/1FAIpQLSfqJKB8UnFZ14DM1tISHlODWd5qOS2MygGHusfJUo5UjxKdtg/viewform?usp=sharing&ouid=101262587132272655135';

  if (!user) {
    return null;
  }

  const updateUser = async () => {
    const response = await axiosRequest({
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
        title="La phase 2 est active, et l'identité de vos pélicopains est dévoilée !"
        maxWidth="md"
        fullWidth
        onClose={() => {}}
        noCloseOutsideModal
        ariaDescribedBy="missing-step-desc"
        ariaLabelledBy="missing-step-title"
        actions={
          <div id="new-user-desc" style={{ minHeight: '15rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div>
              <p>Avant de passer à la phase suivante, prenez 5 minutes pour nous faire vos retours sur la phase 1 :</p>
              <a href={urlForm} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#4c3ed9' }}>
                Vos retours sur la phase 1 d&apos;1Village 2025/26
              </a>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
              <div>
                <p>Si vous n&apos;avez pas encore résolu l&apos;énigme avec votre classe, retournez sur la phase 1.</p>
                <Button
                  component="a"
                  onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    event.preventDefault();
                    setSelectedPhase(1);
                    setIsModalOpen(false);
                  }}
                  href="/"
                  color="primary"
                  variant="outlined"
                  className="navigation__button full-width"
                  style={{
                    justifyContent: 'flex-start',
                    width: 'auto',
                  }}
                >
                  Retourner sur la phase 1
                </Button>
              </div>
              <div>
                <p>Si vous souhaitez débuter les échanges avec vos pélicopains, poursuivez sur la phase 2.</p>
                <Button
                  component="a"
                  onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                    event.preventDefault();
                    updateUser();
                    setSelectedPhase(2);
                    setIsModalOpen(false);
                  }}
                  href="/"
                  color="primary"
                  variant="outlined"
                  className="navigation__button full-width"
                  style={{
                    justifyContent: 'flex-start',
                    width: 'auto',
                  }}
                >
                  Poursuivre sur la phase 2
                </Button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};
