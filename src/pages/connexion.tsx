import { useRouter } from 'next/router';
import React from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, Checkbox, FormControl, FormControlLabel, IconButton, Input, InputAdornment, InputLabel, Link, TextField } from '@mui/material';

import { KeepRatio } from '../components/KeepRatio';
import { isRedirectValid } from '../components/accueil/NewHome';
import { UserContext } from 'src/contexts/userContext';
import { useUserRequests } from 'src/services/useUsers';
import ArrowBack from 'src/svg/arrow_back.svg';
import Logo from 'src/svg/logo_1village_famille.svg';

const SignInParent = () => {
  const router = useRouter();
  const { login } = React.useContext(UserContext);
  const [showPassword, setShowPassword] = React.useState(false);
  const redirect = React.useRef<string>('/');
  //Doc : https://devtrium.com/posts/react-typescript-how-to-type-hooks
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const rememberRef = React.useRef<HTMLInputElement>();
  const [errorCode, setErrorCode] = React.useState(-1);
  const [isError, setIsError] = React.useState<boolean>(false);
  const [isEmailError, setIsEmailError] = React.useState<boolean>(false);
  const [isEmailSent, setIsEmailSent] = React.useState<boolean>(false);

  const { resendVerificationEmail } = useUserRequests();

  const errorMessages: {
    [key: number]: string;
  } = {
    0: 'Une erreur inconnue est survenue. Veuillez réessayer plus tard...',
    1: 'Identifiants invalides',
    3: 'Compte bloqué',
    20: 'Compte non verifié - Veuillez consulter vos emails',
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailRef.current === null || passwordRef.current === null || rememberRef.current === undefined) return; //This is for Typescript compiler but useless alone
    if (emailRef.current.value === '' || passwordRef.current.value === '') return; //This is to unabled submit if no data
    login(emailRef.current.value, passwordRef.current.value, rememberRef.current.checked)
      .then((response) => {
        if (response.success) {
          router.push(isRedirectValid(redirect.current) ? redirect.current : '/');
          setIsError(false);
        } else {
          setErrorCode(response.errorCode || 1);
          setIsError(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
            <Logo style={{ width: '11rem', height: 'auto', margin: '10px 0 5px 10px' }} />
          </Link>
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
            <ArrowBack /> Village en classe
          </Link>
        </div>
        <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" minHeight="400px" className="login__container">
          <div className="text-center" style={{ marginTop: '2rem', margin: 'auto' }}>
            <h2>Se connecter</h2>
            <form onSubmit={handleSubmit} id="myForm" className="login__form">
              <TextField
                variant="standard"
                label="Adresse email"
                placeholder="Entrez votre adresse email"
                name="username"
                error={isError}
                InputLabelProps={{ shrink: true }}
                inputRef={emailRef}
                onChange={() => (errorCode !== -1 ? setErrorCode(-1) : null)} //reset error code
                sx={{
                  width: '30ch',
                  mb: '1rem',
                }}
              />
              <FormControl sx={{ width: '30ch', mb: 1 }} variant="standard">
                <InputLabel htmlFor="password" error={errorCode === 1}>
                  Mot de passe
                </InputLabel>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  inputRef={passwordRef}
                  placeholder="Entrez votre mot de passe"
                  error={isError}
                  onChange={() => (errorCode !== -1 ? setErrorCode(-1) : null)} //reset error code
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <small style={{ color: 'tomato', fontWeight: 'bold' }}>{isError ? errorMessages[errorCode] : null}</small>
              {errorCode === 3 && (
                <small
                  onClick={() => {
                    router.push('/reset-password');
                  }}
                  style={{ color: 'blue', textDecoration: 'underline' }}
                >
                  mot de passe oublié
                </small>
              )}
              {errorCode === 1 ||
                (errorCode === 2 && (
                  <small
                    onClick={() => {
                      router.push('/reset-password');
                    }}
                    style={{ color: 'tomato', fontWeight: 'bold' }}
                  >
                    identifiants invalides
                  </small>
                ))}
              <small
                style={!isEmailSent ? { color: 'blue', textDecoration: 'underline' } : {}}
                onClick={async () => {
                  if (emailRef?.current?.value) {
                    try {
                      await resendVerificationEmail(emailRef?.current?.value);
                      setIsEmailSent(true);
                    } catch (err) {
                      setIsEmailError(true);
                      setIsEmailSent(false);
                    }
                  }
                }}
              >
                {errorCode === 20 && !isEmailSent ? `Je n'ai pas reçu d'email : cliquer ici` : null}
                {errorCode === 20 && isEmailSent ? `Email envoyé` : null}
              </small>

              {isEmailError && <small style={{ color: 'tomato', fontWeight: 'bold' }}>Email incorrect</small>}
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ margin: 'auto', display: 'grid', gridTemplateColumns: 'max-content 1fr', alignItems: 'center' }}>
                <FormControlLabel
                  label="Se souvenir de moi"
                  inputRef={rememberRef}
                  sx={{
                    cursor: 'pointer',
                    '& .MuiTypography-root': {
                      fontSize: '0.75rem',
                      ml: '-7px',
                    },
                  }}
                  control={<Checkbox color="primary" size="small" />}
                />
                <Link
                  component="button"
                  variant="caption"
                  onClick={() => {
                    router.push('/reset-password');
                  }}
                  sx={{
                    display: 'inline-block',
                    lineHeight: '1.5',
                    justifySelf: 'end',
                    textDecoration: 'underline',
                  }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button form="myForm" type="submit" color="primary" variant="outlined" style={{ marginTop: '0.8rem', margin: 'auto' }}>
                Se connecter
              </Button>
            </div>

            <Link
              component="button"
              variant="h3"
              onClick={() => {
                router.push('/inscription');
              }}
              sx={{
                fontSize: '0.875rem',
                mt: 2,
              }}
            >
              Créer un compte
            </Link>
          </div>
        </KeepRatio>
      </div>
    </>
  );
};

export default SignInParent;
