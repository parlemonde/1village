import { Button, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';

import { EditButton } from 'src/components/buttons/EditButton';

const TeamComments = () => {
  const [isEditMode, setIsEditMode] = useState(false);

  const [commentsValue, setCommentsValue] = useState('');
  const [tempCommentsValue, setTempCommentsValue] = useState('');
  return (
    <div className="account__panel">
      <Stack flexDirection="row" justifyContent="space-between" alignItems="center" p={2}>
        <h2>Commentaires de l&apos;équipe :</h2>
        {isEditMode ? (
          <div>
            <Button
              color="inherit"
              size="small"
              variant="contained"
              style={{ margin: '0.5rem' }}
              onClick={() => {
                setIsEditMode(false);
                setTempCommentsValue(commentsValue);
              }}
            >
              Annuler
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              style={{ margin: '0.2rem' }}
              onClick={() => {
                setCommentsValue(tempCommentsValue);
                setIsEditMode(false);
              }}
            >
              Enregistrer
            </Button>
          </div>
        ) : (
          <EditButton onClick={() => setIsEditMode(!isEditMode)} />
        )}
      </Stack>
      <div style={{ width: '100%', textAlign: 'left' }}>
        {isEditMode ? (
          <TextField
            fullWidth
            multiline
            focused={true}
            value={isEditMode ? tempCommentsValue : commentsValue}
            onChange={(e) => setTempCommentsValue(e.target.value)}
          />
        ) : (
          <p style={{ padding: '0 10px' }}>{commentsValue}</p>
        )}
      </div>
    </div>
  );
};

export default TeamComments;
