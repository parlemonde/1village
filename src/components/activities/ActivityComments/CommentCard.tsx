import dynamic from 'next/dynamic';
import React from 'react';

import { Button, CircularProgress, Paper } from '@material-ui/core';

import { AvatarImg } from 'src/components/Avatar';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { EditButton } from 'src/components/buttons/EditButton';
import { UserContext } from 'src/contexts/userContext';
import { useCommentRequests } from 'src/services/useComments';
import { primaryColor } from 'src/styles/variables.const';
import { getUserDisplayName } from 'src/utils';
import type { Comment } from 'types/comment.type';
import { User } from 'types/user.type';

const TextEditor = dynamic(() => import('src/components/activities/content/editors/TextEditor'), { ssr: false });

interface CommentCardProps {
  activityId: number;
  comment: Comment;
  user: User | null;
}

export const CommentCard: React.FC<CommentCardProps> = ({ activityId, comment, user }: CommentCardProps) => {
  const { user: selfUser } = React.useContext(UserContext);
  const { editComment, deleteComment } = useCommentRequests(activityId);
  const [newComment, setNewComment] = React.useState('');
  const [newCommentLength, setNewCommentLength] = React.useState(0);
  const [displayEditor, setDisplayEditor] = React.useState(false);
  const [loading, setIsLoading] = React.useState(false);

  if (!user) {
    return null;
  }

  const isSelf = user && selfUser && user.id === selfUser.id;

  const onEdit = async () => {
    if (newComment.length <= 8) {
      return;
    }
    setIsLoading(true);
    await editComment(comment.id, newComment);
    setIsLoading(false);
    setDisplayEditor(false);
  };

  const onCommentChange = (value: string, length: number) => {
    setNewComment(value);
    setNewCommentLength(length);
  };

  return (
    <div className="activity__comment-container">
      <AvatarImg user={user} size="small" style={{ margin: '0.25rem' }} />
      {displayEditor && isSelf ? (
        <div style={{ flex: 1, marginLeft: '0.25rem', position: 'relative' }}>
          <TextEditor
            maxLen={400}
            value={newComment}
            onChange={onCommentChange}
            placeholder="Écrivez votre réaction ici"
            inlineToolbar
            withBorder
            noBlock
          />
          <div style={{ width: '100%', textAlign: 'right' }}>
            <span className="text text--primary">{newCommentLength}/400</span>
          </div>
          <div style={{ width: '100%', textAlign: 'right', marginTop: '0.5rem' }}>
            <Button
              size="small"
              variant="outlined"
              style={{ marginRight: '0.5rem' }}
              onClick={() => {
                setDisplayEditor(false);
              }}
            >
              Annuler
            </Button>
            <Button size="small" variant="contained" color="primary" onClick={onEdit}>
              Modifier
            </Button>
          </div>
          {loading && (
            <div className="activity__loader">
              <CircularProgress color="primary" />
            </div>
          )}
        </div>
      ) : (
        <Paper elevation={2} className="activity__comment-card">
          <span className="text text--bold">{getUserDisplayName(user, isSelf)}</span>
          <div dangerouslySetInnerHTML={{ __html: comment.text }} />
          {isSelf && (
            <div style={{ position: 'absolute', right: '0.25rem', top: '0.25rem' }}>
              <EditButton
                color="primary"
                style={{ border: `1px solid ${primaryColor}`, marginRight: '0.25rem' }}
                onClick={() => {
                  setNewComment(comment.text);
                  setDisplayEditor(true);
                }}
              />
              <DeleteButton
                color="red"
                confirmTitle="Confirmer la suppression"
                confirmLabel="Voulez vous vraiment supprimer ce commentaire ?"
                onDelete={() => {
                  deleteComment(comment.id);
                }}
              />
            </div>
          )}
        </Paper>
      )}
    </div>
  );
};
