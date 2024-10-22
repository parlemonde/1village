import { useRouter } from 'next/router';
import React, { useContext } from 'react';

import GameField from './componentGameMapping/GameField';
import GameMedia from './componentGameMapping/GameMedia';
import GameRadio from './componentGameMapping/GameRadio';
import GameSelect from './componentGameMapping/GameSelect';
import { ActivityContext } from 'src/contexts/activityContext';
import { GameContext } from 'src/contexts/gameContext';
import type { hiddenType, inputType, StepsTypes } from 'types/game.type';
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
  const router = useRouter();
  const { query } = router;
  const { gameConfig, setStepsGame } = useContext(GameContext);
  const { activity } = useContext(ActivityContext);
  console.log('DATA : ', activity?.data);

  if (query?.activity_id) {
    const data = activity?.data.game1;
    let activityStepGame = activity?.data.game1 as StepsTypes[];
    switch (stepNumber) {
      case 3:
        activityStepGame = activity?.data.game2 as StepsTypes[];
        break;

      case 4:
        activityStepGame = activity?.data.game3 as StepsTypes[];
        break;

      default:
        break;
    }
    setStepsGame(stepNumber, activityStepGame);
  }

  if (!gameConfig || !gameConfig[stepNumber]) {
    return <div>Oups, votre jeu n&apos;existe pas encore</div>;
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
