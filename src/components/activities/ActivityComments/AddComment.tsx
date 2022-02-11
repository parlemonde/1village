import dynamic from 'next/dynamic';
import React from 'react';

import { Button, CircularProgress } from '@mui/material';

import { AvatarImg } from 'src/components/Avatar';
import { UserContext } from 'src/contexts/userContext';
import { useCommentRequests } from 'src/services/useComments';
import ReactionIcon from 'src/svg/navigation/reaction-icon.svg';

const TextEditor = dynamic(() => import('src/components/activities/content/editors/TextEditor'), { ssr: false });

interface AddCommentProps {
  activityId: number;
  activityType: number;
  activityPhase: number;
}

export const AddComment = ({ activityId, activityType, activityPhase }: AddCommentProps) => {
  const { user } = React.useContext(UserContext);
  const { addComment } = useCommentRequests(activityId);
  const [newComment, setNewComment] = React.useState('');
  const [newCommentLength, setNewCommentLength] = React.useState(0);
  const [loading, setIsLoading] = React.useState(false);

  if (!user) {
    return null;
  }

  const comment = async () => {
    if (newComment.length <= 8) {
      return;
    }
    setIsLoading(true);
    await addComment(newComment);
    setIsLoading(false);
    setNewComment('');
  };

  const onCommentChange = (value: string, length: number) => {
    setNewComment(value);
    setNewCommentLength(length);
  };

  return (
    <div>
      <div className="activity__comment-container">
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <span style={{ marginLeft: '2.5rem', fontWeight: 600 }}>Publiez directement un commentaire</span>
          <div style={{ display: 'flex' }}>
            <AvatarImg user={user} size="small" style={{ margin: '0.25rem' }} noLink />
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
              <div style={{ width: '100%', textAlign: 'left' }}>
                <span className="text text--primary">{newCommentLength}/400</span>
              </div>
              <div style={{ width: '100%', textAlign: 'left', marginTop: '0.5rem' }}>
                <Button variant="outlined" color="primary" onClick={comment}>
                  Commenter
                </Button>
              </div>
            </div>
            {loading && (
              <div className="activity__loader">
                <CircularProgress color="primary" />
              </div>
            )}
          </div>
        </div>
        {activityPhase >= 2 && activityType !== 10 && (
          <div style={{ marginLeft: '1rem' }}>
            <p style={{ fontWeight: 600 }}>Ou bien réagissez en détail</p>
            <Button
              component="a"
              href={`/reagir-a-une-activite/1?responseActivityId=${activityId}&responseActivityType=${activityType}`}
              variant="outlined"
              color="primary"
              style={{ width: '100%' }}
            >
              <ReactionIcon />
              Réagir
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
