import React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import DoubleChevronRightIcon from 'src/svg/mdi-light_chevron-double-right.svg';

type Link = {
  name: string;
  link: string;
};
interface NavItemProps {
  key?: number;
  link: string;
  primary: string;
}

export const Creer = () => {
  const links: Link[] = [
    { name: 'Créer du contenu libre', link: 'https://' },
    { name: 'Créer une activité H5P', link: 'https://' },
    { name: 'Paramétrer l’hymne', link: 'https://' },
    { name: 'Mixer l’hymne', link: 'https://' },
  ];

  const NavItem = ({ link, primary }: NavItemProps) => (
    <ListItem className="like-button grey" component="a" button href={link}>
      <ListItemText primary={primary} />
      <ListItemIcon>
        <DoubleChevronRightIcon />
      </ListItemIcon>
    </ListItem>
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
            <NavItem key={id} link={item.link} primary={item.name} />
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
