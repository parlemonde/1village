import { useRouter } from 'next/router';
import React from 'react';

import { Button } from '@mui/material';

import { KeepRatio } from '../KeepRatio';
import Home from 'src/svg/home.svg';
import Logo from 'src/svg/logo_1village.svg';
import School from 'src/svg/school.svg';

export function isRedirectValid(redirect: string) {
  // inner redirection.
  if (redirect.startsWith('/')) return true;
  // external, allow only same domain.
  try {
    const url = new URL(redirect);
    return url.hostname.slice(-15) === '.parlemonde.org';
  } catch {
    return false;
  }
}

export const NewHome = () => {
  const router = useRouter();

  return (
    <div className="bg-gradiant" style={{ display: 'flex', flexDirection: 'column' }}>
      <>
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
          <Logo style={{ width: '25%', height: 'auto', margin: '0 10px', alignSelf: 'center' }} />
          <h1 style={{ placeSelf: 'center' }}>Vous êtes...</h1>
        </div>
        <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" minHeight="400px" className="login__container">
          <div className="text-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', placeItems: 'center' }}>
            {/* Block Teacher */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '300px' }}>
              <h2>Professeur des écoles</h2>
              <School
                style={{ width: '15rem', height: 'auto', margin: 'auto' }}
                onClick={() => {
                  router.push('/login');
                }}
              />
              <Button
                color="primary"
                variant="outlined"
                style={{ marginTop: '0.8rem' }}
                onClick={() => {
                  router.push('/login');
                }}
              >
                1Village en classe
              </Button>
            </div>
            {/* Block Parent */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '300px' }}>
              <h2>Parent d&apos;élève</h2>
              <Home
                style={{ width: '15rem', height: 'auto', margin: '74px auto 4px' }}
                onClick={() => {
                  router.push('/connexion');
                }}
              />
              <Button
                color="primary"
                variant="outlined"
                style={{ marginTop: '0.8rem' }}
                onClick={() => {
                  router.push('/connexion');
                }}
              >
                1Village en famille
              </Button>
            </div>
          </div>
        </KeepRatio>
      </>
    </div>
  );
};
