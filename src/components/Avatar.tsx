import Link from 'next/link';
import React from 'react';

import PersonIcon from '@mui/icons-material/Person';
import { Avatar } from '@mui/material';

import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';
import { getGravatarUrl } from 'src/utils';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

const styles = {
  large: {
    width: '140px',
    height: '140px',
  },
  medium: {
    width: '80px',
    height: '80px',
  },
  small: {
    width: '40px',
    height: '40px',
  },
  'extra-small': {
    width: '30px',
    height: '30px',
  },
};

type AvatarImgProps = {
  src?: string;
  user?: User;
  size?: 'large' | 'medium' | 'small' | 'extra-small';
  noLink?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  isRounded?: boolean;
  displayAsUser?: boolean;
};
export const AvatarImg = ({
  size = 'large',
  src = '',
  user,
  children,
  onClick = () => {},
  style,
  noLink = false,
  isRounded = true,
  displayAsUser = false,
}: React.PropsWithChildren<AvatarImgProps>) => {
  const isPelico = user && user.type >= UserType.MEDIATOR;

  if (isPelico && !displayAsUser) {
    return (
      <Link href="/pelico-page">
        <Avatar alt={'avatar'} sx={styles[size]} onClick={onClick} style={{ ...style, backgroundColor: bgPage }}>
          <PelicoSouriant style={{ width: '80%', height: 'auto' }} />
        </Avatar>
      </Link>
    );
  }

  const imgSrc = user ? user.avatar || getGravatarUrl(user.email) || src : src;

  if (!isPelico && !noLink && user && user.mascotteId) {
    return (
      <Link href={`/activite/${user.mascotteId}`}>
        <a href={`/activite/${user.mascotteId}`}>
          <Avatar alt={'avatar'} sx={styles[size]} src={imgSrc} onClick={onClick} style={style}>
            {children || <PersonIcon style={{ width: '65%', height: 'auto' }} />}
          </Avatar>
        </a>
      </Link>
    );
  }
  return (
    <Avatar alt={'avatar'} sx={styles[size]} src={imgSrc} onClick={onClick} style={style} variant={!isRounded ? 'square' : undefined}>
      {children || <PersonIcon style={{ width: '65%', height: 'auto' }} />}
    </Avatar>
  );
};
