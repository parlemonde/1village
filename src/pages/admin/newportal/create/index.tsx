import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivity } from 'src/hooks/useActivity';
import DoubleChevronRightIcon from 'src/svg/mdi-light_chevron-double-right.svg';
import { ActivityType } from 'types/activity.type';
import { UserType } from 'types/user.type';

type Link = {
  name: string;
  link: string;
  action?: () => void;
  rights?: number[];
};
interface NavItemProps {
  key?: number;
  link: string;
  primary: string;
  action?: (() => void) | undefined;
}

const NavItem = ({ link, primary, action }: NavItemProps) => (
  <Link href={link} passHref onClick={action}>
    <ListItem
      className="like-button grey"
      button
      component="a"
      onClick={
        action
          ? (e: React.MouseEvent) => {
              e.preventDefault();
              action();
            }
          : undefined
      }
    >
      <ListItemText primary={primary} />
      <ListItemIcon>
        <DoubleChevronRightIcon />
      </ListItemIcon>
    </ListItem>
  </Link>
);

const Creer = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);

  const { createNewActivity } = useActivity();
  const { selectedPhase } = React.useContext(VillageContext);

  const handleNewActivity = () => {
    const success = createNewActivity(ActivityType.CONTENU_LIBRE, selectedPhase);
    if (success) {
      router.push('/admin/newportal/contenulibre/1');
    }
  };

  const links: Link[] = [
    { name: 'Créer du contenu libre', link: '/admin/newportal/contenulibre/1', action: handleNewActivity },
    { name: 'Créer une activité H5P', link: '/admin/newportal/h5p' },
    {
      name: 'Paramétrer l’hymne',
      link: '/admin/newportal/create/parametrer-hymne',
      rights: [UserType.MEDIATOR, UserType.ADMIN, UserType.SUPER_ADMIN],
    },
  ];
  useEffect(() => {
    if (user?.type === UserType.OBSERVATOR) {
      router.push('/admin/newportal/analyze');
    }
  }, [router, user]);
  const hasAccess = user !== null && user.type in [UserType.MEDIATOR, UserType.ADMIN, UserType.SUPER_ADMIN];

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être médiateur ou admin.</h1>;
  }
  return (
    <>
      <div>
        <h1>Créer</h1>
        <p>
          C’est dans cet espace, que les administrateurs et administratrices du site vont pouvoir gérer les droits d’accès, la composition des
          villages-mondes et accéder à la liste complète des utilisateurs.{' '}
        </p>
      </div>
      {links && (
        <List sx={{ padding: 0, margin: 0 }}>
          {links?.map((item, id) => (
            <NavItem key={id} link={item.link} primary={item.name} action={item.action} />
          ))}
        </List>
      )}
    </>
  );
};

export default Creer;
