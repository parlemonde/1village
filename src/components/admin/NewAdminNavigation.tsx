import React from 'react';

import { Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import AnalyserIcon from 'src/svg/analyser.svg';
import CreerIcon from 'src/svg/creer.svg';
import GererIcon from 'src/svg/gerer.svg';
import MediathequeIcon from 'src/svg/mediatheque.svg';
import PublierIcon from 'src/svg/publier.svg';

interface NewAdminNavigationProps {
  changeContent?: (label: string) => void;
}
interface NavItemProps {
  key?: number;
  selected: boolean;
  onClick: (ev: Event) => void;
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

const NavItem = ({ selected, onClick, Icon, primary }: NavItemProps) => (
  <ListItem className="like-button blue" button selected={selected} onClick={onClick}>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText primary={primary} />
  </ListItem>
);

export const NewAdminNavigation = ({ changeContent }: NewAdminNavigationProps) => {
  const [selectedTab, setSelectedTab] = React.useState('Créer');

  const tabs: Tab[] = [
    { path: '/admin/villages', label: 'Créer', Icon: CreerIcon },
    { path: '/admin/users', label: 'Publier', Icon: PublierIcon },
    { path: '/admin/featureFlag', label: 'Gérer', Icon: GererIcon },
    { path: '/admin/stats', label: 'Analyser', Icon: AnalyserIcon },
    { path: '/admin/analytics', label: 'Médiathèque', Icon: MediathequeIcon },
  ];

  const onTabClick = (label: string) => {
    setSelectedTab(label);
    if (changeContent) {
      changeContent(label);
    }
  };

  return (
    <Container className="container-admin-nav" sx={containerStyle}>
      <List sx={{ padding: 0, margin: 0 }}>
        {tabs?.map((tab, id) => (
          <NavItem key={id} selected={selectedTab === tab.label} onClick={() => onTabClick(tab.label)} Icon={tab.Icon} primary={tab.label} />
        ))}
      </List>
    </Container>
  );
};
