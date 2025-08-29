import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Checkbox, Grid, Typography, useMediaQuery } from '@mui/material';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';

import { CGU } from 'src/components/CGU';
import { Flag } from 'src/components/Flag';
import { Map } from 'src/components/Map';
import { Modal } from 'src/components/Modal';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { PanelInput } from 'src/components/mon-compte/PanelInput';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { bgPage, defaultOutlinedButtonStyle, defaultTextButtonStyle } from 'src/styles/variables.const';
import PelicoSearch from 'src/svg/pelico/pelico-search.svg';
import { getUserDisplayName, serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

export const FirstPhase = () => {
  const { user, setUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { village } = useContext(VillageContext);
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User> | null>(user);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [updateAsked, setUpdateAsked] = useState({
    village: false,
    country: false,
  });
  const [cguChecked, setCguChecked] = useState(false);
  const isMdScreen = useMediaQuery('(min-width: 900px)');

  useEffect(() => {
    setNewUser(user);
  }, [user]);

  if (user === null || newUser === null || village === null || user.type <= UserType.MEDIATOR) {
    return null;
  }

  const getNewUserPosition = async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: `/users/position${serializeToQueryUrl({
        query: `${newUser.address}, ${newUser.city}, ${newUser.postalCode}, ${newUser.country?.name || ''}`,
        city: newUser.city,
        country: newUser.country?.name || '',
      })}`,
    });

    setPosition(response.error ? { lat: 0, lng: 0 } : response.data);
  };

  const updateUser = async () => {
    if (!newUser.firstname || !newUser.lastname || !newUser.school || !newUser.level || !newUser.address || !newUser.city || !newUser.postalCode) {
      return;
    }

    setIsLoading(true);

    const updatedUser: Partial<User> = {
      school: newUser.school,
      level: newUser.level || '',
      city: newUser.city,
      postalCode: newUser.postalCode,
      address: newUser.address,
      pseudo: newUser.pseudo,
      email: newUser.email,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      firstLogin: 1,
      displayName: newUser.displayName || '',
    };

    if (position !== null) {
      updatedUser.position = position;
    }

    const response = await axiosRequest({
      method: 'PUT',
      url: `/users/${user.id}`,
      data: updatedUser,
    });

    if (response.error) {
      enqueueSnackbar('Une erreur inconnue est survenue...', {
        variant: 'error',
      });
    } else {
      setUser({ ...(user || {}), ...updatedUser });
    }

    setIsLoading(false);
  };

  const sendError = (error: 'village' | 'country') => async () => {
    // do not ask twice
    if (updateAsked[error]) {
      enqueueSnackbar(
        error === 'country'
          ? 'Une demande de changement de pays a été envoyé à un administrateur !'
          : 'Une demande de changement de village a été envoyé à un administrateur !',
        {
          variant: 'success',
        },
      );
      return;
    }

    const response = await axiosRequest({
      method: 'POST',
      url: '/users/ask-update',
      data: {
        error,
      },
    });

    if (response.error) {
      enqueueSnackbar('Une erreur inconnue est survenue...', {
        variant: 'error',
      });
    } else {
      enqueueSnackbar(
        error === 'country'
          ? 'Une demande de changement de pays a été envoyé à un administrateur !'
          : 'Une demande de changement de village a été envoyé à un administrateur !',
        {
          variant: 'success',
        },
      );

      setUpdateAsked({ ...updateAsked, [error]: true });
    }
  };

  return (
    <Modal
      open={true}
      title="Bienvenue sur 1Village !"
      cancelLabel="Continuer"
      maxWidth="lg"
      fullWidth
      onClose={() => {}}
      noCloseButton
      loading={loading}
      noCloseOutsideModal
      ariaDescribedBy="new-user-desc"
      ariaLabelledBy="new-user-title"
      actions={
        <div style={{ width: '100%' }}>
          <MobileStepper
            style={{ backgroundColor: 'unset' }}
            variant="dots"
            steps={5}
            activeStep={currentStep}
            nextButton={
              <Button
                size="small"
                color={currentStep === 2 || currentStep === 4 ? 'primary' : 'inherit'}
                variant={currentStep === 2 || currentStep === 4 ? 'contained' : 'text'}
                sx={currentStep === 2 || currentStep === 4 ? undefined : defaultTextButtonStyle}
                disabled={
                  (currentStep === 3 &&
                    (!newUser.firstname ||
                      !newUser.lastname ||
                      !newUser.school ||
                      !newUser.level ||
                      !newUser.address ||
                      !newUser.city ||
                      !newUser.postalCode)) ||
                  (currentStep === 2 && !cguChecked)
                }
                onClick={() => {
                  if (currentStep === 3) {
                    getNewUserPosition().catch();
                  }
                  if (currentStep !== 4) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    updateUser();
                  }
                }}
              >
                {currentStep === 2 ? 'Accepter' : currentStep === 4 ? 'Terminer' : 'Suivant'}
                {currentStep !== 2 && currentStep !== 4 && <KeyboardArrowRight />}
              </Button>
            }
            backButton={
              <Button
                size="small"
                color="inherit"
                sx={defaultTextButtonStyle}
                onClick={() => {
                  if (currentStep === 4) {
                    setPosition(null);
                  }
                  setCurrentStep(currentStep - 1);
                }}
                disabled={currentStep === 0}
              >
                {<KeyboardArrowLeft />}
                Précedent
              </Button>
            }
            position="static"
          />
        </div>
      }
    >
      <div id="new-user-desc" style={{ height: isMdScreen ? '75vh' : '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {currentStep === 0 && (
          <div className="text-center">
            <span style={{ fontSize: '1.1rem' }}>Votre classe appartient au village-monde</span>
            <br />
            <Button variant="contained" color="primary" size="medium" onClick={() => setIsVisible(!isVisible)}>
              {isVisible ? 'Cacher' : 'Montrer'}
            </Button>
            <h2 style={{ fontSize: '1.2rem', margin: '1rem 0', visibility: isVisible ? 'visible' : 'hidden' }} className="text--primary">
              {village.name}
            </h2>
            <Button
              color="inherit"
              sx={defaultOutlinedButtonStyle}
              size="small"
              variant="outlined"
              style={{ marginTop: '2rem' }}
              onClick={sendError('village')}
            >
              {"Ce n'est pas mon village-monde !"}
            </Button>
          </div>
        )}
        {currentStep === 1 && (
          <div className="text-center">
            <span style={{ fontSize: '1.1rem' }}>Votre pays</span>
            <br />
            <h2 style={{ fontSize: '1.2rem', margin: '1rem 0' }} className="text--primary">
              <span style={{ marginRight: '0.5rem' }}>{user ? user.country?.name : ''}</span>
              {user && <Flag country={user.country?.isoCode}></Flag>}
            </h2>
            <Button
              color="inherit"
              sx={defaultOutlinedButtonStyle}
              size="small"
              variant="outlined"
              style={{ marginTop: '2rem' }}
              onClick={sendError('country')}
            >
              {"Ce n'est pas mon pays !"}
            </Button>
          </div>
        )}
        {currentStep === 2 && (
          <>
            <div style={{ height: '19rem', overflow: 'scroll', maxWidth: '800px', margin: '0 auto' }}>
              <CGU />
            </div>
            <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', textAlign: 'right' }}>
              <label style={{ cursor: 'pointer' }}>
                <Checkbox
                  checked={cguChecked}
                  onChange={(event) => {
                    setCguChecked(event.target.checked);
                  }}
                />
                <span>{"J'accepte les conditions générales d'utilisation du site"}</span>
              </label>
            </div>
          </>
        )}
        {currentStep === 3 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <PelicoSearch style={{ width: '4rem', height: 'auto', marginRight: '1rem' }} />
            </div>
            <Grid container spacing={2}>
              <Grid item sm={12} md={6}>
                <Typography variant="h3" mx={1} mb={2}>
                  {"Professionnel de l'éducation"}
                </Typography>
                <PanelInput
                  value={newUser.lastname || ''}
                  defaultValue="non renseignée"
                  label="Nom : "
                  placeholder="Nom : "
                  hasError={!newUser.lastname}
                  isEditMode
                  isRequired
                  onChange={(lastname) => {
                    setNewUser((u) => ({ ...u, lastname }));
                  }}
                />
                <PanelInput
                  value={newUser.firstname || ''}
                  defaultValue="non renseignée"
                  label="Prénom : "
                  placeholder="Prénom : "
                  hasError={!newUser.firstname}
                  isEditMode
                  isRequired
                  onChange={(firstname) => {
                    setNewUser((u) => ({ ...u, firstname }));
                  }}
                />
                <Typography variant="h3" mx={1} my={2}>
                  Établissement
                </Typography>
                <PanelInput
                  value={newUser.school || ''}
                  defaultValue="non renseignée"
                  label="École : "
                  placeholder="Nom de votre école : "
                  hasError={!newUser.school}
                  isEditMode
                  isRequired
                  onChange={(school) => {
                    setNewUser((u) => ({ ...u, school }));
                  }}
                />
                <PanelInput
                  value={newUser.level || ''}
                  defaultValue="non renseigné"
                  label="Niveau de la classe : "
                  placeholder="Niveau de votre classe"
                  hasError={!newUser.level}
                  isEditMode
                  isRequired
                  onChange={(level) => {
                    setNewUser((u) => ({ ...u, level }));
                  }}
                />
                <PanelInput
                  value={newUser.address || ''}
                  defaultValue="non renseigné"
                  label="Adresse de l'école : "
                  placeholder="Adresse"
                  hasError={!newUser.address}
                  isEditMode
                  isRequired
                  onChange={(address) => {
                    setNewUser((u) => ({ ...u, address }));
                  }}
                />
                <PanelInput
                  value={newUser.city || ''}
                  defaultValue="non renseigné"
                  label="Ville : "
                  placeholder="Ville"
                  hasError={!newUser.city}
                  isEditMode
                  isRequired
                  onChange={(city) => {
                    setNewUser((u) => ({ ...u, city }));
                  }}
                />
                <PanelInput
                  value={newUser.postalCode || ''}
                  defaultValue="non renseigné"
                  label="Code postal : "
                  placeholder="Code postal"
                  hasError={!newUser.postalCode}
                  isEditMode
                  isRequired
                  onChange={(postalCode) => {
                    setNewUser((u) => ({ ...u, postalCode }));
                  }}
                />
                {user.country?.name && <PanelInput value={user.country.name} defaultValue="" label="Pays :" placeholder="Pays" isEditMode={false} />}
                <PanelInput
                  style={{ marginTop: '1rem' }}
                  value={newUser.displayName || ''}
                  defaultValue="non renseigné"
                  label="Pseudo : "
                  placeholder={getUserDisplayName({ ...user, ...newUser, type: user?.type }, false)}
                  isEditMode
                  onChange={(displayName) => {
                    setNewUser((u) => ({ ...u, displayName }));
                  }}
                />
              </Grid>
              <Grid
                item
                sm={12}
                md={6}
                bgcolor={bgPage}
                px={1}
                py={2}
                style={{ borderRadius: '0.25rem', ...(isMdScreen ? { height: '100%', width: '100%' } : {}) }}
              >
                <span className="text text--bold">Prévisualisation de vos publications :</span>
                <ActivityCard
                  activity={{
                    id: 0,
                    type: ActivityType.PRESENTATION,
                    phase: 1,
                    userId: user?.id,
                    villageId: 0,
                    responseActivityId: null,
                    responseType: null,
                    data: {
                      theme: 0,
                    },
                    status: ActivityStatus.PUBLISHED,
                    createDate: new Date(),
                    content: [
                      {
                        type: 'text',
                        value: '........................',
                        id: 0,
                      },
                    ],
                  }}
                  user={{ ...user, ...newUser, type: user.type, id: -1 }}
                  noButtons
                />
              </Grid>
            </Grid>
          </>
        )}
        {currentStep === 4 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <PelicoSearch style={{ width: '4rem', height: 'auto', marginRight: '1rem' }} />
              <span className="text text--bold">Votre position sur la carte est-elle correcte ? Si non, déplacez le curseur pour la modifier.</span>
            </div>
            <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
              {position !== null && (
                <Map
                  position={position}
                  zoom={3}
                  markers={[
                    {
                      position,
                      label: 'Votre classe',
                      onDragEnd: (newPos: { lat: number; lng: number }) => {
                        setPosition(newPos);
                      },
                      activityCreatorMascotte: undefined,
                    },
                  ]}
                />
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
