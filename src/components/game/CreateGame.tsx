import React from 'react';

import GameField from './componentGameMapping/GameField';
import GameRadio from './componentGameMapping/GameRadio';
import GameSelect from './componentGameMapping/GameSelect';
import { GAME_FIELDS_CONFIG, InputTypeEnum } from 'src/config/games/game';
import { gameResponse } from 'src/contexts/gameContext';
import type { GameType } from 'types/game.type';

interface PlayProps {
  gameType: GameType;
  stepNumber: number;
}

const ComponentMapping = {
  [InputTypeEnum.SELECT]: GameSelect,
  [InputTypeEnum.RADIO]: GameRadio,
  [InputTypeEnum.INPUT]: GameField,
};

const CreateGame = ({ gameType, stepNumber }: PlayProps) => {
  const gameConfig = GAME_FIELDS_CONFIG[gameType];

  // console.log('gameResponse', gameResponse);

  if (!gameConfig || !gameConfig.steps[stepNumber]) {
    return <div>Oups, votre jeu n&apos;existe pas encore</div>;
  }

  return (
    <>
      {gameConfig.steps[stepNumber].map((stepItem, index) => (
        <div className="width-900" key={index}>
          <h1>{stepItem.title}</h1>
          <div>
            <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }} className="text">
              {stepItem.description}
            </p>
            {stepItem.inputs?.map((input, inputIndex) => {
              const Component = ComponentMapping[input.type];
              return <Component input={input} stepNumber={stepNumber} key={inputIndex} />;
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default CreateGame;
