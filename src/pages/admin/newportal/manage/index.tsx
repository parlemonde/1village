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

const Gerer = () => {
  const { user } = React.useContext(UserContext);
  const hasAccess = user !== null && user.type in [UserType.MEDIATOR, UserType.ADMIN, UserType.SUPER_ADMIN];

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être médiateur, modérateur ou super admin.</h1>;
  }

  const links: Link[] = [
    { name: 'Les villages-mondes', link: '/admin/newportal/manage/villages' },
    { name: 'Les utilisateurs', link: '/admin/newportal/manage/users' },
    { name: 'Les consignes des activités', link: '/admin/newportal/manage/activities' },
    { name: 'Paramétrer 1Village', link: '/admin/newportal/manage/settings' },
    { name: "Les droits d'accès", link: '/admin/newportal/manage/access' },
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
        {links?.map((item, id) => (
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
