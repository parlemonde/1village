import Image from 'next/image';
import Link from 'next/link';
import router from 'next/router';
import React from 'react';
import ReactPlayer from 'react-player';

import { Button, Paper } from '@mui/material';

import { titles, REACTIONS, icons } from '../utils';
import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';
import { isReaction } from 'src/activity-types/anyActivity';
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

// TODO : Remove all ts-ignore when mimic is standardized

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

  const typeOfGame = TYPE_OF_GAME[gameType];
  const path = `/creer-un-jeu/${typeOfGame}/jouer/${activity.id}`;

  // eslint-disable-next-line
  // @ts-ignore
  const media = activity.content.game.video || '';
  // eslint-disable-next-line
  // @ts-ignore
  const responseToDisplay = activity.content.game.signification.toLowerCase() || '';
  // eslint-disable-next-line
  // @ts-ignore
  const origine = activity.content.game.origine || '';
  // eslint-disable-next-line
  // @ts-ignore
  const language = activity.content.language || '';
  // eslint-disable-next-line
  // @ts-ignore
  const monney = activity.content.monney || '';

  return (
    <>
      {activity.subType === 1 || activity.subType === 2 || activity.subType === 0 ? (
        <div>
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
              border: activity?.isPinned ? `2px solid ${primaryColor}` : undefined,
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
                    // eslint-disable-next-line
                    // @ts-ignore
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
                  <p className="text text--small">Publié le {toDate(activity.publishDate as string)} </p>
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
                    <>
                      {' '}
                      {activity.subType === 0 && <ReactPlayer width="100%" height="100%" light url={media} style={{ backgroundColor: 'black' }} />}
                      {activity.subType === 1 && <Image layout="fill" objectFit="contain" src={media} unoptimized />}
                      {activity.subType === 2 && <Image layout="fill" objectFit="contain" src={media} unoptimized />}
                    </>
                  ) : (
                    <>
                      {activity.subType === 0 && (
                        <Link href={path} passHref>
                          <ReactPlayer width="100%" height="100%" light url={media} />
                        </Link>
                      )}
                      {activity.subType === 1 && (
                        <Link href={path} passHref>
                          <Image layout="fill" objectFit="contain" src={media} unoptimized />
                        </Link>
                      )}
                      {activity.subType === 2 && (
                        <Link href={path} passHref>
                          <Image layout="fill" objectFit="contain" src={media} unoptimized />
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
                <p style={{ marginBottom: '2rem' }}>Vous avez créé un jeu des {typeOfGame}s</p>
                {activity.subType === 0 && (
                  <p>
                    <br />
                    {origine.lenght > 1 && <span>Et voici son origine : {origine}</span>}
                  </p>
                )}
                {activity.subType === 1 && (
                  <p>
                    Votre jeu a été crée en utilisant la monnaie : {monney} et vous avez choisi de faire deviner combien coute cet objet :{' '}
                    {responseToDisplay}
                  </p>
                )}
                {activity.subType === 2 && (
                  <p>
                    Votre jeu a été crée en utilisant la langue : {language} et vous avez choisi de faire deviner cette expression :{' '}
                    {responseToDisplay} <br />
                    {origine.lenght > 1 && <span>Et voici la traduction : {origine}</span>}
                  </p>
                )}
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
                        {activity.subType !== 1 && activity.subType !== 2 && activity.subType !== 0 && (
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
        </div>
      ) : null}
    </>
  );
};
