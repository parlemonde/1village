import Link from 'next/link';
import React from 'react';

import { Button, Link as RegisterLink, NoSsr, Box, TextField, Grid } from '@mui/material';

import { KeepRatio } from 'src/components/KeepRatio';
import Logo from 'src/svg/logo.svg';
import PelicoReflechit from 'src/svg/pelico/pelico_reflechit.svg';
import { SSO_HOST, CLIENT_ID, onLoginSSO } from 'src/utils/sso';

export const VideoPresentation = () => {
  const [value, setValue] = React.useState('');
  const [resolved, setResolved] = React.useState<boolean>(false);
  const [showError, setShowError] = React.useState<boolean>(false);
  // TODO: this needs to be improved so that it is a dynamic value and that the admin can change it in the future
  const keyword = 'curiosité';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onSend = () => {
    const result = value.toLowerCase().includes('curiosit') === keyword.toLowerCase().includes('curiosit');
    if (result === true) {
      setResolved(result);
    } else {
      setShowError(true);
    }
    return result;
  };

  return (
    <>
      <div className="bg-gradiant">
        <KeepRatio ratio={0.45} width="95%" maxWidth="1200px" minHeight="400px" className="login__container">
          <div className="text-center" style={{ overflow: 'auto' }}>
            {!resolved ? (
              <>
                <Logo style={{ width: '40px', height: 'auto', marginTop: '2rem' }} />
                <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '60vh' }}>
                  <p style={{ margin: '0 0 2rem 0' }}>
                    <strong>Quelle est la qualité dont vous avez besoin pour embarquer avec Pélico dans l’aventure ?</strong>
                  </p>
                  <PelicoReflechit style={{ width: '10%', height: 'auto', margin: '0 0 2rem 0' }} />
                  <Box
                    sx={{
                      display: 'flex',
                      width: 700,
                      maxWidth: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TextField
                      fullWidth
                      id="outlined-helperText"
                      value={value}
                      placeholder="Un indice : un proverbe français dit que c’est un défaut, mais pour Pelico il s’agit d’une qualité"
                      label="Indice"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={handleChange}
                      error={showError}
                      helperText={showError ? 'Ce n’est pas le bon indice' : ''}
                    />
                  </Box>
                  <Button component="a" style={{ marginTop: '1rem' }} variant="outlined" color="primary" onClick={onSend}>
                    Envoyer
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <div className="flex-center" style={{ margin: '0.8rem 0', justifyContent: 'center' }}>
                  <Logo style={{ width: '40px', height: 'auto' }} />
                  <h1 className="title" style={{ margin: '0 0 0 0.5rem' }}>
                    1Village
                  </h1>
                </div>
                <iframe
                  src="https://player.vimeo.com/video/754287113?h=181d44f047"
                  width="640"
                  height="360"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  style={{ height: '65%', width: '100%' }}
                ></iframe>
                <NoSsr>
                  {SSO_HOST.length && CLIENT_ID ? (
                    <Button color="primary" variant="outlined" style={{ marginTop: '0.8rem' }} onClick={onLoginSSO}>
                      Se connecter
                    </Button>
                  ) : (
                    <Link href="/login" passHref>
                      <Button component="a" href="/login" color="primary" variant="outlined" style={{ marginTop: '0.8rem' }}>
                        Se connecter
                      </Button>
                    </Link>
                  )}
                  <div style={{ marginTop: '0.8rem', fontSize: '14px' }}>
                    <RegisterLink href="https://prof.parlemonde.org/1village/" rel="noreferrer" target="_blank" underline="none">
                      {' '}
                      {"S'inscrire"}{' '}
                    </RegisterLink>
                  </div>
                </NoSsr>
              </>
            )}
          </div>
        </KeepRatio>
      </div>
    </>
  );
};
