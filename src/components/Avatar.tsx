import Link from 'next/link';
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';
import { getGravatarUrl } from 'src/utils';
import { User, UserType } from 'types/user.type';

const useStyles = makeStyles(() => ({
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
}));

type AvatarImgProps = {
  src?: string;
  user?: User;
  size?: 'large' | 'medium' | 'small';
  noLink?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};
export const AvatarImg: React.FC<AvatarImgProps> = ({
  size = 'large',
  src = '',
  user,
  children,
  onClick = () => {},
  style,
  noLink = false,
}: AvatarImgProps) => {
  const classes = useStyles();
  const isPelico = user && user.type >= UserType.MEDIATOR;

  if (isPelico) {
    return (
      <Avatar alt={'avatar'} className={classes[size]} onClick={onClick} style={{ ...style, backgroundColor: bgPage }}>
        <PelicoSouriant style={{ width: '80%', height: 'auto' }} />
      </Avatar>
    );
  }

  const imgSrc = user ? user.avatar || getGravatarUrl(user.email) || src : src;

  if (!noLink && user && user.mascotteId) {
    return (
      <Link href={`/activite/${user.mascotteId}`}>
        <a href={`/activite/${user.mascotteId}`}>
          <Avatar alt={'avatar'} className={classes[size]} src={imgSrc} onClick={onClick} style={style}>
            {children || <PersonIcon style={{ width: '65%', height: 'auto' }} />}
          </Avatar>
        </a>
      </Link>
    );
  }
  return (
    <Avatar alt={'avatar'} className={classes[size]} src={imgSrc} onClick={onClick} style={style}>
      {children || <PersonIcon style={{ width: '65%', height: 'auto' }} />}
    </Avatar>
  );
};
