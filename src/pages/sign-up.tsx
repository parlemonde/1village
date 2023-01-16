import { Button, Link, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';

import { KeepRatio } from '../components/KeepRatio';
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
  // const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(true);
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [newUser, setNewUser] = useState<UserForm>({
    email: email,
    firstname: firstname,
    lastname: lastname,
    password: password,
    type: UserType.FAMILY,
  });

  const { addUser } = useUserRequests();
  const router = useRouter();

  const validate = () => {
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
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    validate();
    if (isPasswordValid && isPasswordMatch && isEmailValid) {
      addUser(newUser);
    }
  };

  const handleBlur = () => {
    validate();
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
            <h2>Créer un compte</h2>
            <form onSubmit={handleSubmit} className="login__form">
              <TextField
                variant="standard"
                label="Adresse email"
                placeholder="Entrez votre adresse email"
                name="email"
                error={!isEmailValid}
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: '30ch',
                  mb: '1rem',
                }}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                onBlur={handleBlur}
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
                onBlur={handleBlur}
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
                onBlur={handleBlur}
              />
              <TextField
                variant="standard"
                label="Mot de passe"
                placeholder="Entrez votre nom de passe"
                name="password"
                autoComplete="off"
                type="password"
                inputProps={{
                  autoComplete: 'off',
                }}
                // type={isPasswordVisible === false ? 'password' : 'text'}
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
                onBlur={handleBlur}
              />
              <TextField
                variant="standard"
                label="Confirmation de mot de passe"
                placeholder="Confirmez votre mot de passe"
                autoComplete="off"
                name="confirmPassword"
                type="password"
                inputProps={{
                  autoComplete: 'off',
                }}
                error={isPasswordMatch === false}
                helperText={isPasswordMatch === false ? 'Les mots de passes doivent être identiques' : null}
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: '30ch',
                  mb: '1rem',
                }}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
                onBlur={handleBlur}
              />
              <Button type="submit" color="primary" variant="outlined" style={{ marginTop: '0.8rem' }}>
                S&apos;inscrire
              </Button>
            </form>
          </div>
        </KeepRatio>
      </div>
    </>
  );
};

export default SignUpForm;
