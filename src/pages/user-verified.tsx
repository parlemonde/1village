import { Link } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef } from 'react';

import { KeepRatio } from 'src/components/KeepRatio';
import { UserContext } from 'src/contexts/userContext';
import { useUserRequests } from 'src/services/useUsers';
import ArrowBack from 'src/svg/arrow_back.svg';
import Logo from 'src/svg/logo_1village_famille.svg';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const UserVerified: React.FunctionComponent = () => {
  const router = useRouter();
  const { verifyUser } = useUserRequests();
  const timeoutRef = useRef<number | null>(null);
  const { email, verificationHash } = router.query;
  const { isLoggedIn, setUser } = useContext(UserContext);

  useEffect(() => {
    if (typeof email === 'string' && typeof verificationHash === 'string') {
      verifyUser(email, verificationHash).then(setUser).catch();
    }
  }, [email, router, setUser, verificationHash, verifyUser]);

  useEffect(() => {
    if (isLoggedIn) {
      timeoutRef.current = window.setTimeout(() => {
        router.push('/');
      }, 5000);
      return () => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }
    return () => {};
  }, [isLoggedIn, router]);

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
            alignItems: 'center',
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
            <Logo style={{ width: '10.563rem', height: 'auto', margin: '10px 0 5px 10px' }} />
          </Link>
          <h1 style={{ placeSelf: 'center' }}>Utilisateur vérifié</h1>
          <Link
            component="button"
            variant="h3"
            onClick={() => {
              router.push('/');
            }}
            sx={{
              marginRight: '1rem',
              fontSize: '0.875rem',
              textAlign: 'end',
            }}
          >
            <ArrowBack /> Retour à la page de connexion
          </Link>
        </div>
        <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" minHeight="400px" className="register__container">
          <div
            className="text-center"
            style={{
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'left', // Add this property to align the text to the left
            }}
          >
            <PelicoSouriant style={{ width: '25%', height: '60%', cursor: 'pointer' }} />
            <div>Bienvenue à un 1Village</div>
            <br />
            <div>Vous pouvez dès à présent vous connecter à votre compte 1Village</div>
            <br />
            <div>Vous allez être redirigé(e) vers la page de connexion</div>
          </div>
        </KeepRatio>
      </div>
    </>
  );
};

export default UserVerified;
