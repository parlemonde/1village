import { useRouter } from 'next/router';
import qs from 'query-string';
import React from 'react';

import { Backdrop, Box, CircularProgress, Grid, Typography } from '@mui/material';

import { isRedirectValid } from '../components/accueil/NewHome';
import { UserContext } from 'src/contexts/userContext';
import Logo from 'src/svg/logo_1village_classe.svg';

const errorMessages = {
  0: 'Une erreur inconnue est survenue. Veuillez réessayer plus tard...',
  1: 'Identifiants invalides',
  2: 'Compte bloqué, trop de tentatives de connexion. Veuillez réinitialiser votre mot de passe.',
};

const SignInTeacher = () => {
  const router = useRouter();
  const { loginWithSso } = React.useContext(UserContext);
  const redirect = React.useRef<string>('/');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorCode, setErrorCode] = React.useState(-1);
  const firstCall = React.useRef(false);

  const loginSSO = React.useCallback(
    async (code: string) => {
      if (firstCall.current === false) {
        firstCall.current = true;
        setIsLoading(true);
        const response = await loginWithSso(code);
        if (response.success) {
          router.push(isRedirectValid(redirect.current) ? redirect.current : '/');
        } else {
          setErrorCode(response.errorCode || 0);
        }
        setIsLoading(false);
      }
    },
    [loginWithSso, router],
  );

  React.useEffect(() => {
    const urlQueryParams = qs.parse(window.location.search);
    try {
      redirect.current = decodeURI((urlQueryParams.redirect as string) || '/');
    } catch (e) {
      redirect.current = '/';
    }
    if (!urlQueryParams.state || !urlQueryParams.code) {
      router.push('/');
      return;
    }
    if (urlQueryParams.state && urlQueryParams.code) {
      const state = window.sessionStorage.getItem('oauth-state') || '';
      if (state === decodeURI(urlQueryParams.state as string)) {
        loginSSO(decodeURI(urlQueryParams.code as string)).catch();
      } else {
        setErrorCode(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid
      container
      sx={{
        height: '100vh',
      }}
      className="bg-gradiant-only"
      p="20px"
      alignItems="center"
      alignContent="center"
      justifyContent="center"
    >
      <Box width="100%" maxWidth="600px">
        <Grid
          item
          xs={12}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="white"
          height="fit-content"
          borderRadius="10px"
          p="2rem"
        >
          <Box
            sx={{
              width: 'fit-content',
              height: 'auto',
              textAlign: 'center',
            }}
          >
            <Logo style={{ maxWidth: '260px', marginBottom: '2rem' }} />

            {errorCode !== -1 ? (
              <div>
                <Typography variant="h3" color="error" mb={2}>
                  Erreur de connexion
                </Typography>
                <Typography color="error">{errorMessages[errorCode as 0] || errorMessages[0]}</Typography>
                <Box mt={3}>
                  <a href="/" style={{ color: '#1976d2', textDecoration: 'none' }}>
                    Retour à l'accueil
                  </a>
                </Box>
              </div>
            ) : (
              <Typography variant="h3">Connexion en cours...</Typography>
            )}
          </Box>
        </Grid>

        <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Box>
    </Grid>
  );
};

export default SignInTeacher;
