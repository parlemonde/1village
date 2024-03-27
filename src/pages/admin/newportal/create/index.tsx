import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { VillageContext } from 'src/contexts/villageContext';
import { useActivity } from 'src/hooks/useActivity';
import DoubleChevronRightIcon from 'src/svg/mdi-light_chevron-double-right.svg';
import { ActivityType } from 'types/activity.type';

type Link = {
  name: string;
  link: string;
  action?: () => void;
};
interface NavItemProps {
  key?: number;
  link: string;
  primary: string;
  action?: (() => void) | undefined;
}

const Creer = () => {
  const router = useRouter();
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
    { name: 'Créer une activité H5P', link: 'https://' },
    { name: 'Paramétrer l’hymne', link: 'https://' },
    { name: 'Mixer l’hymne', link: 'https://' },
  ];

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

  const renderTitle = () => {
    return (
      <div>
        <h1>Créer</h1>
        <p>
          C’est dans cet espace, que les administrateurs et administratrices du site vont pouvoir gérer les droits d’accès, la composition des
          villages-mondes et accéder à la liste complète des utilisateurs.{' '}
        </p>
      </div>
    );
  };

  const renderLinks = () => {
    return (
      links && (
        <List sx={{ padding: 0, margin: 0 }}>
          {links?.map((item, id) => (
            <NavItem key={id} link={item.link} primary={item.name} action={item.action} />
          ))}
        </List>
      )
    );
  };
  return (
    <>
      {renderTitle()}
      {renderLinks()}
    </>
  );
};

export default Creer;
