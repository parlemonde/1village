import React, { useCallback, useContext } from 'react';

import { Tooltip } from '@mui/material';

import { ActivityChoiceButton } from './ActivityChoiceButton';
import { GameContext } from 'src/contexts/gameContext';
import type { GameType } from 'types/game.type';

interface ActivityChoiceProps {
  activities: Array<{
    label: string;
    href: string;
    icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>> | null;
    disabled: boolean;
    disabledText: string;
    gameType?: GameType;
  }>;
}

export const ActivityChoice = ({ activities }: ActivityChoiceProps) => {
  const { setGameType } = useContext(GameContext);

  const handleChoiceClick = useCallback(
    (gameType: GameType) => {
      localStorage.setItem('gameTypeInLocalStorage', JSON.stringify(gameType));
      setGameType(gameType);
    },
    [setGameType],
  );
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          margin: '0 auto',
          width: '100%',
          maxWidth: '640px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem 1rem',
        }}
      >
        {activities.map((activity) => {
          if (activity.disabled && activity.disabledText) {
            return (
              <Tooltip title={activity.disabledText} key={activity.label}>
                <div>
                  <ActivityChoiceButton label={activity.label} href={activity.href} icon={activity.icon} disabled={activity.disabled} />
                </div>
              </Tooltip>
            );
          }
          return (
            <ActivityChoiceButton
              key={activity.label}
              label={activity.label}
              href={activity.href}
              icon={activity.icon}
              disabled={activity.disabled}
              onClick={() => activity.gameType && handleChoiceClick(activity.gameType)}
            />
          );
        })}
      </div>
    </div>
  );
};
