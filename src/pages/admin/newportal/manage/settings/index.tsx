import React from 'react';
import Link from 'next/link';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DoubleChevronRightIcon from 'src/svg/mdi-light_chevron-double-right.svg';
import BackArrow from 'src/svg/back-arrow.svg';

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
  const links: Link[] = [
    { name: 'Archiver', link: 'https://' },
    { name: 'Présenatation de Pélico', link: 'https://' },
    { name: 'Paramétrer la home', link: 'https://' },
    { name: 'Paramétrer les phases', link: 'https://' }
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
        <div style={{display: 'flex',alignItems: 'center'}}>
            <div style={{cursor: 'pointer', display: 'flex',alignItems: 'center'}}>
                <Link href="/admin/newportal/manage">
                    <BackArrow />
                </Link>
            </div>
            <h1 style={{ marginLeft: '10px' }}>Paramétrage</h1>
        </div>
        <p>
            C’est ici que l’on peut activer les phases d’1Village, créer les devinettes de lancement d’année et archiver 1Village.
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
      </List>)
  }

  return (
    <>
      {renderTitle()}
      {renderLinks()}
    </>
  );

};

export default Gerer;
