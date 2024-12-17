import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef } from 'react';

import { Box, Grid, Link, Typography } from '@mui/material';

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
    <Grid
      container
      sx={{
        height: '100vh',
        '@media (max-width: 430px) and (max-height: 580px), (max-height: 580px)': {
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
              <ArrowBack /> Retour à la page de connexion
            </Link>
          </Box>
        </Grid>

        <Grid container mt={2} py={6} bgcolor="white" borderRadius="10px">
          <Grid xs={12} mb={4} textAlign="center" width="100%">
            <Typography variant="h2">Utilisateur vérifié</Typography>
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
            <div
              className="text-center"
              style={{
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'left',
              }}
            >
              <PelicoSouriant style={{ width: '25%', height: '60%', cursor: 'pointer' }} />
              <div>Bienvenue à un 1Village</div>
              <br />
              <div>Vous pouvez dès à présent vous connecter à votre compte 1Village</div>
              <br />
              <div>Vous allez être redirigé(e) vers la page de connexion</div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default UserVerified;
