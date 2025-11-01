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
import { UserType } from 'types/user.type';

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
  const [selectedClassroom, setSelectedClassroom] = useState<number | undefined>();
  const { user } = useContext(UserContext);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClassroomSelectFromList = (villageId?: number, countryCode?: string, classroomId?: number) => {
    setSelectedCountry(countryCode);
    setSelectedVillage(villageId);
    setSelectedClassroom(classroomId);
    setTabValue(3);
  };
  // Callback passé à CountryStats (optionnel, utilisé seulement si clic village-monde)
  const handleVillageSelectFromList = (villageId: number, countryCode?: string) => {
    setSelectedVillage(villageId);
    setSelectedCountry(countryCode);
    setTabValue(2);
  };

  const handleCountrySelectFromList = (countryCode?: string) => {
    setSelectedCountry(countryCode);
    setTabValue(1);
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
          {user?.type !== UserType.OBSERVATOR && <Tab label="Classe" {...a11yProps(3)} />}
          {user?.type !== UserType.OBSERVATOR && <Tab label="Données" {...a11yProps(4)} />}
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <GlobalStats handleCountrySelectFromList={handleCountrySelectFromList} onVillageSelect={handleVillageSelectFromList} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <CountryStats onVillageSelect={handleVillageSelectFromList} selectedCountryFilter={selectedCountry} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={2}>
        <VillageStats
          selectedCountry={selectedCountry}
          selectedVillage={selectedVillage}
          onResetFilters={resetVillageFilters}
          handleClassroomSelectFromList={handleClassroomSelectFromList}
        />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={3}>
        <ClassroomStats classroomId={selectedClassroom} villageId={selectedVillage} countryId={selectedCountry} />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={4}>
        <DataDetailsStats />
      </CustomTabPanel>
    </Box>
  );
};

export default DashboardStatsNav;
