import React from 'react';

import { Avatar, Button } from '@mui/material';

import { CommentIcon } from '../activities/ActivityCard/CommentIcon';
import { icons, DESC } from 'src/components/activities/utils';
import { useActivities } from 'src/services/useActivities';
import { bgPage, primaryColor } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';
import { toDate } from 'src/utils';
import { ActivityType } from 'types/activity.type';

export const PelicoProfilNavigation = () => {
  const { activities } = useActivities({ pelico: true, limit: 5 });

  return (
    <>
      <div
        className="bg-secondary vertical-bottom-margin with-sub-header-height"
        style={{
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 0.5rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', minWidth: 0 }}>
          <span style={{ marginRight: '0.3rem', display: 'flex' }}>
            <Avatar alt={'avatar'} style={{ width: '30px', height: '30px', backgroundColor: bgPage }}>
              <PelicoSouriant style={{ width: '80%', height: 'auto' }} />
            </Avatar>
          </span>
          <span className="text">
            <strong>Pelico</strong>
          </span>
        </div>
      </div>
      <div
        className="bg-secondary vertical-bottom-margin"
        style={{ padding: '1rem', borderRadius: '10px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}
      >
        <h3>
          <b>Dernières activités de Pelico</b>
        </h3>
        {activities.slice(0, 3).map((activity, index) => {
          const ActivityIcon = icons[activity.type] || null;
          return (
            <div key={index}>
              {activity.type !== ActivityType.GAME && (
                <>
                  <div style={{ fontSize: 'smaller', paddingBottom: '1rem' }}>
                    <strong>{DESC[activity.type]},&nbsp;</strong>
                    le {toDate(activity.createDate as string)}
                    {ActivityIcon && (
                      <ActivityIcon
                        style={{
                          float: 'right',
                          fill: primaryColor,
                          margin: '1.5rem 0.65rem 0 0',
                          width: '2rem',
                          height: 'auto',
                          alignSelf: 'center',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ paddingBottom: '1rem' }}>
                    <CommentIcon count={activity.commentCount} activityId={activity.id} />
                    <Button component="a" color="primary" variant="outlined" href={`/activite/${activity.id}`}>
                      {"Voir l'activité"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
