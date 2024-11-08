import { useSnackbar } from 'notistack';
import React from 'react';

import Button from '@mui/material/Button';

import { Modal } from 'src/components/Modal';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { axiosRequest } from 'src/utils/axiosRequest';

export const ThirdPhase = () => {
  const { setSelectedPhase } = React.useContext(VillageContext);
  const { user, setUser } = React.useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = React.useState(true);
  const urlForm = 'https://docs.google.com/forms/d/e/1FAIpQLSfncEkPDYsPjK3RCjX_YBUC2uNxD-RAd2Bn_KGlimv765M-Vw/viewform';
  const textToDisplay = 'Avant de passer à la phase suivante, prenez 5 minutes pour nous faire vos retours sur la phase 2 : ';
  const textForUrl = "Vos retours sur la phase 2 d'1Village 2024/25";

  if (!user) {
    return null;
  }

  const updateUser = async () => {
    const response = await axiosRequest({
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
            <div
              id="new-user-desc"
              style={{ minHeight: '15rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
            >
              <div>
                <p>{textToDisplay}</p>
                <a href={urlForm} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#4c3ed9' }}>
                  {textForUrl}
                </a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
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
            </div>
          </>
        }
      />
    </div>
  );
};
