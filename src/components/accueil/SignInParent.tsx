import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, Checkbox, FormControl, FormControlLabel, IconButton, Input, InputAdornment, InputLabel, Link, TextField } from '@mui/material';
import React from 'react';

import { KeepRatio } from '../KeepRatio';
import type { SetPageProps } from './NewHome';
import { UserContext } from 'src/contexts/userContext';
import ArrowBack from 'src/svg/arrow_back.svg';
import Logo from 'src/svg/logo_1village_famille.svg';

export const SignInParent = ({ page, setPage }: SetPageProps) => {
  const { login } = React.useContext(UserContext);
  const [showPassword, setShowPassword] = React.useState(false);
  //Doc : https://devtrium.com/posts/react-typescript-how-to-type-hooks
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const rememberRef = React.useRef<HTMLInputElement>();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailRef.current === null || passwordRef.current === null || rememberRef.current === undefined) return; //This is for Typescript compiler but useless alone
    if (emailRef.current.value === '' || passwordRef.current.value === '') return; //This is to unabled submit if no data
    login(emailRef.current.value, passwordRef.current.value, rememberRef.current.checked);
  };

  return (
    <>
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
            setPage({
              ...page,
              parent: false,
              teacher: true,
            });
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
          <form onSubmit={handleSubmit} className="login__form">
            <TextField
              variant="standard"
              label="Adresse email"
              placeholder="Entrez votre adresse email"
              name="username"
              // error={errorCode === 1}
              // helperText={errorCode === 1 ? errorMessages[1] : null}
              InputLabelProps={{ shrink: true }}
              inputRef={emailRef}
              sx={{
                width: '30ch',
                mb: '1rem',
              }}
            />
            <FormControl sx={{ width: '30ch', mb: 1 }} variant="standard">
              <InputLabel htmlFor="password">Mot de passe</InputLabel>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                inputRef={passwordRef}
                placeholder="Entrez votre mot de passe"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <FormControlLabel
                label="Se souvenir de moi"
                inputRef={rememberRef}
                sx={{
                  cursor: 'pointer',
                  placeSelf: 'center start',
                  '& .MuiTypography-root': {
                    fontSize: '0.75rem',
                    ml: '-7px',
                  },
                }}
                control={
                  <Checkbox
                    color="primary"
                    size="small"
                    onChange={() => {
                      console.info('Check');
                      // setUser((u) => ({ ...u, remember: !u.remember }));
                    }}
                  />
                }
              />
              <Link
                component="button"
                variant="caption"
                onClick={() => {
                  console.info("I'm a button.");
                }}
                sx={{
                  placeSelf: 'center',
                }}
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Button type="submit" color="primary" variant="outlined" style={{ marginTop: '0.8rem' }}>
              Se connecter
            </Button>
          </form>
          <Link
            component="button"
            variant="h3"
            onClick={() => {
              console.info("I'm a button.");
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
    </>
  );
};
