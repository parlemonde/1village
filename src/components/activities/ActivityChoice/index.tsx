import React from 'react';

import { Tooltip } from '@mui/material';

import { ActivityChoiceButton } from './ActivityChoiceButton';

interface ActivityChoiceProps {
  activities: Array<{
    label: string;
    href: string;
    icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>> | null;
    disabled: boolean;
    disabledText: string;
  }>;
}

export const ActivityChoice = ({ activities }: ActivityChoiceProps) => {
  return (
    <div style={{ width: '100%', padding: '1rem' }}>
      <div style={{ margin: '0 auto', width: '100%', maxWidth: '750px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem 1rem' }}>
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
            />
          );
        })}
      </div>
    </div>
  );
};
