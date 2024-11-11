import { Button, Link, TextField, Typography, Backdrop, CircularProgress, Grid, Box } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

import ArrowBack from 'src/svg/arrow_back.svg';
import Logo from 'src/svg/logo_1village_famille.svg';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';
import { axiosRequest } from 'src/utils/axiosRequest';

const errorMessages = {
  0: `Une erreur inconnue s'est produite`,
  1: `L'email renseignée est incorrect`,
};

const ResetPassword: React.FunctionComponent = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>('');
  const [errorCode, setErrorCode] = React.useState<number>(-1);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleEmailInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrorCode(-1);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorCode(-1);
    setLoading(true);
    const response = await axiosRequest({
      method: 'POST',
      url: '/users/reset-password',
      data: {
        email,
      },
    });
    setLoading(false);
    if (response.error) {
      setErrorCode(response.status === 400 ? 1 : 0);
    } else {
      setTimeout(() => {
        setIsSuccess(true);
      }, 1000);

      setTimeout(() => {
        router.push('/connexion');
      }, 10000);
    }
  };

  const handleLinkClick = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(path);
  };

  return (
    <Grid
      container
      sx={{
        height: '100vh',
        '@media (max-width: 380px) and (max-height: 760px), (max-height: 600px)': {
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
              alignSelf: 'center',
              margin: {
                xs: '10px 0',
                sm: '0 10px',
              },
            }}
          >
            <Logo style={{ maxWidth: '260px' }} />
          </Box>

          <Box>
            <Link
              component="button"
              variant="h3"
              onClick={() => {
                router.push('/connexion');
              }}
              sx={{
                marginRight: '1rem',
                fontSize: '0.875rem',
                textAlign: 'end',
              }}
            >
              <ArrowBack /> Retour à la page de connexion
            </Link>
          </Box>
        </Grid>

        <Grid container mt={2} py={6} bgcolor="white" borderRadius="10px">
          <Grid xs={12} mb={4} textAlign="center" width="100%">
            <Typography variant="h2">Réinitialisation du mot de passe</Typography>
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
            {!isSuccess ? (
              <Box width="90%" maxWidth="350px" margin="0 auto">
                <Typography margin="0 auto" align="left">
                  Veuillez renseigner l&apos;email lié à votre compte.
                  <br />
                  Nous vous enverrons un email avec un lien qui vous permettra de réinitialiser votre mot de passe.
                </Typography>

                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  onSubmit={submit}
                  display="flex"
                  alignItems="center"
                  flexDirection="column"
                  margin="0 auto"
                >
                  {errorCode === 0 && (
                    <Typography variant="caption" color="error">
                      {errorMessages[0]}
                    </Typography>
                  )}

                  <Box m={2} width="100%" display="flex" justifyContent="space-around" alignItems="stretch" flexDirection="column">
                    <TextField
                      id="email"
                      name="email"
                      type="text"
                      color="secondary"
                      label="Adresse email"
                      value={email}
                      onChange={handleEmailInputChange}
                      variant="outlined"
                      error={errorCode === 1}
                      helperText={errorCode === 1 ? errorMessages[1] : null}
                      sx={{
                        flexGrow: '1',
                        margin: '1rem 0',
                      }}
                    />
                    <Button type="submit" color="primary" variant="outlined">
                      Envoyer
                    </Button>
                  </Box>

                  <br />
                  <div style={{ marginBottom: '4rem' }} className="text-center">
                    <Link href="/connexion" onClick={handleLinkClick('/connexion')}>
                      Retourner à la connexion
                    </Link>
                  </div>
                </Box>

                <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }} open={loading}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </Box>
            ) : (
              <Box textAlign="center" display="block" height="fit-content">
                <PelicoSouriant style={{ width: '100%', maxWidth: '250px', maxHeight: '250px', cursor: 'pointer' }} />
                <div>Un email vient de vous être envoyé à l&apos;adresse donnée</div>
                <br />
                <div>Vous allez être redirigé(e) vers la page de connexion...</div>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default ResetPassword;
