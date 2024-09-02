import { useRouter } from 'next/router';
import qs from 'query-string';
import React from 'react';

import { Backdrop, Box, Button, CircularProgress, Grid, Link, Tooltip, Typography } from '@mui/material';

import { isRedirectValid } from '../components/accueil/NewHome';
import { UserContext } from 'src/contexts/userContext';
import ArrowBack from 'src/svg/arrow_back.svg';
import Logo from 'src/svg/logo_1village_classe.svg';
import { onLoginSSO, SSO_HOST, CLIENT_ID } from 'src/utils/sso';

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
        '@media (max-width: 500px) and (max-height: 750px), (max-height: 750px)': {
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
              <ArrowBack /> Village en famille
            </Link>
          </Box>
        </Grid>

        <Grid container mt={2} py={6} bgcolor="white" borderRadius="10px">
          <Grid xs={12} mb={4} textAlign="center" width="100%">
            <Typography variant="h2">Professeurs des écoles</Typography>
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
            <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                component="iframe"
                src="https://player.vimeo.com/video/868665438"
                width="100%"
                height={{
                  xs: '100%',
                  sm: '360px',
                }}
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
              {SSO_HOST.length && CLIENT_ID ? (
                <Button color="primary" variant="outlined" style={{ marginTop: '0.8rem' }} onClick={onLoginSSO}>
                  Se connecter
                </Button>
              ) : (
                <Tooltip title="Vous devez posséder un compte enseignant pour vous connecter" arrow>
                  <span>
                    <Button color="primary" variant="outlined" style={{ marginTop: '0.8rem' }} disabled>
                      Se connecter
                    </Button>
                  </span>
                </Tooltip>
              )}
              <Link
                href="https://prof.parlemonde.org/1village/"
                rel="noreferrer"
                target="_blank"
                underline="none"
                sx={{
                  fontSize: '0.875rem',
                  mt: 2,
                  fontWeight: 'bold',
                }}
              >
                S&apos;inscrire
              </Link>

              {/* Bloc error text */}
              <small style={{ color: 'tomato', fontWeight: 'bold' }}>
                {errorCode !== -1 ? errorMessages[errorCode as 0] || errorMessages[0] : null}
              </small>
            </div>

            <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default SignInTeacher;
