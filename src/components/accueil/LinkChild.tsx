import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';

export const LinkChild = () => {
  const router = useRouter();
  const { linkStudent } = React.useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const hashedCodeRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hashedCodeRef.current === null) return;
    if (hashedCodeRef.current.value === '') return;
    linkStudent(hashedCodeRef.current.value).then((response) => {
      if (response.success === false) {
        enqueueSnackbar("Le rattachement n'a pas fonctionné ! Veuillez renseigner un identifiant valide", {
          variant: 'error',
        });
      }
      enqueueSnackbar('Rattachement réalisé avec succès!', {
        variant: 'success',
      });
    });
    hashedCodeRef.current.value = '';
    setTimeout(() => {
      router.reload();
    }, 5 * 1000);
  };

  return (
    <div style={{ padding: '15px' }}>
      <h1>Ajouter ou retirer un enfant</h1>
      <p className="text">
        Votre compte n’est pour l’instant relié à aucun enfant. Pour accéder aux échanges, il vous faut ajouter l’identifiant transmis par son
        professeur.
      </p>
      <h2>Ajouter un enfant</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <TextField
          variant="standard"
          size="small"
          placeholder="Identifiant à saisir ici"
          inputRef={hashedCodeRef}
          sx={{
            marginRight: 1,
          }}
        />
        <Button type="submit" variant="outlined">
          Ajouter un enfant
        </Button>
      </form>
    </div>
  );
};
