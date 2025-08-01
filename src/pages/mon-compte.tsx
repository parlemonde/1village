import { useSnackbar } from 'notistack';
import React, { useContext, useState } from 'react';

import { Alert, AlertTitle, Checkbox, Grid, TextField } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import NoSsr from '@mui/material/NoSsr';

import { Base } from 'src/components/Base';
import LanguageFilter from 'src/components/LanguageFilter';
import { Modal } from 'src/components/Modal';
import { EditButton } from 'src/components/buttons/EditButton';
import { QuestionButton } from 'src/components/buttons/QuestionButton';
import { RedButton } from 'src/components/buttons/RedButton';
import { NotifCheckbox } from 'src/components/mon-compte/NotifCheckbox';
import { PanelInput } from 'src/components/mon-compte/PanelInput';
import { UserContext } from 'src/contexts/userContext';
import { useLanguages } from 'src/services/useLanguages';
import { defaultContainedButtonStyle, helpColor } from 'src/styles/variables.const';
import { getUserDisplayName } from 'src/utils';
import { isPseudoValid, isEmailValid, isPasswordValid, isConfirmPasswordValid } from 'src/utils/accountChecks';
import { axiosRequest } from 'src/utils/axiosRequest';
import { SSO_HOSTNAME } from 'src/utils/sso';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

const Presentation = () => {
  const { user, setUser, logout } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [newUser, setNewUser] = useState<User | null>(user);
  const { languages } = useLanguages();
  const [pwd, setPwd] = useState({
    new: '',
    confirmNew: '',
    current: '',
  });
  const [language, setLanguage] = useState(user?.language || 'francais');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [editMode, setEditMode] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    pseudo: false,
    pwd: false,
    pwdConfirm: false,
  });

  const checkEmailAndPseudo = async () => {
    if (!newUser) return;
    if (!user) return;
    const pseudoValid = await isPseudoValid(newUser.pseudo, user.pseudo);
    setErrors((e) => ({
      ...e,
      email: !isEmailValid(newUser.email),
      pseudo: !pseudoValid,
    }));
  };
  const checkPassword = () => {
    setErrors((e) => ({
      ...e,
      pwd: pwd.new.length > 0 && !isPasswordValid(pwd.new),
      pwdConfirm: pwd.confirmNew.length > 0 && !isConfirmPasswordValid(pwd.new, pwd.confirmNew),
    }));
  };

  const updateUser = async () => {
    if (!newUser) return;
    if (!user) return;
    setIsLoading(true);
    const updatedValues = {
      school: newUser.school,
      level: newUser.level,
      city: newUser.city,
      postalCode: newUser.postalCode,
      address: newUser.address,
      pseudo: newUser.pseudo,
      email: newUser.email,
      displayName: newUser.displayName,
      hasAcceptedNewsletter: newUser.hasAcceptedNewsletter,
      language: language,
    };
    const response = await axiosRequest({
      method: 'PUT',
      url: `/users/${user.id}`,
      data: updatedValues,
    });
    if (response.error) {
      setNewUser(user);
      enqueueSnackbar('Une erreur inconnue est survenue...', {
        variant: 'error',
      });
    } else {
      setUser({ ...user, ...updatedValues });
      enqueueSnackbar('Compte mis à jour avec succès !', {
        variant: 'success',
      });
    }
    setIsLoading(false);
  };
  const updateLanguage = async () => {
    if (!user) return;
    setIsLoading(true);
    const updatedValues = {
      language,
    };
    const response = await axiosRequest({
      method: 'PUT',
      url: `/users/${user.id}`,
      data: updatedValues,
    });
    if (response.error) {
      setNewUser(user);
      enqueueSnackbar('Une erreur inconnue est survenue...', {
        variant: 'error',
      });
    } else {
      setUser({ ...user, ...updatedValues });
      enqueueSnackbar('Compte mis à jour avec succès !', {
        variant: 'success',
      });
    }
    setIsLoading(false);
  };

  const updatePwd = async () => {
    if (!newUser) return;
    if (!user) return;
    setIsLoading(true);
    const response = await axiosRequest({
      method: 'PUT',
      url: `/users/${user.id}/password`,
      data: {
        password: pwd.current,
        newPassword: pwd.new,
      },
    });
    if (response.error) {
      setNewUser(user);
      enqueueSnackbar('Une erreur inconnue est survenue...', {
        variant: 'error',
      });
    } else {
      enqueueSnackbar('Mot de passe mis à jour avec succès !', {
        variant: 'success',
      });
    }
    setIsLoading(false);
  };

  const updateCheckBox = async (checked: boolean) => {
    if (!newUser) return;
    if (!user) return;
    setIsLoading(true);
    const response = await axiosRequest({
      method: 'PUT',
      url: `/users/${user.id}`,
      data: {
        hasAcceptedNewsletter: checked,
      },
    });
    if (response.error) {
      setNewUser(user);
      enqueueSnackbar('Une erreur inconnue est survenue...', {
        variant: 'error',
      });
    } else {
      setUser({ ...user, hasAcceptedNewsletter: checked });
      enqueueSnackbar('Choix mis à jour avec succès !', {
        variant: 'success',
      });
    }
    setIsLoading(false);
  };

  const deleteAccount = async () => {
    if (!newUser) return;
    if (!user) return;
    setIsLoading(true);
    const response = await axiosRequest({
      method: 'DELETE',
      url: `/users/${user.id}`,
    });
    if (response.error) {
      enqueueSnackbar('Une erreur inconnue est survenue...', {
        variant: 'error',
      });
    } else {
      logout();
      enqueueSnackbar('Compte supprimé avec succès', {
        variant: 'success',
      });
    }
    setIsLoading(false);
  };

  const updateEditMode =
    (newEditMode: number, save: 'user' | 'pwd' | 'delete' | 'language' | null = null) =>
    async () => {
      if (save === 'user') {
        await checkEmailAndPseudo();
        if (errors.email || errors.pseudo) {
          return;
        }
        await updateUser();
      } else if (save === 'pwd') {
        checkPassword();
        if (errors.pwd || errors.pwdConfirm || pwd.new.length === 0 || pwd.confirmNew.length === 0) {
          return;
        }
        await updatePwd();
      } else if (save === 'language') {
        await updateLanguage();
      } else if (save === 'delete') {
        deleteAccount();
      } else {
        setNewUser(user);
        setDeleteConfirm('');
      }
      setEditMode(newEditMode);
    };

  if (!user || !newUser) {
    return <div></div>;
  }

  return (
    <Base>
      <h1>Paramètres du compte</h1>
      {user.type === UserType.TEACHER ? (
        <div className="account__panel">
          <h2>Paramètres du profil</h2>
          <div className="account__panel-edit-button">{editMode !== 0 && <EditButton onClick={updateEditMode(0)} />}</div>

          <PanelInput
            value={newUser.school}
            defaultValue={'non renseignée'}
            label="École :"
            placeholder="Nom de votre école"
            isEditMode={editMode === 0}
            isBold
            onChange={(school) => {
              setNewUser((u) => (!u ? u : { ...u, school }));
            }}
          />
          <PanelInput
            value={newUser.level}
            defaultValue={'non renseigné'}
            label="Niveau de la classe :"
            placeholder="Niveau de votre classe"
            isEditMode={editMode === 0}
            isBold
            onChange={(level) => {
              setNewUser((u) => (!u ? u : { ...u, level }));
            }}
          />
          <PanelInput
            value={newUser.address}
            defaultValue={'non renseigné'}
            label="Adresse de l'école :"
            placeholder="Adresse"
            isEditMode={editMode === 0}
            isBold
            onChange={(address) => {
              setNewUser((u) => (!u ? u : { ...u, address }));
            }}
          />
          <PanelInput
            value={newUser.city}
            defaultValue={'non renseigné'}
            label="Ville :"
            placeholder="Ville"
            isEditMode={editMode === 0}
            isBold
            onChange={(city) => {
              setNewUser((u) => (!u ? u : { ...u, city }));
            }}
          />
          <PanelInput
            value={newUser.postalCode}
            defaultValue={'non renseigné'}
            label="Code postal :"
            placeholder="Code postal"
            isEditMode={editMode === 0}
            isBold
            onChange={(postalCode) => {
              setNewUser((u) => (!u ? u : { ...u, postalCode }));
            }}
          />
          <PanelInput
            value={newUser.displayName || ''}
            defaultValue={getUserDisplayName(user, false, true)}
            label="Pseudo :"
            placeholder={getUserDisplayName(user, false, true)}
            isEditMode={editMode === 0}
            isBold
            onChange={(displayName) => {
              setNewUser((u) => (!u ? u : { ...u, displayName }));
            }}
          />
          {editMode === 0 && (
            <div className="text-center">
              <Button
                color="inherit"
                size="small"
                sx={defaultContainedButtonStyle}
                variant="contained"
                style={{ margin: '0.5rem' }}
                onClick={updateEditMode(-1)}
              >
                Annuler
              </Button>
              <Button size="small" variant="contained" color="secondary" style={{ margin: '0.2rem' }} onClick={updateEditMode(-1, 'user')}>
                Enregistrer
              </Button>
            </div>
          )}
        </div>
      ) : null}
      <div className="account__panel">
        <h2>Identifiants de connexion</h2>
        <div className="account__panel-edit-button">
          {user.accountRegistration === 10 ? (
            <QuestionButton helpMessage={`Vos identifiants de connexion sont gérés par ${SSO_HOSTNAME}`} />
          ) : (
            editMode !== 1 && <EditButton onClick={updateEditMode(1)} />
          )}
        </div>
        {editMode === 1 && (
          <Alert severity="warning" style={{ margin: '0.5rem 0', backgroundColor: 'white', border: `1px solid ${helpColor}` }}>
            <AlertTitle>Attention !</AlertTitle>
            Votre <strong>email</strong> est votre identifiant de connexion.
          </Alert>
        )}
        {user.type === UserType.TEACHER ? (
          <PanelInput
            value={newUser.pseudo}
            defaultValue={''}
            label="Nom et prénom :"
            placeholder="Pseudo de la classe"
            isEditMode={editMode === 1}
            onChange={(pseudo) => {
              setNewUser((u) => (!u ? u : { ...u, pseudo }));
            }}
            errorMsg="Pseudo indisponible"
            hasError={errors.pseudo}
            onBlur={checkEmailAndPseudo}
          />
        ) : null}
        <PanelInput
          value={newUser.email}
          defaultValue={''}
          label="Email :"
          placeholder="Adresse Email"
          isEditMode={editMode === 1}
          onChange={(email) => {
            setNewUser((u) => (!u ? u : { ...u, email }));
          }}
          errorMsg="Email invalide"
          hasError={errors.email}
          onBlur={checkEmailAndPseudo}
        />
        {user.accountRegistration !== 10 && (
          <>
            <div style={{ margin: '1rem 0.5rem' }}>
              <Button variant="contained" color="secondary" size="small" onClick={updateEditMode(2)}>
                Modifier le mot de passe
              </Button>
            </div>
            {editMode === 1 && (
              <div className="text-center">
                <Button color="inherit" size="small" variant="contained" style={{ margin: '0.5rem' }} onClick={updateEditMode(-1)}>
                  Annuler
                </Button>
                <Button size="small" variant="contained" color="secondary" style={{ margin: '0.2rem' }} onClick={updateEditMode(-1, 'user')}>
                  Enregistrer
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <NotifCheckbox />
      {user.type === UserType.FAMILY ? (
        <div className="account__panel">
          <h2>Préférence de communication</h2>
          <div className="account__panel-edit-button">{editMode !== 0 && <EditButton onClick={updateEditMode(0)} />}</div>
          <div style={{ maxWidth: '800px', width: '100%', textAlign: 'left' }}>
            <label style={{ cursor: 'pointer' }}>
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }} className="text">
                      Choix de la langue de communication
                    </p>

                    <div>
                      {editMode === -1 && (
                        <span>
                          <strong>Langue: </strong>
                          {language}
                        </span>
                      )}
                    </div>
                    <PanelInput
                      value={newUser.language}
                      defaultValue={''}
                      label="Language :"
                      placeholder="Langue"
                      style={{ visibility: 'hidden' }}
                      isEditMode={editMode === 0}
                      onChange={() => {
                        setNewUser((u) => (!u ? u : { ...u, language }));
                      }}
                    />
                    {editMode === 0 && <LanguageFilter language={language} setLanguage={setLanguage} languages={languages} />}
                    {editMode === 0 && (
                      <div className="text-center">
                        <Button
                          color="inherit"
                          size="small"
                          sx={defaultContainedButtonStyle}
                          variant="contained"
                          style={{ margin: '0.5rem' }}
                          onClick={() => {
                            setLanguage(user?.language || 'francais');
                            setEditMode(-1);
                          }}
                        >
                          Annuler
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          style={{ margin: '0.2rem' }}
                          onClick={updateEditMode(-1, 'language')}
                        >
                          Enregistrer
                        </Button>
                      </div>
                    )}
                  </Grid>
                </Grid>
              </div>
            </label>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Checkbox
                  value={newUser.hasAcceptedNewsletter}
                  checked={user !== null && user.hasAcceptedNewsletter}
                  onChange={(event) => {
                    updateCheckBox(event.target.checked);
                  }}
                />
                <span>{'Accepter de recevoir des nouvelles du projet 1Village'}</span>
              </Grid>
            </Grid>
          </div>
        </div>
      ) : null}
      <div className="account__panel">
        <h2>Données et confidentialité</h2>
        <div style={{ margin: '1rem 0.5rem' }}>
          <RedButton variant="contained" color="secondary" size="small" onClick={updateEditMode(3)}>
            Supprimer mon compte
          </RedButton>
        </div>
      </div>

      <NoSsr>
        <Modal
          open={editMode === 2}
          confirmLabel="Modifier"
          onClose={updateEditMode(-1)}
          onConfirm={updateEditMode(-1, 'pwd')}
          title="Changer de mot de passe"
          fullWidth
          maxWidth="sm"
          ariaLabelledBy="update-pwd"
          ariaDescribedBy="update-pwd-desc"
        >
          <div id="update-pwd-desc">
            <TextField
              value={pwd.current}
              type="password"
              label="Mot de passe actuel"
              onChange={(event) => {
                setPwd((p) => ({ ...p, current: event.target.value }));
              }}
              variant="standard"
              className="full-width"
            />
            <TextField
              value={pwd.new}
              variant="standard"
              type="password"
              label="Nouveau mot de passe"
              onChange={(event) => {
                setPwd((p) => ({ ...p, new: event.target.value }));
              }}
              className="full-width"
              style={{ marginTop: '0.75rem' }}
              error={errors.pwd}
              helperText={
                errors.pwd
                  ? 'Mot de passe trop faible. Il doit contenir au moins 8 charactères avec des lettres minuscules, majuscules et des chiffres.'
                  : null
              }
              onBlur={checkPassword}
            />
            <TextField
              value={pwd.confirmNew}
              variant="standard"
              type="password"
              label="Confirmer le mot de passe"
              onChange={(event) => {
                setPwd((p) => ({ ...p, confirmNew: event.target.value }));
              }}
              className="full-width"
              style={{ marginTop: '0.75rem' }}
              error={errors.pwdConfirm}
              helperText={errors.pwdConfirm ? 'Mots de passe différents.' : null}
              onBlur={checkPassword}
            />
          </div>
        </Modal>

        <Modal
          open={editMode === 3}
          confirmLabel="Supprimer"
          error
          onClose={updateEditMode(-1)}
          onConfirm={updateEditMode(-1, 'delete')}
          title="Supprimer mon compte"
          fullWidth
          disabled={deleteConfirm.toLowerCase() !== 'supprimer'}
          color="primary"
          maxWidth="sm"
          ariaLabelledBy="delete-user"
          ariaDescribedBy="delete-user-desc"
        >
          <div>
            <Alert severity="error" style={{ marginBottom: '1rem' }}>
              Attention! Êtes-vous sur de vouloir supprimer votre compte ? Cette action est <strong>irréversible</strong>.
              <br />
              Pour supprimer votre compte, veuillez taper <strong>supprimer</strong> ci-dessous et cliquez sur supprimer.
            </Alert>
            <TextField
              value={deleteConfirm}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              label=""
              placeholder="Tapez 'supprimer' ici"
              onChange={(event) => {
                setDeleteConfirm(event.target.value);
              }}
              className="full-width"
              error={true}
              style={{ marginTop: '0.75rem' }}
            />
          </div>
        </Modal>
      </NoSsr>

      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default Presentation;
