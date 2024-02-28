import Link from 'next/link';
import router from 'next/router';
import React, { useState, useMemo, useEffect } from 'react';
import ReactPlayer from 'react-player';

import { Button } from '@mui/material';

import { CommentIcon } from './CommentIcon';
import type { ActivityCardProps } from './activity-card.types';
import { useCountAllStandardGame } from 'src/api/game/game.getAllGames';
import { useCountAbleToPlayStandardGame } from 'src/api/game/game.getAvailable';
import { RedButton } from 'src/components/buttons/RedButton';
import { bgPage } from 'src/styles/variables.const';
import { LinkNotAllowedInPath } from 'types/activity.type';
import { GameType } from 'types/game.type';
import type { GameActivity } from 'types/game.type';

type GameCardProps = ActivityCardProps<GameActivity> & {
  gameType: GameType;
};

const TYPE_OF_GAME = {
  [GameType.MIMIC]: 'mimique',
  [GameType.MONEY]: 'objet',
  [GameType.EXPRESSION]: 'expression',
};

export const GameCard = ({ activity, isSelf, noButtons, isDraft, showEditButtons, onDelete, gameType }: GameCardProps) => {
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
      {latestGameUrl && (
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
              <Link href="/creer-un-jeu/mimique/jouer/" passHref>
                <ReactPlayer width="100%" height="100%" light url={latestGameUrl} style={{ backgroundColor: 'black' }} />
              </Link>
            )}
          </div>
        </div>
      )}
      <div style={{ margin: '0.25rem', flex: 1, minWidth: 0 }}>
        <p style={{ marginBottom: '2rem' }}>
          {labelPresentation} a relancé le jeu des {typeOfGame}s
        </p>
        <p>
          Il y a actuellement {`${totalGamesCount} ${typeOfGame}${totalGamesCount > 1 ? 's' : ''} disponible${totalGamesCount > 1 ? 's' : ''}`}.<br />
          {/* {availableGamesCount > 0
            ? ` parmi lesquels ${
                availableGamesCount > 1 ? `${availableGamesCount} viennent d'être ajoutés` : `${availableGamesCount} vient d'être ajouté`
              } et sont à découvrir !`
            : ` Il n'y a pour l'instant pas de nouvel ajout dans la catégorie des ${typeOfGame}s à découvrir.`} */}
          {availableGamesCount > 0
            ? ` Il en reste ${availableGamesCount} à découvrir.`
            : ` Il n'y a pour l'instant pas de nouvel ajout dans la catégorie des ${typeOfGame}s à découvrir.`}
        </p>

        {noButtons || (
          <div style={{ textAlign: 'right' }}>
            {!showEditButtons && (
              <>
                <CommentIcon count={activity.commentCount} activityId={activity.id} />
                <Link href={latestGameUrl} passHref>
                  <Button component="a" color="primary" variant="outlined" href="/creer-un-jeu/mimique/jouer">
                    Jouer au jeu
                  </Button>
                </Link>
              </>
            )}
            {isSelf && showEditButtons && (
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
