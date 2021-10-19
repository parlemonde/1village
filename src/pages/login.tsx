import Image from 'next/image';
import { useRouter } from 'next/router';
import qs from 'query-string';
import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { NoSsr } from '@material-ui/core';

import { KeepRatio } from 'src/components/KeepRatio';
import { UserContext } from 'src/contexts/userContext';
import Logo from 'src/svg/logo.svg';
import { SSO_HOST, SSO_HOSTNAME, CLIENT_ID, onLoginSSO } from 'src/utils/sso';

type User = {
  username: string;
  password: string;
  remember: boolean;
};

const errorMessages = {
  0: 'Une erreur inconnue est survenue. Veuillez réessayer plus tard...',
  1: 'Adresse e-mail ou pseudo invalide.',
  2: 'Mot de passe invalide.',
  3: 'Compte bloqué, trop de tentatives de connexion. Veuillez réinitialiser votre mot de passe.',
  5: `Veuillez utiliser le login avec ${SSO_HOSTNAME} pour votre compte`,
  6: 'Veuillez utiliser le login par email/mot de passe pour votre compte',
};

const isRedirectValid = (redirect: string): boolean => {
  // inner redirection.
  if (redirect.startsWith('/')) {
    return true;
  }
  // external, allow only same domain.
  try {
    const url = new URL(redirect);
    return url.hostname.slice(-15) === '.parlemonde.org';
  } catch {
    return false;
  }
};

const Login = () => {
  const router = useRouter();
  const { login, loginWithSso } = React.useContext(UserContext);
  const redirect = React.useRef<string>('/');
  const [isLoading, setIsLoading] = React.useState(false);

  const [user, setUser] = React.useState<User>({
    username: '',
    password: '',
    remember: false,
  });
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
  }, [loginSSO]);

  const updateUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((u) => ({ ...u, username: e.target.value }));
    if (errorCode === 1) {
      setErrorCode(-1);
    }
  };
  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((u) => ({ ...u, password: e.target.value }));
    if (errorCode === 1) {
      setErrorCode(-1);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await login(user.username, user.password, user.remember);
    if (response.success) {
      router.push(isRedirectValid(redirect.current) ? redirect.current : '/');
    } else {
      setErrorCode(response.errorCode || 0);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gradiant">
      <KeepRatio ratio={0.4} width="95%" maxWidth="1200px" minHeight="550px" className="login__container">
        <div className="login__panel">
          <form onSubmit={onSubmit} className="login__form">
            <div className="flex-center" style={{ marginBottom: '0.8rem' }}>
              <Logo style={{ width: '2.6rem', height: 'auto' }} />
              <h1 className="title" style={{ margin: '0 0 0 0.5rem' }}>
                1Village
              </h1>
            </div>
            <p style={{ marginBottom: '1.5rem' }}>Se connecter</p>
            {(errorCode === 0 || errorCode >= 3) && (
              <p className="text text--small text--error text-center" style={{ margin: '0 0 1rem 0' }}>
                {errorMessages[errorCode as 0] || errorMessages[0]}
              </p>
            )}
            <NoSsr>
              {SSO_HOST.length && CLIENT_ID && (
                <>
                  <div className="text-center" style={{ marginBottom: '1rem' }}>
                    <Button color="primary" variant="contained" size="small" onClick={onLoginSSO}>
                      Se connecter avec {SSO_HOSTNAME}
                    </Button>
                  </div>
                  <div className="login__divider">
                    <div className="login__or">
                      <span style={{ fontSize: '1.2rem', padding: '0.25rem', backgroundColor: 'white' }}>OU</span>
                    </div>
                  </div>
                </>
              )}
            </NoSsr>
            <TextField
              label="Adresse email"
              placeholder="Entrez votre adresse email"
              name="username"
              value={user.username}
              fullWidth
              onChange={updateUsername}
              style={{ marginBottom: '1.5rem' }}
              error={errorCode === 1}
              helperText={errorCode === 1 ? errorMessages[1] : null}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              name="password"
              type="password"
              value={user.password}
              fullWidth
              onChange={updatePassword}
              style={{ marginBottom: '0.5rem' }}
              error={errorCode === 2}
              helperText={errorCode === 2 ? errorMessages[2] : null}
              InputLabelProps={{ shrink: true }}
            />
            <div className="full-width">
              <FormControlLabel
                label="Se souvenir de moi"
                style={{ marginBottom: '0.5rem', cursor: 'pointer' }}
                control={
                  <Checkbox
                    color="primary"
                    checked={user.remember}
                    onChange={() => {
                      setUser((u) => ({ ...u, remember: !u.remember }));
                    }}
                  />
                }
              />
            </div>
            <div className="text-center" style={{ marginBottom: '0.6rem' }}>
              <Button type="submit" color="primary" variant="outlined">
                Se connecter
              </Button>
            </div>
            <div className="text-center">
              <a className="text text--small text--primary">Mot de passe oublié ?</a>
            </div>
          </form>
        </div>
        <div className="login__panel login__panel--with-blue-background" style={{ padding: '1rem' }}>
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Image src="/family_values_best_friends.png" layout="fill" objectFit="contain" alt="image de login" />
          </div>
        </div>
      </KeepRatio>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Login;
