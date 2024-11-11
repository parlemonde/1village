import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import React from 'react';

import ClassroomStats from './ClassroomStats';
import CountryStats from './CountryStats';
import DataDetailsStats from './DataDetailsStats';
import GlobalStats from './GlobalStats';
import VillageStats from './VillageStats';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DashboardStatsNav = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1 }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="1Village" {...a11yProps(0)} />
          <Tab label="Pays" {...a11yProps(1)} />
          <Tab label="Village-monde" {...a11yProps(2)} />
          <Tab label="Classe" {...a11yProps(3)} />
          <Tab label="Données" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <GlobalStats />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CountryStats />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <VillageStats />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ClassroomStats />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <DataDetailsStats />
      </CustomTabPanel>
    </Box>
  );
};

export default DashboardStatsNav;
