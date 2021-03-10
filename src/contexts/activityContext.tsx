import { useRouter } from 'next/router';
import { useQueryCache } from 'react-query';
import React from 'react';

import { AnyActivity, AnyActivityData } from 'src/activities/anyActivities.types';
import { getAnyActivity } from 'src/activities/anyActivity';
import type { EditorTypes } from 'src/activities/extendedActivity.types';
import { serializeToQueryUrl } from 'src/utils';
import { getQueryString } from 'src/utils';
import { Activity, ActivityType, ActivitySubType } from 'types/activity.type';

import { UserContext } from './userContext';
import { VillageContext } from './villageContext';

interface ActivityContextValue {
  activity: AnyActivity | null;
  updateActivity(newActivity: Partial<AnyActivity>): void;
  createNewActivity(type: ActivityType, subType?: ActivitySubType, initialData?: AnyActivityData): boolean;
  addContent(type: EditorTypes, value?: string): void;
  deleteContent(index: number): void;
  save(): Promise<boolean>;
  createActivityIfNotExist(type: ActivityType, subType: ActivitySubType, initialData?: AnyActivityData): Promise<void>;
}

export const ActivityContext = React.createContext<ActivityContextValue>(null);

interface ActivityContextProviderProps {
  children: React.ReactNode;
}

export const ActivityContextProvider: React.FC<ActivityContextProviderProps> = ({ children }: ActivityContextProviderProps) => {
  const router = useRouter();
  const queryCache = useQueryCache();
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const [activity, setActivity] = React.useState<AnyActivity | null>(null);

  const currentActivityId = activity === null ? null : activity.id;

  const getActivity = React.useCallback(
    async (id: number) => {
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/activities/${id}`,
      });
      if (response.error) {
        router.push('/');
      } else {
        setActivity(getAnyActivity(response.data));
      }
    },
    [router, axiosLoggedRequest],
  );

  React.useEffect(() => {
    if ('activity-id' in router.query) {
      const newActivityId = parseInt(getQueryString(router.query['activity-id']), 10);
      if (currentActivityId === null || currentActivityId !== newActivityId) {
        setActivity(null);
        getActivity(newActivityId).catch();
      }
    }
  }, [getActivity, router, currentActivityId]);

  const updateActivity = React.useCallback((newActivity: Partial<AnyActivity>) => {
    setActivity((a) => (a === null ? a : { ...a, ...newActivity }));
  }, []);

  const createNewActivity = React.useCallback(
    (type: ActivityType, subType?: ActivitySubType, initialData?: AnyActivityData) => {
      if (user === null || village === null) {
        return false;
      }
      const activity: AnyActivity = {
        id: 0,
        type: type,
        subType: subType,
        userId: user.id,
        villageId: village.id,
        content: [],
        responseActivityId: null,
        responseType: null,
        data: initialData || {},
        dataId: 0,
        processedContent: [{ type: 'text', id: 0, value: '' }],
      };
      setActivity(activity);
      return true;
    },
    [user, village],
  );

  const createActivityIfNotExist = React.useCallback(
    async (type: ActivityType, subType: ActivitySubType, initialData?: AnyActivityData) => {
      if (user === null || village === null) {
        return;
      }
      const userId = user.id;
      const villageId = village.id;
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: '/activities' + serializeToQueryUrl({ type, subType, userId, villageId }),
      });
      if (response.data && response.data.length > 0) setActivity(getAnyActivity(response.data[0]));
      else {
        createNewActivity(type, subType, initialData);
      }
    },
    [user, village, axiosLoggedRequest, createNewActivity],
  );

  const activityContent = activity?.processedContent || null;

  const addContent = React.useCallback(
    (type: EditorTypes, value: string = '') => {
      if (activityContent === null) {
        return;
      }
      const newId = Math.max(1, activity.dataId || 0, ...activityContent.map((p) => p.id)) + 1;
      const newContent = activityContent;
      newContent.push({
        id: newId,
        type,
        value,
      });
      updateActivity({ processedContent: newContent });
    },
    [updateActivity, activity, activityContent],
  );

  const deleteContent = React.useCallback(
    (index: number) => {
      if (activityContent === null) {
        return;
      }
      const newContent = [...activityContent];
      newContent.splice(index, 1);
      updateActivity({ processedContent: newContent });
    },
    [updateActivity, activityContent],
  );

  const getAPIContent = React.useCallback(
    (isEdit: boolean) => {
      const mapIndex = isEdit
        ? {}
        : activity.content.reduce<{ [key: number]: number }>((acc, c, i) => {
            acc[c.id] = i;
            return acc;
          }, {});
      const content: Array<{ key: string; value: string; id?: number }> = activity.processedContent
        .map((p) => {
          let data: { key: string; value: string; id?: number } | null = null;
          if (p.type === 'text' || p.type === 'image' || p.type === 'video' || p.type === 'h5p') {
            data = {
              key: p.type,
              value: p.value,
            };
          }
          if (data !== null && mapIndex[p.id] !== undefined && p.id !== activity.dataId) {
            data.id = p.id;
          }
          return data;
        })
        .filter((c) => c !== null);
      content.push({
        key: 'json',
        value: JSON.stringify({
          type: 'data',
          data: activity.data,
        }),
        id: isEdit ? activity.dataId : undefined,
      });
      return content;
    },
    [activity],
  );

  const createActivity = React.useCallback(async () => {
    const content = getAPIContent(false);
    const data: Omit<Partial<Activity>, 'content'> & { content: Array<{ key: string; value: string }> } = {
      type: activity.type,
      subType: activity.subType,
      villageId: activity.villageId,
      content,
    };
    const response = await axiosLoggedRequest({
      method: 'POST',
      url: '/activities',
      data,
    });
    if (response.error) {
      return false;
    } else {
      setActivity(getAnyActivity(response.data));
      return true;
    }
  }, [axiosLoggedRequest, getAPIContent, activity]);

  const editActivity = React.useCallback(async () => {
    const content = getAPIContent(true);
    const response = await axiosLoggedRequest({
      method: 'PUT',
      url: `/activities/${activity.id}/content`,
      data: {
        content,
      },
    });
    if (response.error) {
      return false;
    }
    setActivity(getAnyActivity(response.data));
    return true;
  }, [getAPIContent, axiosLoggedRequest, activity]);

  const save = React.useCallback(async () => {
    if (activity === null) {
      return false;
    }
    queryCache.invalidateQueries('activities');
    if (activity.id === 0) {
      return await createActivity();
    } else {
      return await editActivity();
    }
  }, [queryCache, createActivity, editActivity, activity]);

  return (
    <ActivityContext.Provider
      value={{
        activity,
        updateActivity,
        createNewActivity,
        addContent,
        deleteContent,
        createActivityIfNotExist,
        save,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
