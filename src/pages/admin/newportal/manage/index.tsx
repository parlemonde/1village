import Link from 'next/link';
import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { UserContext } from 'src/contexts/userContext';
import DoubleChevronRightIcon from 'src/svg/mdi-light_chevron-double-right.svg';
import { UserType } from 'types/user.type';

type Link = {
  name: string;
  link: string;
};
interface NavItemProps {
  key?: number;
  link: string;
  primary: string;
}

const Gerer = () => {
  const { user } = React.useContext(UserContext);
  const hasAccess = user !== null && user.type in [UserType.MEDIATOR, UserType.ADMIN, UserType.SUPER_ADMIN];

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être modérateur.</h1>;
  }

  const links: Link[] = [
    { name: 'Les villages-mondes', link: '/admin/newportal/manage/villages' },
    { name: 'Les utilisateurs', link: '/admin/newportal/manage/users' },
    { name: 'Les consignes des activités', link: '/admin/newportal/manage/activities' },
    { name: 'Paramétrer 1Village', link: '/admin/newportal/manage/settings' },
    { name: "Les droits d'accès", link: '/admin/newportal/manage/access' },
  ];

  const NavItem = ({ link, primary }: NavItemProps) => (
    <Link href={link} passHref>
      <ListItem className="like-button grey" button component="a">
        <ListItemText primary={primary} />
        <ListItemIcon>
          <DoubleChevronRightIcon />
        </ListItemIcon>
      </ListItem>
    </Link>
  );

  const renderTitle = () => {
    return (
      <div>
        <h1>Gérer</h1>
        <p>
          C’est dans cet espace, que les administrateurs et administratrices du site vont pouvoir gérer les droits d’accès, la composition des
          villages-mondes et accéder à la liste complète des utilisateurs.
        </p>
      </div>
    );
  };

  const renderLinks = () => {
    return (
      <List sx={{ padding: 0, margin: 0 }}>
        {links?.map((item, id) => (
          <NavItem key={id} link={item.link} primary={item.name} />
        ))}
      </List>
    );
  };

  return (
    <>
      {renderTitle()}
      {renderLinks()}
    </>
  );
};

export default Gerer;
