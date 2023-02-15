import { Button, Link, TextField, Typography, Backdrop, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

import { KeepRatio } from 'src/components/KeepRatio';
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
        router.push('/');
      }, 10000);
    }
  };

  const handleLinkClick = (path: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    router.push(path);
  };

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
          }}
        >
          <Logo style={{ width: '11rem', height: 'auto', margin: '10px 0 5px 10px' }} />
          <h1 style={{ placeSelf: 'center' }}>Mot de passe oublié</h1>
          <Link
            component="button"
            variant="h3"
            onClick={() => {
              router.push('/');
            }}
            sx={{
              marginRight: '1rem',
              fontSize: '0.875rem',
            }}
          >
            <ArrowBack /> Retour à la page de connexion
          </Link>
        </div>
        <KeepRatio ratio={0.55} width="95%" maxWidth="1200px" minHeight="600px" className="register__container">
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
            {!isSuccess ? (
              <>
                <h2>Réinitialisation du mot de passe</h2>
                <br />

                <div className="text-left" style={{ width: '40%' }}>
                  Veuillez renseigner l&apos;email lié à votre compte.
                  <br />
                  Nous vous enverrons un email avec un lien qui vous permettra de réinitialiser votre mot de passe.
                </div>

                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={submit}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}
                >
                  {errorCode === 0 && (
                    <Typography variant="caption" color="error">
                      {errorMessages[0]}
                    </Typography>
                  )}
                  <br />
                  <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    <div>Email : </div>
                    <TextField
                      id="email"
                      name="email"
                      type="text"
                      color="secondary"
                      label="Adresse email"
                      value={email}
                      onChange={handleEmailInputChange}
                      variant="outlined"
                      sx={{ flexGrow: 1, marginLeft: '1rem' }}
                      error={errorCode === 1}
                      helperText={errorCode === 1 ? errorMessages[1] : null}
                    />
                    <Button type="submit" color="primary" variant="outlined" style={{ marginLeft: '1rem' }}>
                      Envoyer
                    </Button>
                  </div>
                  <br />
                  <div style={{ marginBottom: '4rem' }} className="text-center">
                    <Link href="/sign-in" onClick={handleLinkClick('/sign-in')}>
                      Retourner à la connexion
                    </Link>
                  </div>
                </form>
                <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }} open={loading}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              </>
            ) : (
              <>
                <PelicoSouriant style={{ width: '25%', height: '60%', cursor: 'pointer' }} />
                <div>Un email vient de vous être envoyé à l&apos;adresse donnée</div>
                <br />
                <div>Vous allez être redirigé(e) vers la page de connexion</div>
              </>
            )}
          </div>
        </KeepRatio>
      </div>
    </>
  );
};

export default ResetPassword;
