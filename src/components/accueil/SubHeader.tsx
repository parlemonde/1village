import { useRouter } from 'next/router';
import React from 'react';

import { VillageContext } from 'src/contexts/villageContext';
import { primaryColorLight } from 'src/styles/variables.const';
import Jumelles from 'src/svg/jumelles.svg';

interface Props {
  number: number;
  info: string;
}

export const SubHeader: React.FC<Props> = ({ number, info }) => {
  const { selectedPhase, setSelectedPhase } = React.useContext(VillageContext);
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        width: '30%',
        cursor: 'pointer',
      }}
      onClick={() => {
        setSelectedPhase(number);
        router.push('/');
      }}
    >
      <div
        className="with-bot-left-shadow"
        style={{
          alignItems: 'center',
          backgroundColor: selectedPhase === number ? primaryColorLight : 'white',
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
          color: selectedPhase === number ? 'white' : primaryColorLight,
          display: 'flex',
          flex: 1,
          padding: '0.5rem 2rem 0.5rem 1rem',
        }}
      >
        <Jumelles style={{ marginRight: '0.5rem' }} />
        <h2 style={{ fontSize: '1vw', marginLeft: '2vw' }}>
          Phase {number} - {info}
        </h2>
      </div>
      {/* Arrow shape for subheader */}
      <svg className="shadow-svg" viewBox="0 0 32 46" fill="none">
        <path d="M32 23L0 46L0 0L32 23Z" fill={selectedPhase === number ? primaryColorLight : 'white'} />
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
