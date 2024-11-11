import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

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
  const [isProgress, setIsProgress] = React.useState<boolean>(false);

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
    setIsProgress(true);
    login(emailRef.current.value, passwordRef.current.value, rememberRef.current.checked)
      .then((response) => {
        if (response.success) {
          router.push(isRedirectValid(redirect.current) ? redirect.current : '/');
          setIsError(false);
        } else {
          setErrorCode(response.errorCode || 1);
          setIsError(true);
        }
        setIsProgress(false);
      })
      .catch((error) => {
        console.error(error);
        setIsProgress(false);
      });
  };

  return (
    <Grid
      container
      sx={{
        height: '100vh',
        '@media (max-width: 500px) and (max-height: 660px), (max-height: 620px)': {
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
              margin: {
                xs: '10px 0',
                sm: '0 10px',
              },
              alignSelf: 'center',
            }}
          >
            <Logo style={{ maxWidth: '260px' }} />
          </Box>

          <Box>
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
          </Box>
        </Grid>

        <Grid container mt={2} py={6} bgcolor="white" borderRadius="10px">
          <Grid xs={12} mb={4} textAlign="center" width="100%">
            <Typography variant="h2">Famille</Typography>
          </Grid>

          <Grid item xs={12} spacing={2} textAlign="center">
            <Typography variant="h2">Se connecter</Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              id="myForm"
              display="flex"
              flexDirection="column"
              alignItems="start"
              width="90%"
              maxWidth="350px"
              mx="auto"
            >
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
                  width: '100%',
                  mb: '1rem',
                }}
              />
              <FormControl sx={{ width: '100%' }} variant="standard">
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

              <small style={{ color: 'tomato', fontWeight: 'bold', textAlign: 'left' }}>{isError ? errorMessages[errorCode] : null}</small>
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
                    style={{ color: 'tomato', fontWeight: 'bold', textAlign: 'left' }}
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

              <Button
                form="myForm"
                type="submit"
                color="primary"
                variant="outlined"
                style={{ width: '100%', margin: ' .5rem auto' }}
                disabled={isProgress}
              >
                Se connecter
              </Button>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
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
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default SignInParent;
