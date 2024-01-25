import React, { useContext } from 'react';

import { ImageModal } from '../activities/content/editors/ImageEditor/ImageModal';
import { VideoModals } from '../activities/content/editors/VideoEditor/VideoModals';
import GameField from './componentGameMapping/GameField';
import GameMedia from './componentGameMapping/GameMedia';
import GameRadio from './componentGameMapping/GameRadio';
import GameSelect from './componentGameMapping/GameSelect';
import type { hiddenType, inputType } from 'src/config/games/game';
import { InputTypeEnum } from 'src/config/games/game';
import { GameContext } from 'src/contexts/gameContext';

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
  const { gameConfig } = useContext(GameContext);

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
      <ImageModal id={0} isModalOpen={false} setIsModalOpen={() => {}} imageUrl="" setImageUrl={() => {}} useCrop={false} onDeleteEditor={() => {}} />
      <VideoModals id={0} isModalOpen={false} setIsModalOpen={() => {}} videoUrl="" setVideoUrl={() => {}} />
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
