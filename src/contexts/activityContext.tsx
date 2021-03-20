import { useRouter } from 'next/router';
import { useQueryCache } from 'react-query';
import React from 'react';

import { Card, CircularProgress } from '@material-ui/core';

import { AnyActivity, AnyActivityData } from 'src/activities/anyActivities.types';
import { getAnyActivity } from 'src/activities/anyActivity';
import type { EditorTypes } from 'src/activities/extendedActivity.types';
import { Modal } from 'src/components/Modal';
import { primaryColor } from 'src/styles/variables.const';
import { getQueryString } from 'src/utils';
import { serializeToQueryUrl } from 'src/utils';
import { Activity, ActivityType, ActivitySubType, ActivityStatus } from 'types/activity.type';

import { UserContext } from './userContext';
import { VillageContext } from './villageContext';

interface ActivityContextValue {
  activity: AnyActivity | null;
  updateActivity(newActivity: Partial<AnyActivity>): void;
  createNewActivity(type: ActivityType, subType?: ActivitySubType, initialData?: AnyActivityData): boolean;
  addContent(type: EditorTypes, value?: string): void;
  deleteContent(index: number): void;
  save(publish?: boolean): Promise<boolean>;
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
  const [draft, setDraft] = React.useState<AnyActivity | null>(null);
  const [draftStep, setDraftStep] = React.useState(0);
  const draftStepTimeout = React.useRef<number | undefined>(undefined);

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

  const getDraft = React.useCallback(
    async (type: ActivityType, subType?: ActivitySubType) => {
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/activities/draft${serializeToQueryUrl({
          villageId: village.id,
          type,
          subType,
        })}`,
      });
      if (response.error) {
        return;
      }
      if (response.data && response.data.draft !== null) {
        setDraft(getAnyActivity(response.data.draft));
      }
    },
    [village, axiosLoggedRequest],
  );

  const createNewActivity = React.useCallback(
    (type: ActivityType, subType?: ActivitySubType, initialData?: AnyActivityData) => {
      if (user === null || village === null) {
        return false;
      }
      const activity: AnyActivity = {
        id: 0,
        type: type,
        subType: subType,
        status: ActivityStatus.DRAFT,
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
      if (type !== ActivityType.QUESTION) {
        getDraft(type, subType).catch();
      }
      return true;
    },
    [user, village, getDraft],
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

  const addContent = (type: EditorTypes, value: string = '') => {
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
  };

  const deleteContent = (index: number) => {
    if (activityContent === null) {
      return;
    }
    const newContent = [...activityContent];
    newContent.splice(index, 1);
    updateActivity({ processedContent: newContent });
  };

  const getAPIContent = React.useCallback(
    (isEdit: boolean, publish: boolean) => {
      const mapIndex = isEdit
        ? activity.content.reduce<{ [key: number]: number }>((acc, c, i) => {
            acc[c.id] = i;
            return acc;
          }, {})
        : {};
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
      const activityData = { ...activity.data };
      if (!publish) {
        activityData.draftUrl = window.location.pathname;
      } else {
        delete activityData.draftUrl;
      }
      content.push({
        key: 'json',
        value: JSON.stringify({
          type: 'data',
          data: activityData,
        }),
        id: isEdit ? activity.dataId : undefined,
      });
      return content;
    },
    [activity],
  );

  const createActivity = React.useCallback(
    async (publish: boolean) => {
      const content = getAPIContent(false, publish);
      const data: Omit<Partial<Activity>, 'content'> & { content: Array<{ key: string; value: string }> } = {
        type: activity.type,
        subType: activity.subType,
        villageId: activity.villageId,
        status: publish ? ActivityStatus.PUBLISHED : ActivityStatus.DRAFT,
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
    },
    [axiosLoggedRequest, getAPIContent, activity],
  );

  const editActivity = React.useCallback(
    async (publish: boolean) => {
      const content = getAPIContent(true, publish);
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
    },
    [getAPIContent, axiosLoggedRequest, activity],
  );

  const publishActivity = React.useCallback(async () => {
    if ((activity?.id ?? 0) === 0) {
      return false; // activity is not yet created!
    }
    const response = await axiosLoggedRequest({
      method: 'PUT',
      url: `/activities/${activity.id}`,
      data: {
        status: ActivityStatus.PUBLISHED,
      },
    });
    if (response.error) {
      return false;
    }
    setActivity(getAnyActivity(response.data));
    return true;
  }, [activity, axiosLoggedRequest]);

  const save = React.useCallback(
    async (publish: boolean = false) => {
      if (activity === null) {
        return false;
      }
      if (activity.status !== ActivityStatus.DRAFT && !publish) {
        return false; // don't save draft for already published activities.
      }
      if (!publish) {
        clearTimeout(draftStepTimeout.current);
        setDraftStep(1);
      }
      queryCache.invalidateQueries('activities');
      let result = false;
      if (activity.id === 0) {
        result = await createActivity(publish);
      } else if (publish) {
        result = (await editActivity(true)) && (await publishActivity());
      } else {
        result = await editActivity(false);
      }

      if (!publish) {
        setDraftStep(2);
        draftStepTimeout.current = window.setTimeout(() => {
          setDraftStep(0);
        }, 1500);
      }
      return result;
    },
    [queryCache, createActivity, editActivity, publishActivity, activity],
  );

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
      {draftStep > 0 && (
        <div style={{ position: 'fixed', bottom: '1rem', right: '4.5rem' }}>
          <Card style={{ backgroundColor: primaryColor, color: 'white', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}>
            {draftStep === 1 && <CircularProgress color="inherit" size="1.25rem" />}
            {draftStep === 2 && <span className="text text--small">Brouillon enregistré</span>}
          </Card>
        </div>
      )}
      <Modal
        open={draft !== null}
        maxWidth="sm"
        fullWidth
        title="Brouillon en cours !"
        cancelLabel="Non"
        confirmLabel="Oui"
        onClose={() => {
          setDraft(null);
        }}
        onConfirm={() => {
          setActivity(draft);
          if (draft.data.draftUrl) {
            router.push(draft.data.draftUrl);
          }
          setDraft(null);
        }}
        noCloseOutsideModal
        noCloseButton
        ariaDescribedBy="brouillon-desc"
        ariaLabelledBy="brouillon-title"
      >
        <div id="brouillon-desc" style={{ padding: '0.5rem' }}>
          <p>Vous avez un brouillon en cours pour cette activité, souhaitez vous le reprendre ?</p>
          <p>
            (Continuer sans ce brouillon en créera un nouveau qui va <strong>supprimer</strong> celui déjà existant.)
          </p>
        </div>
      </Modal>
    </ActivityContext.Provider>
  );
};
