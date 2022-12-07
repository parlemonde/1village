import dynamic from 'next/dynamic';
import React from 'react';

import { Button, CircularProgress, Paper } from '@mui/material';

import { AvatarImg } from 'src/components/Avatar';
import { Flag } from 'src/components/Flag';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { DeleteButton } from 'src/components/buttons/DeleteButton';
import { EditButton } from 'src/components/buttons/EditButton';
import { UserContext } from 'src/contexts/userContext';
import { useCommentRequests } from 'src/services/useComments';
import { primaryColor } from 'src/styles/variables.const';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { toDate } from 'src/utils';
import type { Activity, AnyData } from 'types/activity.type';
import type { Comment } from 'types/comment.type';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

const TextEditor = dynamic(() => import('src/components/activities/content/editors/TextEditor'), { ssr: false });

interface CommentCardProps {
  activity: Activity<AnyData>;
  comment: Comment;
  user: User | null;
}

export const CommentCard = ({ activity, comment, user }: CommentCardProps) => {
  const { user: selfUser } = React.useContext(UserContext);
  const { editComment, deleteComment } = useCommentRequests(activity.id);
  const [newComment, setNewComment] = React.useState('');
  const [newCommentLength, setNewCommentLength] = React.useState(0);
  const [displayEditor, setDisplayEditor] = React.useState(false);
  const [loading, setIsLoading] = React.useState(false);
  const isPelico = user && user.type <= UserType.MEDIATOR;

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
        <div style={{ flex: 1, marginLeft: '0.25rem', position: 'relative', minWidth: 0 }}>
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
          <UserDisplayName className="text text--bold" user={user} />
          {user.country && comment && (
            <p className="text text--small">
              Publié le {`${toDate(comment.createDate as string)}`}
              {isPelico ? (
                <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto' }} />
              ) : (
                <Flag country={user?.country.isoCode} size="small" style={{ marginLeft: '0.6rem' }} />
              )}
            </p>
          )}
          <div dangerouslySetInnerHTML={{ __html: comment.text }} className="break-long-words" />
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
