import Card from '@mui/material/Card';
import * as React from 'react';

import { UserPopover } from './UserPopover';
import type { User } from 'types/user.type';

export type PopoverData<T extends 'country' | 'user' = 'country' | 'user'> = {
  type: T;
  data: T extends 'country'
    ? {
        country: string;
      }
    : T extends 'user'
    ? User
    : never;
};
export type PopoverProps = {
  x: number;
  y: number;
} & PopoverData;

export const isCountry = (props: PopoverData): props is PopoverData<'country'> => props.type === 'country';
export const isUser = (props: PopoverData): props is PopoverData<'user'> => props.type === 'user';

export const Popover = ({ x, y, ...props }: PopoverProps) => {
  return (
    <div style={{ position: 'absolute', display: 'inline-block', left: x, top: y }}>
      <div style={{ position: 'relative', left: '-50%', pointerEvents: 'none', userSelect: 'none' }}>
        <Card style={{ padding: '0.25rem 0.5rem' }}>
          {isCountry(props) && <span className="text text--small">{props.data.country}</span>}
          {isUser(props) && <UserPopover user={props.data} />}
        </Card>
      </div>
    </div>
  );
};
