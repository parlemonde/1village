import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, IconButton, InputAdornment, Link, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import { KeepRatio } from '../components/KeepRatio';
import { useUserRequests } from 'src/services/useUsers';
import ArrowBack from 'src/svg/arrow_back.svg';
import Logo from 'src/svg/logo_1village_famille.svg';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';
import type { UserUpdatePassword } from 'types/user.type';

const UpdatePassword = () => {
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isConfirmationPasswordTouched, setIsConfirmationPasswordTouched] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [isSubmitSuccessfull, setIsSubmitSuccessfull] = useState<boolean>(false);
  const passwordMessageRef = useRef<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmationPasswordVisible, setIsConfirmationPasswordVisible] = useState<boolean>(false);
  const [updatedUser, setUpdatedUser] = useState<Partial<UserUpdatePassword>>({
    password: password,
  });

  const { editUserPassword } = useUserRequests();
  const router = useRouter();
  const { query } = router;
  const email = query.email ? (query.email as string) : undefined;
  const verificationHash = query.verificationHash ? (query.verificationHash as string) : undefined;

  useEffect(() => {
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

    setUpdatedUser({
      password: password,
    });
  }, [confirmPassword, isPasswordMatch, isPasswordValid, password]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPasswordMatch && isPasswordValid) {
      try {
        await editUserPassword({
          email: email,
          password: updatedUser.password,
          verificationHash: verificationHash,
        });
        setTimeout(() => {
          setIsSubmitSuccessfull(true);
        }, 1000);
        setTimeout(() => {
          router.push('/');
        }, 10000);
      } catch (err) {
        return err;
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
          <h1 style={{ placeSelf: 'center' }}>Modifier mot de passe</h1>
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
        <KeepRatio ratio={0.55} width="95%" maxWidth="1200px" minHeight="600px" className="register__container">
          <div className="text-center" style={{ marginTop: '2rem', margin: 'auto' }}>
            {!isSubmitSuccessfull ? (
              <>
                <h2>Définir un nouveau mot de passe</h2>
                <form onSubmit={handleSubmit} className="login__form">
                  <TextField
                    variant="standard"
                    label="Nouveau mot de passe"
                    placeholder="Entrez votre nouveau nom de passe"
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
                    onBlur={() => {
                      setIsPasswordTouched(true);
                    }}
                    type={!isPasswordVisible ? 'password' : 'text'}
                    error={!isPasswordValid && isPasswordTouched}
                    helperText={isPasswordValid ? '8 lettres minimum, une majuscule et un chiffre' : passwordMessage}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: '40ch',
                      mb: '1rem',
                    }}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                  <TextField
                    variant="standard"
                    label="Confirmation du nouveau mot de passe"
                    placeholder="Confirmez votre nouveau mot de passe"
                    autoComplete="off"
                    name="confirmPassword"
                    type={!isConfirmationPasswordVisible ? 'password' : 'text'}
                    error={(!isPasswordValid || !isPasswordMatch) && isConfirmationPasswordTouched}
                    helperText={!isPasswordMatch && isConfirmationPasswordTouched ? 'Les mots de passes doivent être identiques' : null}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={handleClickShowConfirmationPassword}>
                            {isConfirmationPasswordVisible ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onBlur={() => {
                      setIsConfirmationPasswordTouched(true);
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      width: '40ch',
                      mb: '1rem',
                    }}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                    }}
                  />

                  <div className="register__button">
                    <Button
                      sx={{ paddingX: '3rem' }}
                      type="submit"
                      color="primary"
                      variant="outlined"
                      disabled={!isPasswordMatch || !isPasswordValid}
                    >
                      Confirmer
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <PelicoSouriant style={{ width: '25%', height: '60%', cursor: 'pointer' }} />
                <div>Votre mot de passe à été modifié avec succès !</div>
                <br />
                <div>Vous allez être redirigé vers la page de connexion</div>
              </>
            )}
          </div>
        </KeepRatio>
      </div>
    </>
  );
};

export default UpdatePassword;
