import React from 'react';
import type { Activity } from 'server/entities/activity';

export default function ActivityCard(activity: Pick<Activity, 'images' | 'content' | 'phase'>) {
  return (
    <div>
      <p>image: {activity.images ? activity.images[0].imageUrl : 'none'}</p>
      <p>content: {activity.content.map((e) => e.value)}</p>
      {/* <p>Status: {activity.status}</p>
      <p>type: {activity.type}</p> */}
    </div>
  );
}
