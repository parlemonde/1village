import dynamic from 'next/dynamic';
import React from 'react';

import { Button, ButtonBase, CircularProgress, Tooltip } from '@material-ui/core';

import { UserContext } from 'src/contexts/userContext';
import { useCommentRequests } from 'src/services/useComments';
import TextIcon from 'src/svg/editor/text_icon.svg';
import EnigmeIcon from 'src/svg/navigation/enigme-icon.svg';
import GameIcon from 'src/svg/navigation/game-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import { getGravatarUrl } from 'src/utils';

const TextEditor = dynamic(() => import('../editors/TextEditor'), { ssr: false });

const Reactions = [
  {
    label: 'Texte court',
    icon: TextIcon,
  },
  {
    label: 'Présentation',
    icon: UserIcon,
  },
  {
    label: 'Énigme',
    icon: EnigmeIcon,
  },
  {
    label: 'Défi',
    icon: TargetIcon,
  },
  {
    label: 'Jeux',
    icon: GameIcon,
  },
];

interface AddCommentProps {
  activityId: number | null;
}

export const AddComment: React.FC<AddCommentProps> = ({ activityId }: AddCommentProps) => {
  const { user } = React.useContext(UserContext);
  const { addComment } = useCommentRequests(activityId);
  const [newComment, setNewComment] = React.useState('');
  const [displayEditor, setDisplayEditor] = React.useState(false);
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
    setDisplayEditor(false);
  };

  return (
    <div className="activity__comment-container">
      <img
        alt="Image de profil"
        src={getGravatarUrl(user.email)}
        width="40px"
        height="40px"
        className="activity__comment-image"
        style={{ borderRadius: '20px', margin: '0.25rem' }}
      />
      {displayEditor ? (
        <div style={{ flex: 1, marginLeft: '0.25rem', position: 'relative' }}>
          <TextEditor value={newComment} onChange={setNewComment} placeholder="Écrivez votre réaction ici" inlineToolbar withBorder noBlock />
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
            <Button size="small" variant="contained" color="primary" onClick={comment}>
              Réagir
            </Button>
          </div>
          {loading && (
            <div className="activity__loader">
              <CircularProgress color="primary" />
            </div>
          )}
        </div>
      ) : (
        <div className="activity__comment-react">
          <span className="text text--bold">Réagir à cette activité par :</span>
          <div className="text-center">
            <div className="activity__comment-react-actions">
              {Reactions.map((R, index) =>
                index === 0 ? (
                  <ButtonBase
                    className="activity__comment-react-button"
                    onClick={() => {
                      setDisplayEditor(true);
                    }}
                  >
                    <R.icon height="1.5rem" style={{ fill: 'currentcolor' }} />
                    <span className="text text--small" style={{ marginTop: '0.1rem' }}>
                      {R.label}
                    </span>
                  </ButtonBase>
                ) : (
                  <Tooltip key={index} title="Bientôt disponible" aria-label="available soon">
                    <ButtonBase className="activity__comment-react-button">
                      <R.icon height="1.5rem" style={{ fill: 'currentcolor' }} />
                      <span className="text text--small" style={{ marginTop: '0.1rem' }}>
                        {R.label}
                      </span>
                    </ButtonBase>
                  </Tooltip>
                ),
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
