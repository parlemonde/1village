import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, Checkbox, IconButton, InputAdornment, Link, TextField } from '@mui/material';

import { KeepRatio } from '../components/KeepRatio';
import { isPasswordValid, isEmailValid } from '../utils/accountChecks';
import LanguageFilter from 'src/components/LanguageFilter';
import { useLanguages } from 'src/services/useLanguages';
import { useUserRequests } from 'src/services/useUsers';
import ArrowBack from 'src/svg/arrow_back.svg';
import Logo from 'src/svg/logo_1village_famille.svg';
import { UserType } from 'types/user.type';
import type { UserForm } from 'types/user.type';

const Inscription = () => {
  const [email, setEmail] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');
  const [isFirstnameValid, setIsFirstnameValid] = useState<boolean>(true);
  const [lastname, setLastname] = useState<string>('');
  const [isLastnameValid, setIsLastnameValid] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordValidState, setIsPasswordValidState] = useState<boolean>(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true);
  const [isPasswordIdenticalToEmail, setisPasswordIdenticalToEmail] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmationPasswordVisible, setIsConfirmationPasswordVisible] = useState<boolean>(false);
  const [isEmailValidState, setIsEmailValidState] = useState<boolean>(true);
  const [isEmailUsed, setIsEmailUsed] = useState<boolean>(false);
  const [isCGUread, setIsCGUread] = useState<boolean>(false);
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
  const { languages } = useLanguages();

  const { addUser, resendVerificationEmail } = useUserRequests();
  const router = useRouter();

  const ERROR_MSG = {
    PWD_MATCH_MAIL: "Le mot de passe ne peut pas être identique à l'email",
    INVALID_PWD:
      'Votre mot de passe doit contenir faire un minimum de 12 caractères, contenir un chiffre et une lettre majuscules et un caractère spécial',
    INVALID_EMAIL: "L'email n'est pas au format valide ",
  };
  useEffect(() => {
    if (password.length !== 0) setIsPasswordValidState(isPasswordValid(password));

    if (confirmPassword !== '') {
      if (password !== confirmPassword) {
        setIsPasswordMatch(false);
      } else {
        setIsPasswordMatch(true);
      }
    }
    if (email.length !== 0) {
      setIsEmailValidState(isEmailValid(email));
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
    if (email !== '' && password !== '') {
      // Ajout de cette fonctionnalité pour vérifier si l'email est égal au mot de passe
      if (email === password) {
        setisPasswordIdenticalToEmail(true);
      } else {
        setisPasswordIdenticalToEmail(false);
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
      isCGUread &&
      isEmailValidState &&
      isFirstnameValid &&
      isPasswordMatch &&
      isPasswordValidState &&
      isLastnameValid &&
      !isPasswordIdenticalToEmail &&
      firstname.length !== 0 &&
      lastname.length !== 0 &&
      isPasswordValid(password) &&
      isPasswordValid(confirmPassword) &&
      isEmailValid(email)
    ) {
      setIsRegisterDataValid(true);
    }
    if (
      !isCGUread ||
      !isEmailValidState ||
      !isFirstnameValid ||
      !isPasswordMatch ||
      !isPasswordValidState ||
      isPasswordIdenticalToEmail || // Changement
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
    isCGUread,
    isEmailValidState,
    isFirstnameValid,
    isLastnameValid,
    isPasswordMatch,
    isPasswordValidState,
    isPasswordIdenticalToEmail, // Changement
    isRegisterDataValid,
    lastname,
    password,
    hasAcceptedNewsletter,
    language,
  ]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      isCGUread &&
      isEmailValidState &&
      isFirstnameValid &&
      isPasswordMatch &&
      isPasswordValidState &&
      isLastnameValid &&
      !isPasswordIdenticalToEmail
    ) {
      try {
        await addUser(newUser);
      } catch (err) {
        setIsEmailUsed(true);
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
    <>
      <div className="bg-gradiant" style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            background: 'white',
            width: '95%',
            maxWidth: '1200px',
            borderRadius: '10px',
            marginBottom: '2rem',
            alignItems: 'center',
          }}
        >
          <Link
            component="button"
            variant="h3"
            onClick={() => {
              router.push('/');
            }}
            sx={{
              placeSelf: 'flex-start',
              marginRight: '1rem',
              fontSize: '0.875rem',
            }}
          >
            <Logo style={{ width: '10.563rem', height: 'auto', margin: '10px 0 5px 10px' }} />
          </Link>
          <h1 style={{ placeSelf: 'center' }}>Créer un compte</h1>
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
        </div>
        <KeepRatio ratio={0.55} width="95%" maxWidth="1200px" minHeight="600px" className="register__container">
          <div className="text-center" style={{ marginTop: '2rem', margin: 'auto' }}>
            {!isSubmitSuccessfull ? (
              <>
                <h2>Créer un compte</h2>
                <form onSubmit={handleSubmit} className="login__form">
                  <TextField
                    variant="standard"
                    label="Adresse email"
                    placeholder="Entrez votre adresse email"
                    name="email"
                    error={!isEmailValidState || isEmailUsed}
                    helperText={isEmailUsed && isEmailValidState ? 'Email déjà utilisé' : !isEmailValidState ? ERROR_MSG.INVALID_EMAIL : ''}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: '30ch',
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
                      width: '30ch',
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
                    sx={{
                      width: '30ch',
                      mb: '1rem',
                    }}
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
                    error={isPasswordValidState === false || isPasswordIdenticalToEmail === true}
                    helperText={isPasswordIdenticalToEmail ? ERROR_MSG.PWD_MATCH_MAIL : isPasswordValidState ? '' : ERROR_MSG.INVALID_PWD}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: '30ch',
                      mb: '1rem',
                    }}
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
                    sx={{
                      width: '30ch',
                      mb: '1rem',
                    }}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                    }}
                  />

                  <LanguageFilter languages={languages} language={language} setLanguage={setLanguage} sx={{ width: '30ch', mb: '1rem' }} />

                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '30ch', mb: '0.5rem' }}>
                    <Checkbox
                      sx={{ margin: '0', padding: '0' }}
                      onChange={() => {
                        setHasAcceptedNewsletter(!hasAcceptedNewsletter);
                      }}
                    />
                    <div
                      style={{
                        fontSize: 'small',
                        margin: '0',
                        padding: '0',
                        textAlign: 'left',
                        maxWidth: '100ch',
                        flexShrink: 0,
                      }}
                    >
                      Accepter de recevoir des nouvelles du projet 1Village
                    </div>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '30ch', mb: '0.5rem' }}>
                    <Checkbox
                      sx={{ margin: '0', padding: '0' }}
                      onChange={() => {
                        setIsCGUread(!isCGUread);
                      }}
                    />
                    <div
                      style={{
                        fontSize: 'small',
                        margin: '0',
                        padding: '0',
                        textAlign: 'left',
                        maxWidth: '100ch',
                        flexShrink: 0,
                      }}
                    >
                      Accepter les <u>conditions générales d&apos;utilisation **</u>
                    </div>
                  </Box>
                  <div className="register__button">
                    <Button sx={{ paddingX: '3rem' }} type="submit" color="primary" variant="outlined" disabled={!isRegisterDataValid}>
                      {"S'inscrire"}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3>Bienvenu(e) dans un Village </h3>
                <div>Un email de confirmation viens de vous être envoyé à l&apos;adresse email indiquée.</div>
                <br />
                <div>Vous allez être redirigée vers la page de connexion.</div>
              </>
            )}
          </div>
        </KeepRatio>
      </div>
    </>
  );
};

export default Inscription;
