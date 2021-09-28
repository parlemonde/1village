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
        width: '30%',
        opacity: 'none',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
      }}
      onClick={() => {
        setSelectedPhase(number);
        router.push('/');
      }}
    >
      <div
        className="with-bot-left-shadow"
        style={{
          flex: 1,
          minWidth: 0,
          backgroundColor: selectedPhase === number ? primaryColorLight : 'white',
          height: '100%',
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
          padding: '0.5rem 2rem 0.5rem 1rem',
          display: 'flex',
          color: selectedPhase === number ? 'white' : primaryColorLight,
          alignItems: 'center',
        }}
      >
        <Jumelles style={{ height: 'auto', width: 'auto', marginRight: '0.5rem' }} />
        <h2 style={{ fontSize: '1vw' }}>
          Phase {number} - {info}
        </h2>
      </div>
      <div style={{ height: '100%' }}>
        <svg className="shadow-svg" style={{ width: 'auto', height: '100%' }} viewBox="0 0 32 46" fill="none">
          <path d="M32 23L0 46L0 0L32 23Z" fill={selectedPhase === number ? primaryColorLight : 'white'} />
        </svg>
      </div>
    </div>
  );
};

export const SubHeaders = () => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    <SubHeader number={
      1} info="Découvrir" />
    <SubHeader number={2} info="Échanger" />
    <SubHeader number={3} info="Imaginer" />
  </div >
);
