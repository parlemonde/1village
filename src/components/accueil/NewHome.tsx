import { useRouter } from 'next/router';
import React from 'react';

import { Box, Button, Grid, Typography } from '@mui/material';

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
interface LoginBoxProps {
  title: string;
  subTitle: string;
  route: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const LoginBox: React.FC<LoginBoxProps> = ({ title, subTitle, route, Icon }) => {
  const router = useRouter();

  return (
    <Box borderRadius="10px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Typography variant="h3" pb={2}>
        {title}
      </Typography>
      <Box width="fit-content" height="auto">
        <Icon
          style={{ width: '12rem', height: 'auto', margin: 'auto' }}
          onClick={() => {
            router.push(`/${route}`);
          }}
        />
      </Box>
      <Button
        color="primary"
        variant="outlined"
        style={{ margin: '10px 0' }}
        onClick={() => {
          router.push(`/${route}`);
        }}
      >
        {subTitle}
      </Button>
    </Box>
  );
};

export const NewHome = () => {
  return (
    <Grid
      container
      sx={{
        height: '100vh',
        '@media (max-width: 600px) and (max-height: 900px), (max-height: 600px)': {
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
          justifyContent="start"
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
            <Logo style={{ maxWidth: '160px' }} />
          </Box>
        </Grid>

        <Grid container mt={2} py={6} bgcolor="white" borderRadius="10px">
          <Grid xs={12} mb={4} textAlign="center" width="100%">
            <Typography variant="h2">Vous êtes:</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            spacing={2}
            sx={{
              borderRight: {
                xs: 'none',
                sm: '1px solid lightgray',
              },
            }}
          >
            <LoginBox title="Professeur des écoles" subTitle="1Village en classe" route="login" Icon={School} />
          </Grid>

          <Box
            component="hr"
            sx={{
              width: '80%',
              margin: ' 1rem auto',
              background: 'lightgray',
              opacity: '0.5',
              display: {
                xs: 'block',
                sm: 'none',
              },
            }}
          ></Box>

          <Grid item xs={12} sm={6} spacing={2}>
            <LoginBox title="Parent d'élève" subTitle="1Village en famille" route="connexion" Icon={Home} />
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};
