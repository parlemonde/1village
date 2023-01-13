import { Button } from '@mui/material';
import React from 'react';

import { KeepRatio } from '../KeepRatio';
import type { SetPageProps } from './NewHome';
import Home from 'src/svg/home.svg';
import Logo from 'src/svg/logo_1village.svg';
import School from 'src/svg/school.svg';

export const TeacherOrParent = ({ page, setPage }: SetPageProps) => {
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
        <Logo style={{ width: '9rem', height: 'auto', margin: '10px 0 5px 10px' }} />
        <h1 style={{ placeSelf: 'center' }}>Vous êtes...</h1>
      </div>
      <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" minHeight="400px" className="login__container">
        <div className="text-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', placeItems: 'center' }}>
          {/* Block Teacher */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '300px' }}>
            <h2>Professeur des écoles</h2>
            <School style={{ width: '15rem', height: 'auto', margin: 'auto' }} />
            <Button
              color="primary"
              variant="outlined"
              style={{ marginTop: '0.8rem' }}
              onClick={() => {
                setPage({
                  ...page,
                  intro: false,
                  teacher: true,
                });
              }}
            >
              1Village en classe
            </Button>
          </div>
          {/* Block Parent */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '300px' }}>
            <h2>Parent d&apos;élève</h2>
            <Home style={{ width: '15rem', height: 'auto', margin: '74px auto 4px' }} />
            <Button
              color="primary"
              variant="outlined"
              style={{ marginTop: '0.8rem' }}
              onClick={() => {
                setPage({
                  ...page,
                  intro: false,
                  parent: true,
                });
              }}
            >
              1Village en famille
            </Button>
          </div>
        </div>
      </KeepRatio>
    </>
  );
};
