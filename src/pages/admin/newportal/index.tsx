import Link from 'next/link';
import React, { useMemo } from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import DoubleChevronRightIcon from 'src/svg/mdi-light_chevron-double-right.svg';

type Link = {
  name: string;
  link: string;
};

type NavItemProps = {
  key?: number;
  link: string;
  primary: string;
};

const Title = () => (
  <div>
    <h1>Créer</h1>
    <p>
      C’est dans cet espace, que les administrateurs et administratrices du site vont pouvoir gérer les droits d’accès, la composition des
      villages-mondes et accéder à la liste complète des utilisateurs.{' '}
    </p>
  </div>
);

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

type LinksProps = {
  links: Link[];
};
const Links = ({ links = [] }: LinksProps) => (
  <List sx={{ padding: 0, margin: 0 }}>
    {links?.map((item, id) => (
      <NavItem key={id} link={item.link} primary={item.name} />
    ))}
  </List>
);

const Creer = () => {
  const links: Link[] = useMemo(
    () => [
      { name: 'Créer du contenu libre', link: '/admin/newportal/contenulibre' },
      { name: 'Créer une activité H5P', link: 'https://' },
      { name: 'Paramétrer l’hymne', link: 'https://' },
    ],
    [],
  );

  return (
    <>
      <Title />
      <Links links={links} />
    </>
  );
};

export default Creer;
