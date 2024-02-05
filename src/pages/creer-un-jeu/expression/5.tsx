import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import { Button, Tooltip, Backdrop, CircularProgress } from '@mui/material';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import CreateGame from 'src/components/game/CreateGame';
import Previsualisation from 'src/components/game/Previsualisation';
import type { StepsType } from 'src/config/games/game';
import { ActivityContext } from 'src/contexts/activityContext';
import { GameContext } from 'src/contexts/gameContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { getUserDisplayName } from 'src/utils';
import { ActivityType } from 'types/activity.type';
import { GameType } from 'types/game.type';
import { UserType } from 'types/user.type';

const ExpressionStep5 = () => {
  const router = useRouter();

  const { createNewActivity, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const isObservator = user?.type === UserType.OBSERVATOR;
  const { selectedPhase } = React.useContext(VillageContext);
  const labelPresentation = user ? getUserDisplayName(user, false) : '';
  const [isLoading, setIsLoading] = React.useState(false);

  const { inputSelectedValue } = useContext(GameContext);
  const { gameConfig } = useContext(GameContext);

  const onPublish = async () => {
    await createNewActivity(ActivityType.GAME, selectedPhase, GameType.EXPRESSION, {
      presentation: labelPresentation,
      gameConfig: gameConfig,
    });

    setIsLoading(true);
    const { success } = await save(true);
    if (success) {
      router.push('/creer-un-jeu/expression/success');
    }
    setIsLoading(false);

    localStorage.removeItem('gameConfig');
  };

  function validateGameConfig(gameConfig: StepsType[][]) {
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
          steps={[inputSelectedValue || 'Langue', '1ère expression', '2ème expression', '3ème expression', 'Prévisualisation']}
          urls={[
            '/creer-un-jeu/expression/1',
            '/creer-un-jeu/expression/2',
            '/creer-un-jeu/expression/3',
            '/creer-un-jeu/expression/4',
            '/creer-un-jeu/expression/5',
          ]}
          activeStep={4}
        />
        <div className="width-900">
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
        </div>
        <Previsualisation baseUrl={'/creer-un-jeu/expression/'} />
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default ExpressionStep5;
