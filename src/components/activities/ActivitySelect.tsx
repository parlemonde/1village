import React from 'react';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button, CircularProgress } from '@mui/material';

import { ThemeChoiceButton } from 'src/components/buttons/ThemeChoiceButton';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useActivity } from 'src/services/useActivity';
import { serializeToQueryUrl } from 'src/utils';
import type { Activity } from 'types/activity.type';

import { Activities } from './List';

const ACTIVITIES_PER_PAGE = 10;

interface ActivitySelectProps {
  value: number | null;
  onChange(newValue: number | null, newType: number | null): void;
  onSelect(): void;
  style?: React.CSSProperties;
}

export const ActivitySelect = ({ value, onChange, onSelect, style }: ActivitySelectProps) => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const { activity: selectedActivity } = useActivity(value ?? -1);

  const [activities, setActivities] = React.useState<Activity[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [canFetchMore, setCanFetchMore] = React.useState(true);

  const dataPage = React.useRef(0);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const fetchData = React.useCallback(async () => {
    if (!village) {
      return;
    }
    setLoading(true);
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/activities${serializeToQueryUrl({
        limit: ACTIVITIES_PER_PAGE,
        page: dataPage.current,
        villageId: village.id,
        countries: village.countries.join(','),
        pelico: true,
      })}`,
    });
    if (response.error) {
      // todo
      return;
    }
    dataPage.current += 1;
    const newActivities = response.data;
    setActivities((a) => [...a, ...newActivities]);
    if (newActivities.length < ACTIVITIES_PER_PAGE) {
      setCanFetchMore(false);
    }
    setLoading(false);
  }, [axiosLoggedRequest, village]);
  React.useEffect(() => {
    if (dataPage.current === 0) {
      fetchData().catch();
    }
  }, [fetchData]);

  return (
    <div style={style} ref={selectRef}>
      <ThemeChoiceButton
        label="Sélectionner une activité"
        description=""
        isOpen={true}
        onClick={() => {
          if (selectRef.current) {
            selectRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        additionalContent={
          selectedActivity !== null ? (
            <div style={{ height: '50vh', overflow: 'auto' }}>
              <Activities activities={[selectedActivity]} noButtons />
              <div style={{ width: '100%', margin: '3rem 0', minHeight: '2rem' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    onChange(null, null);
                  }}
                >
                  Choisir une autre activité
                </Button>
                <Button onClick={onSelect} variant="outlined" style={{ float: 'right' }} color="primary">
                  Réagir à cette activité
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ height: '50vh', overflow: 'auto' }}>
              <Activities
                activities={activities}
                noButtons
                onSelect={(index) => {
                  onChange(activities[index].id, activities[index].type);
                }}
              />
              {loading ? (
                <div className="text-center">
                  <CircularProgress size="1.5rem" />
                </div>
              ) : (
                canFetchMore && (
                  <div className="text-center">
                    <Button variant="contained" color="primary" onClick={fetchData}>
                      Voir plus
                    </Button>
                  </div>
                )
              )}
            </div>
          )
        }
      />
    </div>
  );
};
