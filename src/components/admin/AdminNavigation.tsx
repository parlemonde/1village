import { useRouter } from 'next/router';
import React from 'react';

import GroupIcon from '@mui/icons-material/Group';
import InsertChartOutlinedOutlinedIcon from '@mui/icons-material/InsertChartOutlinedOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import TimelineIcon from '@mui/icons-material/Timeline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';

const DRAWER_WIDTH = 220;
const TABS = ['villages', 'users', 'stats', 'analytics'];

export const AdminNavigation = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = React.useState(-1);

  React.useEffect(() => {
    const index = TABS.findIndex((tab) => tab === router.pathname.split('/')[2]);
    setSelectedTab(index);
  }, [router.pathname]);

  const goToPath = (path: string) => () => {
    router.push(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
        },
      }}
    >
      <Toolbar />
      <div style={{ overflow: 'auto' }}>
        <List>
          <ListItem button selected={selectedTab === 0} onClick={goToPath('/admin/villages')}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary="Villages" />
          </ListItem>
          <ListItem button selected={selectedTab === 1} onClick={goToPath('/admin/users')}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Utilisateurs" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button selected={selectedTab === 2} onClick={goToPath('/admin/stats')}>
            <ListItemIcon>
              <InsertChartOutlinedOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Statistiques" />
          </ListItem>
          <ListItem button selected={selectedTab === 3} onClick={goToPath('/admin/analytics')}>
            <ListItemIcon>
              <TimelineIcon />
            </ListItemIcon>
            <ListItemText primary="Web Analytics" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};
