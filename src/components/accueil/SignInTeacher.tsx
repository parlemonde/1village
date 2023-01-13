import { Button, Link } from '@mui/material';
import React from 'react';

import { KeepRatio } from '../KeepRatio';
import type { SetPageProps } from './NewHome';
import ArrowBack from 'src/svg/arrow_back.svg';
import Logo from 'src/svg/logo_1village_classe.svg';

export const SignInTeacher = ({ page, setPage }: SetPageProps) => {
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
        <Logo style={{ width: '10.563rem', height: 'auto', margin: '10px 0 5px 10px' }} />
        <h1 style={{ placeSelf: 'center' }}>Professeurs des écoles</h1>
        <Link
          component="button"
          variant="h3"
          onClick={() => {
            setPage({
              ...page,
              parent: true,
              teacher: false,
            });
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
            src="https://player.vimeo.com/video/754287113?h=181d44f047"
            width="640"
            height="360"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ height: '65%', width: '80%' }}
          ></iframe>
          <Button color="primary" variant="outlined" style={{ marginTop: '0.8rem' }}>
            Se connecter
          </Button>
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
            S&apos;inscrire
          </Link>
        </div>
      </KeepRatio>
    </>
  );
};
