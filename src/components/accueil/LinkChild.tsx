import { Button, TextField } from '@mui/material';
import React from 'react';

export const LinkChild = () => {
  const hashedCodeRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hashedCodeRef.current === null) return;
    if (hashedCodeRef.current.value === '') return;

    hashedCodeRef.current.value = '';
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
