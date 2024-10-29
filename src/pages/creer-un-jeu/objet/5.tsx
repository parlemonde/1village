import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import { Button, Tooltip, Backdrop, CircularProgress } from '@mui/material';

import { postGameDataMonneyOrExpression } from 'src/api/game/game.post';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import CreateGame from 'src/components/game/CreateGame';
import Previsualisation from 'src/components/game/Previsualisation';
import { GameContext } from 'src/contexts/gameContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { getUserDisplayName } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import type { StepsTypes, GameDataMonneyOrExpression } from 'types/game.type';
import { GameType } from 'types/game.type';
import { UserType } from 'types/user.type';

const MonnaieStep5 = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const isObservator = user?.type === UserType.OBSERVATOR;
  const { selectedPhase } = React.useContext(VillageContext);
  const labelPresentation = user ? getUserDisplayName(user, false) : '';
  const [isLoading, setIsLoading] = React.useState(false);

  const { inputSelectedValue } = useContext(GameContext);
  const { gameConfig } = useContext(GameContext);

  const onPublish = async () => {
    /* const data: GameDataMonneyOrExpression = {
      userId: user?.id || 0,
      villageId: village?.id || 0,
      type: ActivityType.GAME,
      subType: GameType.MONEY,
      game1: {
        game: gameConfig[1],
        monney: inputSelectedValue,
        labelPresentation: labelPresentation,
        radio: gameConfig?.[0]?.[1]?.inputs?.[0]?.selectedValue,
      },
      game2: {
        game: gameConfig[2],
        monney: inputSelectedValue,
        labelPresentation: labelPresentation,
        radio: gameConfig?.[0]?.[1]?.inputs?.[0]?.selectedValue,
      },
      game3: {
        game: gameConfig[3],
        monney: inputSelectedValue,
        labelPresentation: labelPresentation,
        radio: gameConfig?.[0]?.[1]?.inputs?.[0]?.selectedValue,
      },
      selectedPhase: selectedPhase,
    };*/

    setIsLoading(true);
    //await postGameDataMonneyOrExpression(data);
    localStorage.removeItem('gameConfig');
    router.push('/creer-un-jeu/objet/success');
    setIsLoading(false);
  };

  function validateGameConfig(gameConfig: StepsTypes[][]) {
    let isValidGame = true;

    function isEmptyOrSpaces(str: string | undefined) {
      return str === null || str === undefined || str.match(/^ *$/) !== null;
    }

    gameConfig.forEach((group) => {
      group.forEach((item) => {
        if (item.inputs) {
          item.inputs.forEach((input) => {
            if (input.required && (isEmptyOrSpaces(input.selectedValue) || !input.selectedValue)) {
              isValidGame = false;
            }
          });
        }
      });
    });

    return isValidGame;
  }

  const isValidGame = validateGameConfig(gameConfig);
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[inputSelectedValue || 'Monnaie', 'Objet 1', 'Objet 2', 'Objet 3', 'Prévisualisation']}
          urls={['/creer-un-jeu/objet/1', '/creer-un-jeu/objet/2', '/creer-un-jeu/objet/3', '/creer-un-jeu/objet/4', '/creer-un-jeu/objet/5']}
          activeStep={4}
        />
        <CreateGame stepNumber={4} />
        <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
          {isObservator ? (
            <Tooltip title="Action non autorisée" arrow>
              <span>
                <Button variant="outlined" color="primary" disabled>
                  Publier
                </Button>
              </span>
            </Tooltip>
          ) : (
            <>
              <Button variant="outlined" color="primary" onClick={onPublish} disabled={!isValidGame}>
                Publier
              </Button>
              {!isValidGame ? <p style={{ color: 'red' }}>Vérifiez tous vos champs s&apos;il vous plaît.</p> : null}
            </>
          )}
        </div>
        <Previsualisation baseUrl={'/creer-un-jeu/objet/'} />
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default MonnaieStep5;
