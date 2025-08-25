import { Button, Stack, TextField, CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { lighten } from '@mui/material/styles';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import type { TeamCommentType } from '../../../../types/teamComment.type';
import { useCreateTeamComment } from 'src/api/teamComment/createTeamComment';
import { useGetTeamCommentByType } from 'src/api/teamComment/getTeamCommentByType';
import { useUpdateTeamComment } from 'src/api/teamComment/updateTeamComment';
import { EditButton } from 'src/components/buttons/EditButton';

type TypeCommentProps = {
  type: TeamCommentType;
};

const TeamCommentCard = ({ type }: TypeCommentProps) => {
  const [editMode, setEditMode] = useState(false);
  const [comment, setComment] = useState('');
  const [draftComment, setDraftComment] = useState('');
  const [commentId, setCommentId] = useState<number>();

  const { data: teamComments, isLoading } = useGetTeamCommentByType(type);

  useEffect(() => {
    const initialComment = teamComments?.[0]?.comment ?? '';
    const initialCommentId = teamComments?.[0]?.id;

    setComment(initialComment);
    setDraftComment(initialComment);
    setCommentId(initialCommentId);
  }, [teamComments]);

  const handleCancel = useCallback(() => {
    setEditMode(false);
    setDraftComment(comment);
  }, [comment]);

  const updateTeamCommentMutation = useUpdateTeamComment({
    commentId: commentId ?? 0,
    comment: draftComment,
  });

  const createTeamCommentMutation = useCreateTeamComment({
    type,
    comment: draftComment,
  });

  const handleSave = useCallback(() => {
    if (commentId) {
      updateTeamCommentMutation.mutate(undefined, {
        onSuccess: (data) => {
          setComment(data.comment);
          setEditMode(false);
        },
      });
    } else {
      createTeamCommentMutation.mutate(undefined, {
        onSuccess: (data) => {
          setComment(data.comment);
          setEditMode(false);
        },
      });
    }
  }, [commentId, updateTeamCommentMutation, createTeamCommentMutation]);

  const commentToDisplay = editMode ? draftComment : comment;
  const backgroundColor = useMemo(() => lighten('#4c3ed9', 0.95), []);

  return (
    <Box p={2} mt={2} mb={2} borderRadius={1} border={1} borderColor="divider" bgcolor={backgroundColor}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h3">Commentaire de l&apos;équipe :</Typography>
        {editMode ? (
          <Stack direction="row" spacing={2}>
            <Button size="small" color="error" variant="outlined" onClick={() => handleCancel()}>
              Annuler
            </Button>
            <Button size="small" color="primary" variant="outlined" onClick={() => handleSave()}>
              Enregistrer
            </Button>
          </Stack>
        ) : (
          <EditButton color="primary" onClick={() => setEditMode(true)} />
        )}
      </Stack>
      <Box>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <TextField
            fullWidth
            multiline
            focused={editMode}
            disabled={!editMode}
            value={commentToDisplay}
            onChange={(e) => setDraftComment(e.target.value)}
            sx={{
              '& .MuiInputBase-input.Mui-disabled': {
                color: 'rgba(0, 0, 0, 0.8)',
                WebkitTextFillColor: 'rgba(0, 0, 0, 0.8)',
              },
              '& .MuiInputBase-root': {
                backgroundColor: !editMode ? 'transparent' : 'white',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: !editMode ? 'transparent' : undefined,
                borderWidth: !editMode ? 0 : undefined,
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default TeamCommentCard;
