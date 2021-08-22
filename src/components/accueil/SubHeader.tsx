import React from 'react';

import { primaryColorLight } from 'src/styles/variables.const';
import Jumelles from 'src/svg/jumelles.svg';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';
import Puzzle from 'src/svg/puzzle.svg';

export const SubHeader = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          backgroundColor: primaryColorLight,
          height: '100%',
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px',
          padding: '0 2rem 0 4rem',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <PelicoSouriant style={{ top: '-45%', left: '0.8rem', height: '100%', width: 'auto', position: 'absolute' }} />
        <Jumelles style={{ height: '70%', width: 'auto', marginRight: '0.5rem' }} />
        <h2>1. Se découvrir</h2>
      </div>
      <div style={{ height: '100%' }}>
        <svg style={{ width: 'auto', height: '100%' }} viewBox="0 0 32 46" fill="none">
          <path d="M32 23L0 46L0 0L32 23Z" fill={primaryColorLight} />
        </svg>
      </div>
      <div style={{ margin: '0 2rem', display: 'flex', alignItems: 'center' }}>
        <Puzzle style={{ height: '2rem', width: 'auto', marginRight: '0.5rem' }} />
        <h3>2. Construire le village idéal</h3>
      </div>
    </div>
  );
};
