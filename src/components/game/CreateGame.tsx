import React, { useContext } from 'react';

import GameField from './componentGameMapping/GameField';
import GameMedia from './componentGameMapping/GameMedia';
import GameRadio from './componentGameMapping/GameRadio';
import GameSelect from './componentGameMapping/GameSelect';
import { GameContext } from 'src/contexts/gameContext';
import type { hiddenType, inputType } from 'types/game.type';
import { InputTypeEnum } from 'types/game.type';

interface PlayProps {
  stepNumber: number;
}

const ComponentMapping = {
  [InputTypeEnum.SELECT]: GameSelect,
  [InputTypeEnum.RADIO]: GameRadio,
  [InputTypeEnum.INPUT]: GameField,
  [InputTypeEnum.IMAGE]: GameMedia,
  [InputTypeEnum.VIDEO]: GameMedia,
};

const CreateGame = ({ stepNumber }: PlayProps) => {
  const { gameConfig, activityGames } = useContext(GameContext);

  if (!gameConfig || !gameConfig[stepNumber]) {
    return <div>Oups, votre jeu n&apos;existe pas encore</div>;
  }

  if (activityGames?.[stepNumber] && !gameConfig[stepNumber][0].addedData) {
    // @ts-ignore
    gameConfig[stepNumber][0].inputs[2].selectedValue = activityGames?.[stepNumber]?.origine ? activityGames?.[stepNumber]?.origine : '';
    gameConfig[stepNumber][0].inputs[1].selectedValue = activityGames?.[stepNumber]?.signification ? activityGames?.[stepNumber]?.signification : '';
    gameConfig[stepNumber][1].inputs[0].selectedValue = activityGames?.[stepNumber]?.fakeSignification1
      ? activityGames?.[stepNumber]?.fakeSignification1
      : '';
    gameConfig[stepNumber][1].inputs[1].selectedValue = activityGames?.[stepNumber]?.fakeSignification2
      ? activityGames?.[stepNumber]?.fakeSignification2
      : '';
    gameConfig[stepNumber][0].inputs[0].selectedValue = activityGames?.[stepNumber]?.video ? activityGames?.[stepNumber]?.video : '';
    gameConfig[stepNumber][0].addedData = true;
  }

  const checkDisPlayCondition = (hidden: hiddenType) => {
    let inputToCompare: inputType = {} as inputType;
    gameConfig.map((page) =>
      page.map((step) =>
        step.inputs?.map((input) => {
          if (input.id === hidden.id) {
            inputToCompare = input;
          }
        }),
      ),
    );
    if (inputToCompare?.selectedValue === hidden.value) return false;
    return true;
  };

  return (
    <>
      {gameConfig[stepNumber].map((stepItem, index) => (
        <div className="width-900" key={index}>
          <h1>{stepItem.title}</h1>
          <div>
            <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }} className="text">
              {stepItem.description}
            </p>
            {stepItem.inputs?.map((input, inputIndex) => {
              const Component = ComponentMapping[input.type];
              const isDisplayed = !input.hidden || checkDisPlayCondition(input.hidden);
              return isDisplayed ? <Component input={input} key={inputIndex} /> : null;
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default CreateGame;
