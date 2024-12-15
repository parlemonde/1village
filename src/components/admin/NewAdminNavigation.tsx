import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Container, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { UserContext } from 'src/contexts/userContext';
import AnalyserIcon from 'src/svg/analyser.svg';
import CreerIcon from 'src/svg/creer.svg';
import GererIcon from 'src/svg/gerer.svg';
import MediathequeIcon from 'src/svg/mediatheque.svg';
import PublierIcon from 'src/svg/publier.svg';
import { UserType } from 'types/user.type';

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
  rights: number[];
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
  const router = useRouter();
  const { user } = React.useContext(UserContext);

  const [selectedTab, setSelectedTab] = React.useState('Créer');

  const tabs: Tab[] = [
    { path: '/admin/newportal/create', label: 'Créer', Icon: CreerIcon, rights: [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.MEDIATOR] },
    { path: '/admin/newportal/publier', label: 'Publier', Icon: PublierIcon, rights: [UserType.ADMIN, UserType.SUPER_ADMIN] },
    { path: '/admin/newportal/manage', label: 'Gérer', Icon: GererIcon, rights: [UserType.ADMIN, UserType.SUPER_ADMIN, UserType.MEDIATOR] },
    {
      path: '/admin/newportal/analyze',
      label: 'Analyser',
      Icon: AnalyserIcon,
      rights: [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.OBSERVATOR, UserType.MEDIATOR],
    },
    {
      path: '/admin/newportal/medialibrary',
      label: 'Médiathèque',
      Icon: MediathequeIcon,
      rights: [UserType.SUPER_ADMIN, UserType.ADMIN, UserType.MEDIATOR],
    },
  ];

  const onTabClick = (label: string) => {
    setSelectedTab(label);
  };
  if (!user) {
    router.push('/');
  }
  return (
    <Container className="container-admin-nav" sx={containerStyle}>
      <List sx={{ padding: 0, margin: 0 }}>
        {tabs
          ?.filter((tab) => tab.rights.includes(user?.type ?? 10))
          .map((tab, id) => (
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
