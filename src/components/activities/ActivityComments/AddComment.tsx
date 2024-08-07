import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';

import { Box, Button, CircularProgress, Tooltip } from '@mui/material';

import { AvatarImg } from 'src/components/Avatar';
import { UserContext } from 'src/contexts/userContext';
import { useCommentRequests } from 'src/services/useComments';
import { primaryColor, bgPage } from 'src/styles/variables.const';
import ReactionIcon from 'src/svg/navigation/reaction-icon.svg';
import RouletteIcon from 'src/svg/navigation/roulette-icon.svg';
import { ActivityType } from 'types/activity.type';
import { UserType } from 'types/user.type';

const TextEditor = dynamic(() => import('src/components/activities/content/editors/TextEditor'), { ssr: false });

interface AddCommentProps {
  activityId: number;
  activityType: number;
  activityPhase: number;
}

export const AddComment = ({ activityId, activityType, activityPhase }: AddCommentProps) => {
  const { user } = React.useContext(UserContext);
  const isObservator = user?.type === UserType.OBSERVATOR;
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
    <>
      <Box
        sx={{
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
        }}
        className="activity__comment-container"
      >
        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
            }}
          >
            <AvatarImg user={user} size="small" style={{ margin: '0.25rem' }} noLink />
            <div style={{ flex: 1, marginLeft: '0.25rem', position: 'relative', minWidth: 0 }}>
              <Box
                component="span"
                sx={{
                  fontWeight: 600,
                }}
              >
                Publiez directement un commentaire
              </Box>
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
                {isObservator ? (
                  <Tooltip title="Action non autorisée" arrow>
                    <span>
                      <Button
                        sx={{
                          width: 'inherit',
                        }}
                        variant="outlined"
                        color="primary"
                        onClick={comment}
                        disabled={isObservator}
                      >
                        Commenter
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button
                    sx={{
                      width: 'inherit',
                    }}
                    variant="outlined"
                    color="primary"
                    onClick={comment}
                    disabled={isObservator}
                  >
                    Commenter
                  </Button>
                )}
              </div>
            </div>
            {loading && (
              <div className="activity__loader">
                <CircularProgress color="primary" />
              </div>
            )}
          </Box>
        </div>
        {activityPhase >= 2 && activityType !== ActivityType.REACTION && (
          <Box
            sx={{
              marginLeft: {
                xs: '0',
                md: '1rem',
              },
            }}
          >
            {activityPhase >= 3 && (activityType === ActivityType.STORY || activityType === ActivityType.RE_INVENT_STORY) ? (
              <p style={{ fontWeight: 600 }}>Ou bien ré-écrivez l&apos;histoire !</p>
            ) : (
              <p style={{ fontWeight: 600 }}>Ou bien réagissez en détail</p>
            )}
            {activityPhase >= 3 && (activityType === ActivityType.STORY || activityType === ActivityType.RE_INVENT_STORY) ? (
              <Link href={`/re-inventer-une-histoire?activityId=${activityId}`} passHref>
                <Button
                  component="a"
                  href={`/re-inventer-une-histoire?activityId=${activityId}`}
                  variant="outlined"
                  color="primary"
                  style={{ width: '100%' }}
                >
                  <RouletteIcon
                    style={{
                      fill: primaryColor,
                      position: 'relative',
                      display: 'inline-block',
                      marginRight: '0.6rem',
                    }}
                  />
                  Ré-inventer une histoire
                </Button>
              </Link>
            ) : (
              <>
                {isObservator ? (
                  <Tooltip title="Action non autorisée" arrow>
                    <span>
                      <Button component="a" variant="outlined" color="primary" style={{ width: '100%' }} disabled={isObservator}>
                        <ReactionIcon
                          style={{
                            fill: bgPage,
                          }}
                        />
                        Réagir
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Link href={`/reagir-a-une-activite/1?responseActivityId=${activityId}&responseActivityType=${activityType}`} passHref>
                    <Button
                      component="a"
                      href={`/reagir-a-une-activite/1?responseActivityId=${activityId}&responseActivityType=${activityType}`}
                      variant="outlined"
                      color="primary"
                      style={{ width: '100%' }}
                    >
                      <ReactionIcon
                        style={{
                          fill: primaryColor,
                        }}
                      />
                      Réagir
                    </Button>
                  </Link>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};
