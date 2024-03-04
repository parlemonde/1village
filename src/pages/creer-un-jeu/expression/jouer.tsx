import React from 'react';

import Jouer from 'src/components/game/Jouer';
import { GameType } from 'types/game.type';

const Play = () => {
  return (
    <>
      <Jouer subType={GameType.EXPRESSION} />
    </>
  );
};

export default Play;
