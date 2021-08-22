import Link from 'next/link';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import { getUserDisplayName } from 'src/utils';
import { User, UserType } from 'types/user.type';

type UserDisplayNameProps = {
  user: User;
  noLink?: boolean;
  className?: string;
  style?: React.CSSProperties;
};
export const UserDisplayName = ({ user, className, style, noLink = false }: UserDisplayNameProps) => {
  const userId = React.useContext(UserContext)?.user?.id ?? 0;
  const isSelf = userId === user.id;
  const isPelico = user && user.type >= UserType.MEDIATOR;

  if (isPelico) {
    return (
      <span className={className} style={style}>
        Pelico
      </span>
    );
  }

  if (!noLink && user && user.mascotteId) {
    return (
      <Link href={`/activite/${user.mascotteId}`}>
        <a href={`/activite/${user.mascotteId}`}>
          <span className={className} style={style}>
            {getUserDisplayName(user, isSelf)}
          </span>
        </a>
      </Link>
    );
  }
  return (
    <span className={className} style={style}>
      {getUserDisplayName(user, isSelf)}
    </span>
  );
};
