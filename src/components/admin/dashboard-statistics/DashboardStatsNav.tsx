import React, { useContext, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import ClassroomStats from './ClassroomStats';
import CountryStats from './CountryStats';
import DataDetailsStats from './DataDetailsStats';
import GlobalStats from './GlobalStats';
import VillageStats from './VillageStats';
import { UserContext } from 'src/contexts/userContext';

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
  const [tabValue, setTabValue] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>();
  const [selectedVillage, setSelectedVillage] = useState<number | undefined>();
  const { user } = useContext(UserContext);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Callback passé à CountryStats (optionnel, utilisé seulement si clic village-monde)
  const handleVillageSelectFromList = (villageId: number, countryCode?: string) => {
    setSelectedVillage(villageId);
    setSelectedCountry(countryCode);
    setTabValue(2);
  };

  const resetVillageFilters = () => {
    setSelectedCountry(undefined);
    setSelectedVillage(undefined);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, marginBottom: 2, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="1Village" {...a11yProps(0)} />
          <Tab label="Pays" {...a11yProps(1)} />
          <Tab label="Village-monde" {...a11yProps(2)} />
          {user?.type !== 5 && <Tab label="Classe" {...a11yProps(3)} />}
          {user?.type !== 5 && <Tab label="Données" {...a11yProps(4)} />}
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <GlobalStats />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <CountryStats onVillageSelect={handleVillageSelectFromList} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        <VillageStats selectedCountry={selectedCountry} selectedVillage={selectedVillage} onResetFilters={resetVillageFilters} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={3}>
        <ClassroomStats />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={4}>
        <DataDetailsStats />
      </CustomTabPanel>
    </Box>
  );
};

export default DashboardStatsNav;
