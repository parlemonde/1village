import Link from 'next/link';
import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { UserContext } from 'src/contexts/userContext';
import DoubleChevronRightIcon from 'src/svg/mdi-light_chevron-double-right.svg';
import { UserType } from 'types/user.type';

type Link = {
  name: string;
  link: string;
  rights: number[];
};

const Gerer = () => {
  const { user } = React.useContext(UserContext);
  const hasAccess = user !== null && user.type in [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.MEDIATOR];

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être super admin.</h1>;
  }
  const links: Link[] = [
    { name: 'Les villages-mondes', link: '/admin/newportal/manage/villages', rights: [UserType.ADMIN, UserType.SUPER_ADMIN] },
    { name: 'Les utilisateurs', link: '/admin/newportal/manage/users', rights: [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.MEDIATOR] },
    { name: 'Les consignes des activités', link: '/admin/newportal/manage/activities', rights: [UserType.SUPER_ADMIN] },
    { name: 'Paramétrer 1Village', link: '/admin/newportal/manage/settings', rights: [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.MEDIATOR] },
    { name: "Les droits d'accès", link: '/admin/newportal/manage/access', rights: [UserType.SUPER_ADMIN] },
  ];

  return (
    <>
      <div>
        <h1>Gérer</h1>
        <p>
          C’est dans cet espace, que les administrateurs et administratrices du site vont pouvoir gérer les droits d’accès, la composition des
          villages-mondes et accéder à la liste complète des utilisateurs.
        </p>
      </div>
      <List sx={{ padding: 0, margin: 0 }}>
        {links
          ?.filter((link) => link.rights.includes(user.type))
          .map((item, id) => (
            <Link href={item.link} passHref key={id}>
              <ListItem className="like-button grey" button component="a">
                <ListItemText primary={item.name} />
                <ListItemIcon>
                  <DoubleChevronRightIcon />
                </ListItemIcon>
              </ListItem>
            </Link>
          ))}
      </List>
    </>
  );
};

export default Gerer;
