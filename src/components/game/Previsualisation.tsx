import Image from 'next/image';
import router from 'next/router';
import React, { useContext } from 'react';
import ReactPlayer from 'react-player';

import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';

import { CustomRadio } from '../buttons/CustomRadio';
import { EditButton } from '../buttons/EditButton';
import type { inputType } from 'src/config/games/games';
import { InputTypeEnum } from 'src/config/games/games';
import { GameContext } from 'src/contexts/gameContext';

type PrevisualisationProps = {
  baseUrl: string;
};

const Previsualisation = ({ baseUrl }: PrevisualisationProps) => {
  const { gameConfig } = useContext(GameContext);
  const result = gameConfig
    .map((step, index) => {
      const reponseInStep: inputType[][] = step.map((responseBlock) => {
        const filteredItems = responseBlock?.inputs?.filter((input) => {
          return input.isDisplayedInRecap === true;
        });
        return filteredItems || [];
      });
      return {
        step: gameConfig.length === 4 ? index : index + 1,
        responses: ([] as inputType[]).concat(...reponseInStep),
      };
    })
    .filter((elem) => elem.responses.length > 0);

  return (
    <div>
      <>
        {result.map((step, stepIndex) => {
          const AArea = step.responses.filter((res) => res?.type === InputTypeEnum.IMAGE || res?.type === InputTypeEnum.VIDEO);
          const BArea = step.responses.filter((res) => res?.response === true || res?.response === false);
          const CArea = step.responses.filter(
            (res) => res?.type !== InputTypeEnum.IMAGE && res?.type !== InputTypeEnum.VIDEO && res?.response !== true && res?.response !== false,
          );
          const hasCArea = CArea.length >= 1;
          return (
            <div
              key={stepIndex}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '1fr 1fr 1fr',
                gridTemplateAreas: hasCArea ? '"a b ." "a b d" "c c ."' : '"a b ." "a b d" "a b ."',
                border: '1px dotted #ccc',
                borderRadius: '8px',
                margin: '10px 0',
                padding: '10px',
              }}
            >
              <div style={{ gridArea: 'd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <EditButton
                  onClick={() => {
                    router.push(`${baseUrl}${step.step}`);
                  }}
                  status="success"
                />
              </div>
              <div style={{ gridArea: 'a', width: '100%', height: '100%' }}>
                {AArea.map((elem, index) => (
                  <div key={index} style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {/* Taille Image a régler  + Liens en fonction de la steps incrémentation + Boutton */}
                    {elem.selectedValue && elem.type === 3 ? (
                      <Image layout="fill" objectFit="contain" alt="Image à deviner" src={elem.selectedValue} unoptimized />
                    ) : elem.selectedValue && elem.type === 4 ? (
                      <ReactPlayer url={elem.selectedValue} width={'100%'} height={'100%'} controls={true} light />
                    ) : null}
                  </div>
                ))}
              </div>
              <div style={{ gridArea: 'b', display: 'flex', justifyContent: 'center' }}>
                <Grid item xs={12} md={8} style={{ padding: '10px' }}>
                  <RadioGroup aria-label="signification" name="signification1" value={1}>
                    {BArea.map((elem, index) => (
                      <FormControlLabel
                        key={index}
                        control={elem.response ? <CustomRadio isChecked={elem.response === true} isSuccess={elem.response === true} /> : <Radio />}
                        label={elem.selectedValue}
                        style={{ maxWidth: '100%' }}
                      />
                    ))}
                  </RadioGroup>
                </Grid>
              </div>
              {hasCArea && (
                <div style={{ gridArea: 'c' }}>
                  {CArea.map((elem, index) => (
                    <div style={{ paddingLeft: 20, paddingTop: 20 }} key={index}>
                      {elem?.selectedValue}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </>
    </div>
  );
};

export default Previsualisation;
