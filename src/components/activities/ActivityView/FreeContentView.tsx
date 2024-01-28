import React from 'react';

import type { ActivityViewProps } from './activity-view.types';
import type { FreeContentActivity } from 'src/activity-types/freeContent.types';
import { ContentView } from 'src/components/activities/content/ContentView';

export const FreeContentView = ({ activity }: ActivityViewProps<FreeContentActivity>) => {
  return (
    <div>
      <h3>{activity.data.title}</h3>
      <ContentView content={activity.content} activityId={activity.id} />
    </div>
  );
};
