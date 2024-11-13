import Image from 'next/image';
import Link from 'next/link';
import router from 'next/router';
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

import { Button } from '@mui/material';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';
import { useCountAllStandardGame } from 'src/api/game/game.getAllGames';
import { useCountAbleToPlayStandardGame } from 'src/api/game/game.getCountAvailable';
import { RedButton } from 'src/components/buttons/RedButton';
import { bgPage } from 'src/styles/variables.const';
import { LinkNotAllowedInPath } from 'types/activity.type';
import { GameType } from 'types/game.type';
import type { GameActivity } from 'types/game.type';

// TODO : Remove all ts-ignore when mimic is standardized

type GameCardProps = ActivityCardProps<GameActivity> & {
  gameType: GameType;
};

const TYPE_OF_GAME = {
  [GameType.MIMIC]: 'mimique',
  [GameType.MONEY]: 'objet',
  [GameType.EXPRESSION]: 'expression',
};

const phrase = {
  [GameType.MIMIC]: {
    phrase: 'a relancé le jeu des mimiques',
  },
  [GameType.MONEY]: {
    phrase: 'a relancé le jeu de la monnaie',
  },
  [GameType.EXPRESSION]: {
    phrase: 'a relancé le jeu des expressions',
  },
};

export const GameCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete, gameType }: GameCardProps) => {
  const [totalGamesCount, setTotalGamesCount] = useState<number>(0);
  const [availableGamesCount, setAvailableGamesCount] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data: countAbleToPlay } = useCountAbleToPlayStandardGame(gameType, activity.villageId);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data: countAllStandardGame } = useCountAllStandardGame(gameType, activity.villageId);
  const typeOfGame = TYPE_OF_GAME[gameType];
  const path = `/creer-un-jeu/${typeOfGame}/displayList`;
  const displayPhrasesByType = phrase[gameType];

  useEffect(() => {
    if (countAbleToPlay && countAllStandardGame) {
      setAvailableGamesCount(countAbleToPlay);
      setTotalGamesCount(countAllStandardGame);
    }
  }, [countAbleToPlay, countAllStandardGame, gameType]);
  const labelPresentation = activity.data.presentation || activity.data.labelPresentation;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
      }}
    >
      {path && (
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
                {activity.subType === 0 && (
                  <ReactPlayer
                    width="100%"
                    height="100%"
                    light
                    // eslint-disable-next-line
                    // @ts-ignore
                    url={activity.content.game[0].inputs[0].selectedValue}
                    style={{ backgroundColor: 'black' }}
                  />
                )}
                {activity.subType === 1 && (
                  <>
                    {/* eslint-disable-next-line */}
                    {/* @ts-ignore */}
                    <Image layout="fill" objectFit="contain" src={activity.content.game[0].inputs[0].selectedValue} unoptimized />
                  </>
                )}
                {activity.subType === 2 && (
                  <>
                    {/* eslint-disable-next-line */}
                    {/* @ts-ignore */}
                    <Image layout="fill" objectFit="contain" src={activity.content.game[0].inputs[0].selectedValue} unoptimized />
                  </>
                )}
              </>
            ) : (
              <>
                {activity.subType === 0 && (
                  <Link href={path} passHref>
                    <ReactPlayer
                      width="75%"
                      height="100%"
                      light
                      // eslint-disable-next-line
                      // @ts-ignore
                      url={activity.content.game[0]?.inputs[0].selectedValue}
                      style={{ backgroundColor: 'black', margin: 'auto' }}
                    />
                  </Link>
                )}
                {activity.subType === 1 && (
                  <Link href={path} passHref>
                    {/* eslint-disable-next-line */}
                    {/* @ts-ignore */}
                    <Image layout="fill" objectFit="contain" src={activity.content.game[0].inputs[0].selectedValue} unoptimized />
                  </Link>
                )}
                {activity.subType === 2 && (
                  <Link href={path} passHref>
                    {/* eslint-disable-next-line */}
                    {/* @ts-ignore */}
                    <Image layout="fill" objectFit="contain" src={activity.content.game[0].inputs[0].selectedValue} unoptimized />
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <p style={{ marginBottom: '2rem' }}>
          {labelPresentation} {displayPhrasesByType.phrase}
        </p>
        <p>
          Il y a actuellement {`${totalGamesCount} ${typeOfGame}${totalGamesCount > 1 ? 's' : ''} disponible${totalGamesCount > 1 ? 's' : ''}`}.<br />
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
  );
};
