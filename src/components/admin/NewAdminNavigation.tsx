import { useRouter } from 'next/router';
import React from 'react';

import GroupIcon from '@mui/icons-material/Group';
import InsertChartOutlinedOutlinedIcon from '@mui/icons-material/InsertChartOutlinedOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import TimelineIcon from '@mui/icons-material/Timeline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { useIsH5pEnabled } from 'src/api/h5p/h5p-enabled';

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

const NavItem = ({ selected, onClick, Icon, primary }: NavItemProps) => (
  <ListItem className="like-button" button selected={selected} onClick={onClick}>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText primary={primary} />
  </ListItem>
);

export const NewAdminNavigation = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = React.useState(-1);
  const isH5pEnabled = useIsH5pEnabled();

  const tabs: Tab[] = React.useMemo(() => {
    const baseTabs: Tab[] = [
      { path: '/admin/villages', label: 'Villages', Icon: LanguageIcon },
      { path: '/admin/users', label: 'Utilisateurs', Icon: GroupIcon },
      { path: '/admin/featureFlag', label: "Contrôle d'accès", Icon: VpnKeyIcon },
      { path: '/admin/stats', label: 'Statistiques', Icon: InsertChartOutlinedOutlinedIcon },
      { path: '/admin/analytics', label: 'Web Analytics', Icon: TimelineIcon },
    ];

    if (isH5pEnabled) {
      return [...baseTabs, { path: '/admin/h5p', label: 'H5P', Icon: LocalActivityIcon }];
    }

    return baseTabs;
  }, [isH5pEnabled]);

  React.useEffect(() => {
    const index = tabs.findIndex((tab) => `/admin/${tab.path.split('/')[2]}` === router.pathname);
    setSelectedTab(index);
  }, [router.pathname, tabs]);

  const goToPath = (path: string) => () => {
    router.push(path);
  };

  return (
    <Container sx={{ backgroundColor: 'white', borderRadius: '10px', width: '310px', height: '360px' }}>
      <List>
        {tabs.map((tab, index: number) => (
          <NavItem key={tab.label} selected={selectedTab === index} onClick={goToPath(tab.path)} Icon={tab.Icon} primary={tab.label} />
        ))}
      </List>
    </Container>
  );
};
