import React from 'react';

// import { Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { GAME_FIELDS_CONFIG, InputTypeEnum } from 'src/config/games/games';
import type { GameType } from 'types/game.type';

interface PlayProps {
  gameType: GameType;
  stepNumber: number;
}

const Play: React.FC<PlayProps> = ({ gameType, stepNumber }) => {
  const gameConfig = GAME_FIELDS_CONFIG[gameType];

  if (!gameConfig || !gameConfig.steps[stepNumber]) {
    return <div>Configuration introuvable</div>;
  }

  return (
    <>
      {gameConfig.steps[stepNumber].map((stepItem, index) => (
        //début Div 1
        <div className="width-900" key={index}>
          <h1>{stepItem.title}</h1>

          {/* début div 2 */}
          <div style={{ border: '1px solid blue' }}>
            <p>{stepItem.description}</p>
            {stepItem.inputs &&
              stepItem.inputs.map((input, inputIndex) => (
                <div key={inputIndex}>
                  {input.label && <InputLabel>{input.label}</InputLabel>}
                  {input.type === InputTypeEnum.SELECT && (
                    <FormControl>
                      <Select>
                        {input?.values?.map((value, valueIndex) => (
                          <option key={valueIndex} value={value}>
                            {value}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {input.type === InputTypeEnum.RADIO && (
                    <RadioGroup>
                      {input.values &&
                        input.values.map((radioValue, radioIndex) => (
                          <FormControlLabel key={radioIndex} value={radioValue} control={<Radio />} label={radioValue} />
                        ))}
                    </RadioGroup>
                  )}
                  {input.type === InputTypeEnum.INPUT && <TextField type="text" placeholder={input.placeHolder} />}
                </div>
              ))}

            {/* fin Div 2 */}
          </div>

          {/* fin Div 1 */}
        </div>
      ))}
    </>
  );
};

export default Play;
