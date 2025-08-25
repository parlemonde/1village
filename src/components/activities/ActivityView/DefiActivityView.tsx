import { Grid } from '@mui/material';
import Image from 'next/image';
import React from 'react';

import type { ActivityViewProps } from './activity-view.types';
import { ECO_ACTIONS, getDefi, isCooking, isEco, isLanguage, getLanguageTheme } from 'src/activity-types/defi.constants';
import type { DefiActivity } from 'src/activity-types/defi.types';
import { ContentView } from 'src/components/activities/content/ContentView';
import { LightBox } from 'src/components/lightbox/Lightbox';
import { bgPage } from 'src/styles/variables.const';

export const DefiActivityView = ({ activity }: ActivityViewProps<DefiActivity>) => {
  return (
    <div>
      <div style={{ margin: '1rem 0' }}>
        <div className="text-center" style={{ marginBottom: '1rem' }}>
          <h3>
            {isCooking(activity)
              ? activity.data.name
              : isEco(activity)
              ? ECO_ACTIONS[activity.data.type]
              : isLanguage(activity)
              ? getLanguageTheme(activity.data)
              : null}
          </h3>
        </div>
        {isCooking(activity) && (
          <Grid container spacing={2}>
            {activity.data.image && (
              <Grid item xs={12} md={4}>
                <div style={{ width: '100%', height: '100%', minHeight: '200px', position: 'relative' }}>
                  <LightBox url={activity.data.image}>
                    <Image layout="fill" objectFit="contain" alt="image du plat" unoptimized src={activity.data.image} />
                  </LightBox>
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
        <ContentView content={activity.content} activityId={activity.id} />
      </div>

      <div style={{ margin: '2rem 0', backgroundColor: bgPage, padding: '0.5rem', borderRadius: '5px' }}>
        <strong>Votre défi : </strong>
        {getDefi(activity.subType || 0, activity.data)}
      </div>
    </div>
  );
};
