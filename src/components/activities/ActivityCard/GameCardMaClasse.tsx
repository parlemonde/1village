import Link from 'next/link';
import router from 'next/router';
import React, { useState, useMemo, useEffect } from 'react';
import ReactPlayer from 'react-player';

import { Button, Paper } from '@mui/material';

import { titles, REACTIONS, icons } from '../utils';
import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';
import { isReaction } from 'src/activity-types/anyActivity';
import { useCountAllStandardGame } from 'src/api/game/game.getAllGames';
import { useCountAbleToPlayStandardGame } from 'src/api/game/game.getAvailable';
import { AvatarImg } from 'src/components/Avatar';
import { Flag } from 'src/components/Flag';
import { UserDisplayName } from 'src/components/UserDisplayName';
import { RedButton } from 'src/components/buttons/RedButton';
import { useActivity } from 'src/services/useActivity';
import { bgPage, primaryColor } from 'src/styles/variables.const';
import PelicoNeutre from 'src/svg/pelico/pelico_neutre.svg';
import { toDate } from 'src/utils';
import { LinkNotAllowedInPath } from 'types/activity.type';
import { GameType } from 'types/game.type';
import type { GameActivity } from 'types/game.type';
import { UserType } from 'types/user.type';

type GameCardProps = ActivityCardProps<GameActivity> & {
  gameType: GameType;
};

const TYPE_OF_GAME = {
  [GameType.MIMIC]: 'mimique',
  [GameType.MONEY]: 'objet',
  [GameType.EXPRESSION]: 'expression',
};

export const GameCardMaClasse = ({
  activity,
  user,
  isSelf = true,
  noButtons = false,
  showEditButtons = true,
  isDraft = false,
  forComment = false,
  noMargin = false,
  onDelete = () => {},
  onSelect,
  gameType,
}: GameCardProps) => {
  const userIsPelico = (user?.type ?? UserType.MEDIATOR) <= UserType.MEDIATOR;
  const { activity: responseActivity } = useActivity(activity.responseActivityId ?? -1);
  const ActivityIcon = icons[activity.type] || null;

  const [totalGamesCount, setTotalGamesCount] = useState<number>(0);
  const [availableGamesCount, setAvailableGamesCount] = useState<number>(0);
  const { data: countAbleToPlay } = useCountAbleToPlayStandardGame(gameType, activity.villageId);
  const { data: countAllStandardGame } = useCountAllStandardGame(gameType, activity.villageId);
  const typeOfGame = TYPE_OF_GAME[gameType];
  const latestGameUrl = useMemo(() => {
    const villageId = activity.villageId;
    const type = activity.type;
    return `/creer-un-jeu/mimique/jouer/?villageId=${villageId}&type=${type}`;
  }, [activity.villageId, activity.type]);
  const path = `/creer-un-jeu/${typeOfGame}/jouer`;

  useEffect(() => {
    if (countAbleToPlay && countAllStandardGame) {
      setAvailableGamesCount(countAbleToPlay);
      setTotalGamesCount(countAllStandardGame);
    }
  }, [countAbleToPlay, countAllStandardGame, gameType]);
  const labelPresentation = activity.data.presentation || activity.data.labelPresentation;

  console.log('activity', activity);

  return (
    <>
      <Paper
        className={onSelect !== undefined ? 'activity-card--selectable' : ''}
        variant={forComment ? 'elevation' : 'outlined'}
        square={!forComment}
        elevation={forComment ? 2 : 0}
        onClick={() => {
          if (onSelect !== undefined) {
            onSelect();
          }
        }}
        style={{
          margin: noMargin || forComment ? '0' : '1rem 0',
          cursor: onSelect !== undefined ? 'pointer' : 'unset',
          border: activity?.isPinned ? `2px solid ${primaryColor}` : '10px solid red',
        }}
      >
        <div className="activity-card__header">
          <AvatarImg
            user={user}
            size="small"
            src={userIsPelico ? '/pelico-profil' : ''}
            style={{ margin: '0.25rem 0rem 0.25rem 0.25rem' }}
            noLink={noButtons}
            displayAsUser={activity.displayAsUser}
          />
          <div className="activity-card__header_info" style={forComment ? { marginLeft: '0.5rem' } : {}}>
            <p className="text">
              <UserDisplayName
                className="text"
                user={user}
                noLink={noButtons}
                displayAsUser={activity.displayAsUser}
                style={userIsPelico ? { cursor: 'pointer' } : {}}
              />
              {' a '}
              {responseActivity && isReaction(activity) ? (
                <strong>
                  {titles[activity.type]} {REACTIONS[responseActivity?.type]}
                </strong>
              ) : (
                <strong>{titles[activity.type]}</strong>
              )}
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p className="text text--small">Publié le {toDate(activity.createDate as string)} </p>
              {userIsPelico ? (
                <Link href={`/pelico-profil`}>
                  <PelicoNeutre style={{ marginLeft: '0.6rem', height: '16px', width: 'auto', cursor: 'pointer' }} />
                </Link>
              ) : (
                <Flag country={user?.country?.isoCode} size="small" style={{ marginLeft: '0.6rem' }} />
              )}
            </div>
          </div>
          {ActivityIcon && !isReaction(activity) && (
            <ActivityIcon
              style={{ fill: primaryColor, color: primaryColor, margin: '0 0.65rem', width: '2rem', height: 'auto', alignSelf: 'center' }}
            />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'flex-start' }}>
          <div style={{ width: '40%', flexShrink: 0, padding: '0.25rem' }}>
            <div
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: bgPage,
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {/* Link is disabled for reaction activity */}
              {router.pathname.includes(LinkNotAllowedInPath.REACTION) ? (
                <ReactPlayer width="100%" height="100%" light url={latestGameUrl} style={{ backgroundColor: 'black' }} />
              ) : (
                <Link href={path} passHref>
                  <ReactPlayer width="100%" height="100%" light url={latestGameUrl} style={{ backgroundColor: 'black' }} />
                </Link>
              )}
            </div>
          </div>

          <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
            <p style={{ marginBottom: '2rem' }}>Vous avez créé un jeu des {typeOfGame}s</p>
            <p>
              Il y a actuellement {`${totalGamesCount} ${typeOfGame}${totalGamesCount > 1 ? 's' : ''} disponible${totalGamesCount > 1 ? 's' : ''}`}.
              <br />
              {availableGamesCount > 0
                ? ` Il en reste ${availableGamesCount} à découvrir.`
                : ` Il n'y a pour l'instant pas de nouvel ajout dans la catégorie des ${typeOfGame}s à découvrir.`}
            </p>
            {noButtons || (
              <div style={{ textAlign: 'right' }}>
                {!showEditButtons && (
                  <>
                    <CommentIcon count={activity.commentCount} activityId={activity.id} />
                    <Link href={path} passHref>
                      <Button component="a" color="primary" variant="outlined">
                        Jouer au jeu
                      </Button>
                    </Link>
                  </>
                )}
                {isSelf && showEditButtons && (
                  <>
                    {activity.subType !== 1 && activity.subType !== 2 && (
                      <>
                        <Link
                          href={
                            isDraft && activity.data.draftUrl
                              ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                              : `/creer-un-jeu/mimique/4?activity-id=${activity.id}`
                          }
                          passHref
                        >
                          <Button
                            component="a"
                            href={
                              isDraft && activity.data.draftUrl
                                ? `${activity.data.draftUrl}?activity-id=${activity.id}`
                                : `/creer-un-jeu/mimique/4?activity-id=${activity.id}`
                            }
                            color="secondary"
                            variant="contained"
                            style={{ marginLeft: '0.25rem' }}
                          >
                            Modifier
                          </Button>
                        </Link>
                      </>
                    )}
                    <RedButton style={{ marginLeft: '0.25rem' }} onClick={onDelete}>
                      Supprimer
                    </RedButton>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Paper>
    </>
  );
};
