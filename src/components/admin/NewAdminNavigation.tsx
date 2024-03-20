import Link from 'next/link';
import React from 'react';

import { Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import AnalyserIcon from 'src/svg/analyser.svg';
import CreerIcon from 'src/svg/creer.svg';
import GererIcon from 'src/svg/gerer.svg';
import MediathequeIcon from 'src/svg/mediatheque.svg';
import PublierIcon from 'src/svg/publier.svg';

interface NavItemProps {
  key?: number;

  path: string;
  selected: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  Icon: React.ElementType;
  primary: string;
}

interface Tab {
  path: string;
  label: string;
  Icon: React.ElementType;
}

const containerStyle = {
  backgroundColor: 'white',
  borderRadius: '10px',
  width: '310px',
  height: '360px',
  padding: '15px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const NavItem = ({ path, selected, onClick, Icon, primary }: NavItemProps) => (
  <Link href={path} passHref>
    <ListItem className="like-button blue" button selected={selected} onClick={onClick}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={primary} />
    </ListItem>
  </Link>
);

export const NewAdminNavigation = () => {
  const [selectedTab, setSelectedTab] = React.useState('Créer');

  const tabs: Tab[] = [
    { path: '/admin/newportal/create', label: 'Créer', Icon: CreerIcon },
    { path: '/admin/newportal/publish', label: 'Publier', Icon: PublierIcon },
    { path: '/admin/newportal/manage', label: 'Gérer', Icon: GererIcon },
    { path: '/admin/newportal/analyze', label: 'Analyser', Icon: AnalyserIcon },
    { path: '/admin/newportal/medialibrary', label: 'Médiathèque', Icon: MediathequeIcon },
  ];

  const onTabClick = (label: string) => {
    setSelectedTab(label);
  };

  return (
    <Container className="container-admin-nav" sx={containerStyle}>
      <List sx={{ padding: 0, margin: 0 }}>
        {tabs?.map((tab, id) => (
          <NavItem
            key={id}
            selected={selectedTab === tab.label}
            path={tab.path}
            onClick={() => onTabClick(tab.label)}
            Icon={tab.Icon}
            primary={tab.label}
          />
        ))}
      </List>
    </Container>
  );
};
