import React from 'react';

import { Grid, Box } from '@material-ui/core';

import { PresentationMascotteActivity } from 'src/activity-types/presentation.types';
import { AvatarImg } from 'src/components/Avatar';
import { Map } from 'src/components/Map';
import { getMapPosition } from 'src/utils/getMapPosition';

import { ActivityViewProps } from './activity-view.types';

export const MascotteActivityView: React.FC<ActivityViewProps<PresentationMascotteActivity>> = ({
  activity,
  user = null,
}: ActivityViewProps<PresentationMascotteActivity>) => {
  const [position, setPosition] = React.useState<[number, number] | null>(null);

  const getPosition = React.useCallback(async () => {
    if (user === null) {
      setPosition(null);
    } else {
      const pos = await getMapPosition(user);
      setPosition(pos);
    }
  }, [user]);

  React.useEffect(() => {
    getPosition().catch();
  }, [getPosition]);

  return (
    <div>
      {activity && (
        <>
          <Grid container spacing={0} style={{ marginTop: '2rem' }}>
            <Grid item xs={12} md={position === null ? 12 : 6}>
              <div style={{ marginRight: '0.25rem' }}>
                {activity.processedContent.length > 0 &&
                  activity.processedContent[0].value.split('\n').map((s, index) => (
                    <p key={index} style={{ margin: '0.5rem 0' }}>
                      {s}
                    </p>
                  ))}
              </div>
            </Grid>
            {position !== null && (
              <Grid item xs={12} md={6}>
                <div style={{ height: '16rem' }}>
                  <Map position={position} zoom={5} markers={[{ position: position, label: activity.data.presentation }]} />
                </div>
              </Grid>
            )}
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="center" m={4}>
                <AvatarImg src={activity.data.mascotteImage} />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <div style={{ alignItems: 'center', display: 'flex', height: '100%' }}>
                <div>
                  {activity.processedContent.length > 1 &&
                    activity.processedContent[1].value.split('\n').map((s, index) => (
                      <p key={index} style={{ margin: '0.5rem 0' }}>
                        {s}
                      </p>
                    ))}
                </div>
              </div>
            </Grid>
          </Grid>
          <div>
            {activity.processedContent.length > 2 &&
              activity.processedContent[2].value.split('\n').map((s, index) => (
                <p key={index} style={{ margin: '0.5rem 0' }}>
                  {s}
                </p>
              ))}
          </div>
        </>
      )}
    </div>
  );
};
