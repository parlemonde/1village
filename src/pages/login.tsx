import { useRouter } from 'next/router';
import qs from 'query-string';
import React from 'react';

import { Backdrop, Button, CircularProgress, Link, Tooltip } from '@mui/material';

import { KeepRatio } from '../components/KeepRatio';
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
    <>
      <div className="bg-gradiant" style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            background: 'white',
            width: '95%',
            height: '50px',
            maxWidth: '1200px',
            borderRadius: '10px',
            marginBottom: '2rem',
          }}
        >
          {' '}
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
          <h1 style={{ placeSelf: 'center' }}>Professeurs des écoles</h1>
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
        </div>
        <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" minHeight="400px" className="login__container">
          <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
            <iframe
              src="https://player.vimeo.com/video/868665438"
              width="640"
              height="360"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{ height: '65%', width: '80%' }}
            ></iframe>
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
        </KeepRatio>
        <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
};

export default SignInTeacher;
