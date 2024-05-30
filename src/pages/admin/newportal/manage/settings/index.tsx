import Link from 'next/link';
import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { UserContext } from 'src/contexts/userContext';
import BackArrow from 'src/svg/back-arrow.svg';
import DoubleChevronRightIcon from 'src/svg/mdi-light_chevron-double-right.svg';
import { UserType } from 'types/user.type';

type Link = {
  name: string;
  link: string;
  rights: number[];
};

const Gerer = () => {
  const { user } = React.useContext(UserContext);
  const hasAccess = user !== null && user.type in [UserType.ADMIN, UserType.SUPER_ADMIN];

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être modérateur ou super admin.</h1>;
  }

  const links: Link[] = [
<<<<<<< HEAD
    { name: 'Archiver', link: '/admin/newportal/manage/settings/archive', rights: [UserType.SUPER_ADMIN] },
    { name: 'Présentation de Pélico', link: '/admin/newportal/manage/settings/pelico', rights: [UserType.ADMIN, UserType.SUPER_ADMIN] },
    { name: 'Paramétrer la home', link: '/admin/newportal/manage/settings/home', rights: [UserType.ADMIN, UserType.SUPER_ADMIN] },
    { name: 'Paramétrer les phases', link: '/admin/newportal/manage/settings/phases', rights: [UserType.ADMIN, UserType.SUPER_ADMIN] },
=======
    { name: 'Archiver', link: '/admin/newportal/manage/settings/archive' },
    { name: 'Présentation de Pélico', link: '/admin/newportal/manage/settings/pelico' },
    { name: 'Paramétrer la home', link: '/admin/newportal/manage/settings/home' },
    { name: 'Paramétrer les phases', link: '/admin/newportal/manage/settings/phases' },
>>>>>>> e0f71c63 (VIL-320 to staging)
  ];

  return (
    <>
      <div>
        <Link href="/admin/newportal/manage">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <BackArrow />
            <h1 style={{ marginLeft: '10px' }}>Paramétrage</h1>
          </div>
        </Link>
        <p>
          C&apos;est ici que l&apos;on peut activer les phases d&apos;1Village, créer les devinettes de lancement d&apos;année et archiver 1Village.
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
