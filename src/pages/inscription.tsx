import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import LanguageFilter from 'src/components/LanguageFilter';
import { Modal } from 'src/components/Modal';
import { ParentsCGU } from 'src/components/ParentsCGU';
import PasswordMessagesDisplayer from 'src/components/PasswordMessagesDisplayer';
import { useLanguages } from 'src/services/useLanguages';
import { useUserRequests } from 'src/services/useUsers';
import ArrowBack from 'src/svg/arrow_back.svg';
import Logo from 'src/svg/logo_1village_famille.svg';
import { invalidPasswordMessageBuilder } from 'src/utils/invalidPasswordMessageBuilder';
import { UserType } from 'types/user.type';
import type { UserForm } from 'types/user.type';

const Inscription = () => {
  const [email, setEmail] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');
  const [isFirstnameValid, setIsFirstnameValid] = useState<boolean>(true);
  const [lastname, setLastname] = useState<string>('');
  const [isLastnameValid, setIsLastnameValid] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [passwordMessages, setPasswordMessages] = useState<{ badLength: string; missingDigits: string }>({ badLength: '', missingDigits: '' });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmationPasswordVisible, setIsConfirmationPasswordVisible] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isEmailUsed, setIsEmailUsed] = useState<boolean>(false);
  const [isCGURead, setIsCGURead] = useState<boolean>(false);
  const [isCGUModalOpen, setIsCGUModalOpen] = useState<boolean>(false);
  const [hasAcceptedNewsletter, setHasAcceptedNewsletter] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('français');
  const [newUser, setNewUser] = useState<UserForm>({
    email: email,
    firstname: firstname,
    lastname: lastname,
    pseudo: firstname.charAt(0) + ' ' + lastname,
    password: password,
    type: UserType.FAMILY,
    hasAcceptedNewsletter: hasAcceptedNewsletter,
    language: language,
  });
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState<boolean>(false);
  const [isRegisterDataValid, setIsRegisterDataValid] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { languages } = useLanguages();

  const { addUser, resendVerificationEmail } = useUserRequests();
  const router = useRouter();

  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (password !== '') {
      const invalidPasswordMessage = invalidPasswordMessageBuilder(password);
      setPasswordMessages({ badLength: invalidPasswordMessage.badLengthMessage, missingDigits: invalidPasswordMessage.missingDigitMessage });
      setIsPasswordValid(invalidPasswordMessage.badLengthMessage === '' && invalidPasswordMessage.missingDigitMessage === '');
    }

    if (confirmPassword !== '') {
      setIsPasswordMatch(password === confirmPassword);
    }

    if (email !== '') {
      if (!emailRegex.test(email)) {
        setIsEmailValid(false);
      } else {
        setIsEmailValid(true);
      }
    }

    if (lastname !== '') {
      if (lastname.length > 1) {
        setIsLastnameValid(true);
      } else {
        setIsLastnameValid(false);
      }
    }

    if (firstname !== '') {
      if (firstname.length > 1) {
        setIsFirstnameValid(true);
      } else {
        setIsFirstnameValid(false);
      }
    }

    setNewUser({
      email: email,
      firstname: firstname,
      lastname: lastname,
      pseudo: firstname.charAt(0) + ' ' + lastname,
      password: password,
      type: UserType.FAMILY,
      hasAcceptedNewsletter: hasAcceptedNewsletter,
      language: language,
    });

    if (
      isCGURead &&
      isEmailValid &&
      isFirstnameValid &&
      isPasswordMatch &&
      isPasswordValid &&
      isLastnameValid &&
      firstname.length !== 0 &&
      lastname.length !== 0
    ) {
      setIsRegisterDataValid(true);
    }
    if (
      !isCGURead ||
      !isEmailValid ||
      !isFirstnameValid ||
      !isPasswordMatch ||
      !isPasswordValid ||
      !isLastnameValid ||
      firstname.length === 0 ||
      lastname.length === 0
    ) {
      setIsRegisterDataValid(false);
    }
  }, [
    confirmPassword,
    email,
    firstname,
    isCGURead,
    isEmailValid,
    isFirstnameValid,
    isLastnameValid,
    isPasswordMatch,
    isPasswordValid,
    isRegisterDataValid,
    lastname,
    password,
    hasAcceptedNewsletter,
    language,
  ]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isCGURead && isEmailValid && isFirstnameValid && isPasswordMatch && isPasswordValid && isLastnameValid) {
      setIsPending(true);
      try {
        await addUser(newUser);
      } catch (err) {
        setIsEmailUsed(true);
        setIsPending(false);
        return;
      }

      resendVerificationEmail(newUser.email);
      setIsSubmitSuccessfull(true);
      setTimeout(() => {
        router.push('/connexion');
      }, 5000);
    }
  };

  const handleClickShowPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleClickShowConfirmationPassword = () => {
    setIsConfirmationPasswordVisible(!isConfirmationPasswordVisible);
  };

  return (
    <Grid
      container
      sx={{
        height: '100vh',
        '@media (max-width: 400px) and (max-height: 860px), (max-height: 860px)': {
          height: 'auto',
        },
      }}
      className="bg-gradiant-only"
      p="20px"
      alignItems="center"
      alignContent="center"
      justifyContent="center"
    >
      <Box width="100%" maxWidth="1200px">
        <Grid
          item
          xs={12}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bgcolor="white"
          height="fit-content"
          borderRadius="10px"
          p=".6rem"
          sx={{
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
          }}
        >
          <Box
            component={Link}
            onClick={() => {
              router.push('/');
            }}
            sx={{
              cursor: 'pointer',
              width: 'fit-content',
              height: 'auto',
              alignSelf: 'center',
              margin: {
                xs: '10px 0',
                sm: '0 10px',
              },
            }}
          >
            <Logo style={{ maxWidth: '260px' }} />
          </Box>

          <Box>
            <Link
              component="button"
              variant="h3"
              onClick={() => {
                router.push('/connexion');
              }}
              sx={{
                marginRight: '1rem',
                fontSize: '0.875rem',
                textAlign: 'end',
              }}
            >
              <ArrowBack /> Retour à la page de connexion
            </Link>
          </Box>
        </Grid>

        <Grid container mt={2} py={6} bgcolor="white" borderRadius="10px">
          <Grid xs={12} mb={4} textAlign="center" width="100%">
            <Typography variant="h2">Créer un compte</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            spacing={2}
            sx={{
              borderRight: {
                xs: 'none',
                sm: '1px solid lightgray',
              },
            }}
          >
            {!isSubmitSuccessfull ? (
              <>
                <Box component="form" width="90%" maxWidth="350px" mx="auto" alignItems="start" onSubmit={handleSubmit} className="login__form">
                  <TextField
                    variant="standard"
                    label="Adresse email"
                    placeholder="Entrez votre adresse email"
                    name="email"
                    error={!isEmailValid || isEmailUsed}
                    helperText={isEmailUsed && 'Email déjà utilisé'}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: '100%',
                      mb: '1rem',
                      '& .MuiAutocomplete-root': {
                        backgroundColor: 'white',
                      },
                    }}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setIsEmailUsed(false);
                    }}
                  />
                  <TextField
                    variant="standard"
                    label="Prénom"
                    placeholder="Entrez votre prénom"
                    name="firstname"
                    error={!isFirstnameValid}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: '100%',
                      mb: '1rem',
                      '& .MuiAutocomplete-root': {
                        backgroundColor: 'white',
                      },
                    }}
                    onChange={(event) => {
                      setFirstname(event.target.value);
                    }}
                  />
                  <TextField
                    variant="standard"
                    label="Nom de famille"
                    placeholder="Entrez votre nom de famille"
                    name="lastname"
                    error={!isLastnameValid}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: '100%', mb: '1rem' }}
                    onChange={(event) => {
                      setLastname(event.target.value);
                    }}
                  />
                  <TextField
                    variant="standard"
                    label="Mot de passe"
                    placeholder="Entrez votre nom de passe"
                    name="password"
                    autoComplete="off"
                    sx={{ width: '100%', mb: '1rem' }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}>
                            {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    type={isPasswordVisible === false ? 'password' : 'text'}
                    error={isPasswordValid === false}
                    helperText={
                      <PasswordMessagesDisplayer
                        isErrors={!isPasswordValid}
                        badLengthMessage={passwordMessages.badLength}
                        missingDigitsMessage={passwordMessages.missingDigits}
                      />
                    }
                    InputLabelProps={{ shrink: true }}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                  <TextField
                    variant="standard"
                    label="Confirmation de mot de passe"
                    placeholder="Confirmez votre mot de passe"
                    autoComplete="off"
                    name="confirmPassword"
                    sx={{ width: '100%', mb: '1rem' }}
                    type={isConfirmationPasswordVisible === false ? 'password' : 'text'}
                    error={isPasswordMatch === false}
                    helperText={isPasswordMatch === false ? 'Les mots de passes doivent être identiques' : null}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={handleClickShowConfirmationPassword}>
                            {isConfirmationPasswordVisible ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ shrink: true }}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                    }}
                  />

                  <LanguageFilter languages={languages} language={language} setLanguage={setLanguage} sx={{ width: '100%', mb: '1rem' }} />

                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => {
                          setHasAcceptedNewsletter(!hasAcceptedNewsletter);
                        }}
                      />
                    }
                    label={<Typography variant="body2">Accepter de recevoir des nouvelles du projet 1Village</Typography>}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isCGURead}
                        onChange={() => {
                          if (!isCGURead) setIsCGUModalOpen(true);
                          else setIsCGURead(!isCGURead);
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Accepter les{' '}
                        <a href="#" style={{ textDecoration: 'underline' }} onClick={() => setIsCGUModalOpen(true)}>
                          conditions générales d&apos;utilisation
                        </a>
                      </Typography>
                    }
                  />

                  <Button
                    sx={{ paddingX: '3rem', mt: '1rem', width: '100%' }}
                    type="submit"
                    color="primary"
                    variant="outlined"
                    disabled={!isRegisterDataValid || isPending}
                  >
                    S&apos;inscrire
                  </Button>
                </Box>
                <Modal
                  open={isCGUModalOpen}
                  maxWidth="sm"
                  fullWidth
                  title="Conditions dénérales d'utilisation"
                  confirmLabel="Accepter"
                  onConfirm={() => {
                    setIsCGUModalOpen(false);
                    setIsCGURead(true);
                  }}
                  onClose={() => {
                    setIsCGUModalOpen(false);
                  }}
                  noCancelButton
                  ariaDescribedBy="cgu-desc"
                  ariaLabelledBy="cgu-title"
                >
                  <ParentsCGU />
                </Modal>
              </>
            ) : (
              <Box p={2} minHeight="280px">
                <h3>Bienvenu(e) dans un Village </h3>
                <div>Un email de confirmation viens de vous être envoyé à l&apos;adresse email indiquée.</div>
                <br />
                <div>Vous allez être redirigée vers la page de connexion...</div>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default Inscription;
