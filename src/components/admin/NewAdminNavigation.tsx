import { useRouter } from 'next/router';
import React from 'react';

import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { useIsH5pEnabled } from 'src/api/h5p/h5p-enabled';
import AnalyserIcon from 'src/svg/analyser.svg';
import CreerIcon from 'src/svg/creer.svg';
import GererIcon from 'src/svg/gerer.svg';
import MediathequeIcon from 'src/svg/mediatheque.svg';
import PublierIcon from 'src/svg/publier.svg';

interface NewAdminNavigationProps {
  changeContent?: any;
}
interface NavItemProps {
  key?: string;
  selected: boolean;
  onClick: (ev: Event) => void;
  Icon: string;
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
  <ListItem className="like-button" button selected={selected} onClick={onClick}>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText primary={primary} />
  </ListItem>
);

export const NewAdminNavigation = ({ changeContent }: NewAdminNavigationProps) => {
  // const router = useRouter();
  const [selectedTab, setSelectedTab] = React.useState('Créer');

  const isH5pEnabled = useIsH5pEnabled();

  const tabs: Tab[] = React.useMemo(() => {
    const baseTabs: Tab[] = [
      { path: '/admin/villages', label: 'Créer', Icon: CreerIcon },
      { path: '/admin/users', label: 'Publier', Icon: PublierIcon },
      { path: '/admin/featureFlag', label: 'Gérer', Icon: GererIcon },
      { path: '/admin/stats', label: 'Analyser', Icon: AnalyserIcon },
      { path: '/admin/analytics', label: 'Médiathèque', Icon: MediathequeIcon },
    ];

    if (isH5pEnabled) {
      return [...baseTabs, { path: '/admin/h5p', label: 'H5P', Icon: LocalActivityIcon }];
    }

    return baseTabs;
  }, [isH5pEnabled]);

  const onTabClick = (label: string) => {
    setSelectedTab(label);
    if (changeContent) {
      changeContent(label);
    }
  };

  return (
    <Container className="container-admin-nav" sx={containerStyle}>
      <List sx={{ padding: 0, margin: 0 }}>
        {tabs.map((tab) => (
          <NavItem key={tab.label} selected={selectedTab === tab.label} onClick={() => onTabClick(tab.label)} Icon={tab.Icon} primary={tab.label} />
        ))}
      </List>
    </Container>
  );
};
