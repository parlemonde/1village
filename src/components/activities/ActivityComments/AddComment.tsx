import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';

import { Button, ButtonBase, CircularProgress, Tooltip } from '@material-ui/core';

import { AvatarImg } from 'src/components/Avatar';
import { UserContext } from 'src/contexts/userContext';
import { useCommentRequests } from 'src/services/useComments';
import TextIcon from 'src/svg/editor/text_icon.svg';
import GameIcon from 'src/svg/navigation/game-icon.svg';
import KeyIcon from 'src/svg/navigation/key-icon.svg';
import TargetIcon from 'src/svg/navigation/target-icon.svg';
import UserIcon from 'src/svg/navigation/user-icon.svg';
import { serializeToQueryUrl } from 'src/utils';
import { ActivityType } from 'types/activity.type';

const TextEditor = dynamic(() => import('src/components/activities/content/editors/TextEditor'), { ssr: false });

const Reactions = [
  {
    label: 'Texte court',
    icon: TextIcon,
    disabled: false,
    link: '',
  },
  {
    label: 'Présentation',
    icon: UserIcon,
    disabled: false,
    link: '/se-presenter/thematique/1',
  },
  {
    label: 'Énigme',
    icon: KeyIcon,
    disabled: false,
    link: '/creer-une-enigme',
  },
  {
    label: 'Défi',
    icon: TargetIcon,
    disabled: false,
    link: '/lancer-un-defi',
  },
];

interface AddCommentProps {
  activityId: number | null;
  activityType: ActivityType | null;
  label?: string;
}

export const AddComment: React.FC<AddCommentProps> = ({ activityId, activityType, label }: AddCommentProps) => {
  const { user } = React.useContext(UserContext);
  const { addComment } = useCommentRequests(activityId);
  const [newComment, setNewComment] = React.useState('');
  const [newCommentLength, setNewCommentLength] = React.useState(0);
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
    setNewComment('');
  };

  const onCommentChange = (value: string, length: number) => {
    setNewComment(value);
    setNewCommentLength(length);
  };

  return (
    <div className="activity__comment-container">
      <AvatarImg user={user} size="small" style={{ margin: '0.25rem' }} noLink />
      {displayEditor ? (
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
          <span className="text text--bold">{label || 'Réagir à cette activité par :'}</span>
          <div className="text-center">
            <div className="activity__comment-react-actions">
              {Reactions.map((R, index) =>
                index === 0 ? (
                  <ButtonBase
                    key={index}
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
                ) : !R.disabled && activityId !== null && activityType !== null ? (
                  <Link key={index} href={`${R.link}${serializeToQueryUrl({ responseActivityId: activityId, responseActivityType: activityType })}`}>
                    <ButtonBase
                      component="a"
                      href={`${R.link}${serializeToQueryUrl({ responseActivityId: activityId, responseActivityType: activityType })}`}
                      className="activity__comment-react-button"
                    >
                      <R.icon height="1.5rem" style={{ fill: 'currentcolor' }} />
                      <span className="text text--small" style={{ marginTop: '0.1rem' }}>
                        {R.label}
                      </span>
                    </ButtonBase>
                  </Link>
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
