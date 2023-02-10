import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Button, Checkbox, FormControl, Grid, IconButton, InputAdornment, InputLabel, Link, MenuItem, Select, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import { KeepRatio } from '../components/KeepRatio';
import { useLanguages } from 'src/services/useLanguages';
import { useUserRequests } from 'src/services/useUsers';
import ArrowBack from 'src/svg/arrow_back.svg';
import Logo from 'src/svg/logo_1village_famille.svg';
import { UserType } from 'types/user.type';
import type { UserForm } from 'types/user.type';

const SignUpForm = () => {
  const [email, setEmail] = useState<string>('');
  const [firstname, setFirstname] = useState<string>('');
  const [isFirstnameValid, setIsFirstnameValid] = useState<boolean>(true);
  const [lastname, setLastname] = useState<string>('');
  const [isLastnameValid, setIsLastnameValid] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const passwordMessageRef = useRef<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmationPasswordVisible, setIsConfirmationPasswordVisible] = useState<boolean>(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isEmailUsed, setIsEmailUsed] = useState<boolean>(false);
  const [isCGUread, setIsCGUread] = useState<boolean>(false);
  const [IsNewsletterAccepted, setIsNewsletterAccepted] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<UserForm>({
    email: email,
    firstname: firstname,
    lastname: lastname,
    password: password,
    type: UserType.FAMILY,
  });
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState<boolean>(false);
  const [isRegisterDataValid, setIsRegisterDataValid] = useState<boolean>(false);
  const languages = useLanguages();

  const { addUser } = useUserRequests();
  const router = useRouter();

  useEffect(() => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (password !== '') {
      passwordMessageRef.current = '';
      setIsPasswordValid(false);

      if (!password.match(/\d/)) {
        passwordMessageRef.current = 'Le mot de passe doit contenir un chiffre';
      }
      if (!password.match(/[A-Z]/)) {
        if (passwordMessageRef.current) {
          passwordMessageRef.current += ' et ';
        }
        passwordMessageRef.current += ' une lettre majuscule';
      }
      if (password.length < 8) {
        if (passwordMessageRef.current) {
          passwordMessageRef.current += ' et ';
        }
        passwordMessageRef.current += 'faire au moins 8 caractères';
      }

      if (!password.match(/\d/) || !password.match(/[A-Z]/) || password.length < 8) {
        setIsPasswordValid(false);
      } else {
        setIsPasswordValid(true);
      }
    }

    if (confirmPassword !== '') {
      if (password !== confirmPassword) {
        setIsPasswordMatch(false);
      } else {
        setIsPasswordMatch(true);
      }
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
      password: password,
      type: UserType.FAMILY,
    });

    if (isCGUread && isEmailValid && isFirstnameValid && isPasswordMatch && isPasswordValid && isLastnameValid) {
      setIsRegisterDataValid(true);
    }
    if (!isCGUread || !isEmailValid || !isFirstnameValid || !isPasswordMatch || !isPasswordValid || !isLastnameValid) {
      setIsRegisterDataValid(false);
    }
  }, [
    confirmPassword,
    email,
    firstname,
    isCGUread,
    isEmailValid,
    isFirstnameValid,
    isLastnameValid,
    isPasswordMatch,
    isPasswordValid,
    isRegisterDataValid,
    lastname,
    password,
  ]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isCGUread && isEmailValid && isFirstnameValid && isPasswordMatch && isPasswordValid && isLastnameValid) {
      try {
        await addUser(newUser);
        setIsSubmitSuccessfull(true);
        setTimeout(() => {
          router.push('/');
        }, 10000);
      } catch (err) {
        setIsEmailUsed(true);
      }
    }
  };

  const handleClickShowPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleClickShowConfirmationPassword = () => {
    setIsConfirmationPasswordVisible(!isConfirmationPasswordVisible);
  };

  const passwordMessage = passwordMessageRef.current;

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
          }}
        >
          <Logo style={{ width: '11rem', height: 'auto', margin: '10px 0 5px 10px' }} />
          <h1 style={{ placeSelf: 'center' }}>Parent d&apos;élèves</h1>
          <Link
            component="button"
            variant="h3"
            onClick={() => {
              router.push('/');
            }}
            sx={{
              placeSelf: 'center end',
              marginRight: '1rem',
              fontSize: '0.875rem',
            }}
          >
            <ArrowBack /> Retour à la page de connexion
          </Link>
        </div>
        <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" minHeight="400px" className="login__container">
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
                    error={!isEmailValid || isEmailUsed}
                    helperText={isEmailUsed && 'Email déjà utilisé'}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: '30ch',
                      mb: '1rem',
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
                    error={isPasswordValid === false}
                    helperText={isPasswordValid === true ? '8 caractères minimum, une majuscule et un chiffre' : passwordMessage}
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
                  <div>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }} className="text">
                          Choix de la langue de communication
                        </p>
                        <FormControl variant="outlined" className="full-width" style={{ width: '100%', marginTop: '3.5rem', marginBottom: '0.5rem' }}>
                          <InputLabel id="demo-simple-select">Choisir</InputLabel>
                          <Select style={{ width: '100%', marginBottom: '1rem' }} label="Langues">
                            {languages.languages.map((language) => (
                              <MenuItem key={language.french} value={language.french} style={{ cursor: 'pointer' }}>
                                {language.french}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>

                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '30ch', mb: '1rem' }}>
                    <Checkbox
                      onChange={() => {
                        setIsCGUread(!isCGUread);
                      }}
                    />
                    <div style={{ fontSize: 'smaller' }}>
                      Accepter les <u>conditions générales d&apos;utilisation</u>
                    </div>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '30ch', mb: '1rem' }}>
                    <Checkbox
                      onChange={() => {
                        setIsNewsletterAccepted(!IsNewsletterAccepted);
                      }}
                    />
                    <div style={{ fontSize: 'smaller' }}>Accepter de recevoir des nouvelles du projet 1Village</div>
                  </Box>
                  <Button type="submit" color="primary" variant="outlined" disabled={!isRegisterDataValid}>
                    S&apos;inscrire
                  </Button>
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

export default SignUpForm;
