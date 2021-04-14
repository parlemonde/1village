import React from 'react';

import { Grid } from '@material-ui/core';

import { ECO_ACTIONS, getCookingDefi, getEcoDefi, isCooking, isEco } from 'src/activity-types/defi.const';
import { DefiActivity } from 'src/activity-types/defi.types';
import { ContentView } from 'src/components/activities/content/ContentView';
import { bgPage } from 'src/styles/variables.const';

import { ActivityViewProps } from './activity-view.types';

export const DefiActivityView: React.FC<ActivityViewProps<DefiActivity>> = ({ activity }: ActivityViewProps<DefiActivity>) => {
  return (
    <div>
      <div style={{ margin: '1rem 0' }}>
        <div className="text-center">
          <h3>{isCooking(activity) ? activity.data.name : isEco(activity) ? ECO_ACTIONS[activity.data.type] : null}</h3>
        </div>
        {isCooking(activity) && (
          <Grid container spacing={2}>
            {activity.data.image && (
              <Grid item xs={12} md={4}>
                <div style={{ width: '100%', marginTop: '1rem' }}>
                  <img alt="image du plat" src={activity.data.image} style={{ width: '100%', height: 'auto' }} />
                </div>
              </Grid>
            )}
            <Grid item xs={12} md={activity.data.image ? 8 : 12}>
              <p>{activity.data.history}</p>
              <p>{activity.data.explanation}</p>
            </Grid>
          </Grid>
        )}
      </div>

      <div style={{ margin: '1rem 0' }}>
        <ContentView content={activity.processedContent} />
      </div>

      <div style={{ margin: '2rem 0', backgroundColor: bgPage, padding: '0.5rem', borderRadius: '5px' }}>
        <strong>Votre défi : </strong>
        {isCooking(activity) ? getCookingDefi(activity.data) : isEco(activity) ? getEcoDefi(activity.data) : null}
      </div>
    </div>
  );
};
