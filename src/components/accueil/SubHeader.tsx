import { useRouter } from 'next/router';
import React from 'react';

import { Box, Typography } from '@mui/material';

import { VillageContext } from 'src/contexts/villageContext';
import { primaryColor } from 'src/styles/variables.const';
import JumellesLight from 'src/svg/jumelles-light.svg';
import Jumelles from 'src/svg/jumelles-primary.svg';
import PuzzleLight from 'src/svg/puzzle-light.svg';
import PuzzlePrimary from 'src/svg/puzzle-primary.svg';
import Step2Light from 'src/svg/step-2-light.svg';
import Step2Primary from 'src/svg/step-2-primary.svg';

interface Props {
  number: number;
  info: string;
}
const svgsLight = [
  { component: JumellesLight, key: 1 },
  { component: Step2Light, key: 2 },
  { component: PuzzleLight, key: 3 },
];

const svgsPrimary = [
  { component: Jumelles, key: 4 },
  { component: Step2Primary, key: 5 },
  { component: PuzzlePrimary, key: 6 },
];

export const SubHeader = ({ number, info }: Props): React.ReactElement => {
  const { selectedPhase, setSelectedPhase } = React.useContext(VillageContext);
  const router = useRouter();
  const icon = selectedPhase === number ? svgsLight[number - 1] : svgsPrimary[number - 1];

  return (
    <Box
      style={{
        display: 'flex',
        width: '32%',
        height: '100%',
        cursor: 'pointer',
      }}
      onClick={() => {
        setSelectedPhase(number);
        if (router.pathname !== '/') {
          router.push('/');
        }
      }}
    >
      <Box
        className="with-shadow"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: selectedPhase === number ? primaryColor : 'white',
          color: selectedPhase === number ? 'white' : primaryColor,
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
          flex: 1,
          minWidth: 0,
        }}
      >
        <Box
          component={icon.component}
          key={icon.key}
          sx={{
            margin: '0 0.5rem',
            display: {
              xs: 'none',
              sm: 'block',
              md: 'block',
            },
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontSize: '.9rem',
          }}
        >
          Phase {number}
          <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
            {' '}
            - {info}
          </Box>
        </Typography>
      </Box>
      {/* Arrow shape for subheader */}
      <svg className="shadow-svg" viewBox="0 0 32 46" fill="none" style={{ height: '100%', width: 'auto' }}>
        <path d="M32 23L0 46L0 0L32 23Z" fill={selectedPhase === number ? primaryColor : 'white'} />
      </svg>
    </Box>
  );
};

export const SubHeaders = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      px: {
        xs: '5px',
        sm: '0',
      },
    }}
  >
    <SubHeader number={1} info="Découvrir" />
    <SubHeader number={2} info="Échanger" />
    <SubHeader number={3} info="Imaginer" />
  </Box>
);
