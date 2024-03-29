import { useRouter } from 'next/router';
import React from 'react';

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
  <JumellesLight key={1} style={{ marginRight: '0.5rem' }} />,
  <Step2Light key={2} style={{ marginRight: '0.5rem' }} />,
  <PuzzleLight key={3} style={{ marginRight: '0.5rem' }} />,
];

const svgsPrimary = [
  <Jumelles key={4} style={{ marginRight: '0.5rem' }} />,
  <Step2Primary key={5} style={{ marginRight: '0.5rem' }} />,
  <PuzzlePrimary key={6} style={{ marginRight: '0.5rem' }} />,
];

export const SubHeader = ({ number, info }: Props): React.ReactElement => {
  const { selectedPhase, setSelectedPhase } = React.useContext(VillageContext);
  const router = useRouter();

  return (
    <div
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
      <div
        className="with-shadow"
        style={{
          alignItems: 'center',
          backgroundColor: selectedPhase === number ? primaryColor : 'white',
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
          color: selectedPhase === number ? 'white' : primaryColor,
          display: 'flex',
          flex: 1,
          minWidth: 0,
          padding: '0.25rem 0.5rem 0.25rem 1rem',
        }}
      >
        {selectedPhase === number ? svgsLight[number - 1] : svgsPrimary[number - 1]}
        <h2 style={{ fontSize: '0.9rem', marginLeft: '1rem' }}>
          Phase {number} - {info}
        </h2>
      </div>
      {/* Arrow shape for subheader */}
      <svg className="shadow-svg" viewBox="0 0 32 46" fill="none" style={{ height: '100%', width: 'auto' }}>
        <path d="M32 23L0 46L0 0L32 23Z" fill={selectedPhase === number ? primaryColor : 'white'} />
      </svg>
    </div>
  );
};

export const SubHeaders = () => (
  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '100%' }}>
    <SubHeader number={1} info="Découvrir" />
    <SubHeader number={2} info="Échanger" />
    <SubHeader number={3} info="Imaginer" />
  </div>
);
