import { Card, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { useQueryClient } from 'react-query';

import { UserContext } from './userContext';
import { VillageContext } from './villageContext';
import { Modal } from 'src/components/Modal';
import { getActivityPhase } from 'src/components/activities/utils';
import { primaryColor } from 'src/styles/variables.const';
import { serializeToQueryUrl, debounce, getQueryString } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { ActivityContentType, ActivityContent, Activity, AnyData } from 'types/activity.type';
import { ActivityType, ActivityStatus } from 'types/activity.type';

type ActivitySaveResponse = { success: false } | { success: true; activity: Activity };

interface ActivityContextValue {
  activity: Activity | null;
  setActivity(newActivity: Activity | null): void;
  updateActivity(newActivity: Partial<Activity>): void;
  createNewActivity(
    type: number,
    selectedPhase: number,
    subType?: number,
    initialData?: AnyData,
    responseActivityId?: number | null,
    responseType?: number | null,
    initialContent?: ActivityContent[],
  ): boolean;
  addContent(type: ActivityContentType, value?: string, index?: number): void;
  deleteContent(index: number): void;
  save(publish?: boolean): Promise<ActivitySaveResponse>;
  createActivityIfNotExist(type: number, selectedPhase: number, subType?: number, initialData?: AnyData, isVillageActivity?: boolean): Promise<void>;
  setDraft(draft: Activity | null): void;
  activityId: number | null;
  setActivityId(activityId: number): void;
}

export const ActivityContext = React.createContext<ActivityContextValue>({
  activity: null,
  setActivity: () => {},
  updateActivity: () => {},
  createNewActivity: () => false,
  addContent: () => {},
  deleteContent: () => {},
  save: async () => ({ success: false }),
  createActivityIfNotExist: async () => {},
  setDraft: () => {},
  activityId: null,
  setActivityId: () => {},
});

function getInitialActivity(): Activity | null {
  try {
    return JSON.parse(sessionStorage.getItem('activity') || 'null') || null;
  } catch {
    return null;
  }
}
function saveActivityInSession(activity: Activity | null): void {
  try {
    sessionStorage.setItem('activity', JSON.stringify(activity));
  } catch (e) {
    return;
  }
}
const debouncedSaveActivityInSession = debounce(saveActivityInSession, 400, false);

export const ActivityContextProvider = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const [activity, setActivity] = React.useState<Activity | null>(null);
  const [draft, setDraft] = React.useState<Activity | null>(null);
  const [draftStep, setDraftStep] = React.useState(0);
  const draftStepTimeout = React.useRef<number | undefined>(undefined);
  const [activityId, setActivityId] = React.useState<number | null>(null);

  const currentActivityId = activity === null ? null : activity.id;

  // Save & get activity to session storage.
  React.useEffect(() => {
    setActivity(getInitialActivity);
  }, []);
  React.useEffect(() => {
    debouncedSaveActivityInSession(activity);
  }, [activity]);

  const getActivity = React.useCallback(
    async (id: number) => {
      const response = await axiosRequest({
        method: 'GET',
        url: `/activities/${id}`,
      });
      if (response.error) {
        router.push('/');
      } else {
        setActivity(response.data);
      }
    },
    [router],
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

  const updateActivity = React.useCallback((newActivity: Partial<Activity>) => {
    setActivity((a) => (a === null ? a : { ...a, ...newActivity }));
  }, []);

  const getDraft = React.useCallback(
    async (type: number, subType?: number) => {
      if (!village) {
        return;
      }
      const response = await axiosRequest({
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
        setDraft(response.data.draft);
      }
    },
    [village],
  );

  const createNewActivity = React.useCallback(
    (
      type: number,
      selectedPhase: number,
      subType?: number,
      initialData?: AnyData,
      responseActivityId?: number | null,
      responseType?: number | null,
      initialContent?: ActivityContent[],
    ) => {
      if (user === null || village === null) {
        return false;
      }
      const newActivity: Activity = {
        id: 0,
        phase: getActivityPhase(type, village.activePhase, selectedPhase),
        type: type,
        subType: subType,
        status: ActivityStatus.DRAFT,
        userId: user.id,
        villageId: village.id,
        content: initialContent || [{ type: 'text', id: 0, value: '' }],
        responseActivityId: responseActivityId ?? null,
        responseType: responseType ?? null,
        data: initialData || {},
        isPinned: false,
      };
      setActivity(newActivity);
      if (type !== ActivityType.QUESTION && type !== ActivityType.ANTHEM) {
        getDraft(type, subType).catch();
      }
      return true;
    },
    [user, village, getDraft],
  );

  const createActivityIfNotExist = React.useCallback(
    async (type: number, selectedPhase: number, subType?: number, initialData?: AnyData, isVillageActivity?: boolean) => {
      if (user === null || village === null) {
        return;
      }

      const userId = isVillageActivity ? undefined : user.id;
      const villageId = village.id;
      const responsePublished = await axiosRequest({
        method: 'GET',
        url: '/activities' + serializeToQueryUrl({ type, subType, userId, villageId, status: ActivityStatus.PUBLISHED }),
      });
      const responseDraft = await axiosRequest({
        method: 'GET',
        url: '/activities' + serializeToQueryUrl({ type, subType, userId, villageId, status: ActivityStatus.DRAFT }),
      });
      const response = [
        ...(responsePublished.error ? [] : (responsePublished.data as Activity[])),
        ...(responseDraft.error ? [] : (responseDraft.data as Activity[])),
      ];
      if (response.length > 0) {
        setActivity(response[0]);
      } else {
        createNewActivity(type, selectedPhase, subType, initialData);
      }
    },
    [user, village, createNewActivity],
  );

  const addContent = React.useCallback(
    (type: ActivityContentType, value: string = '', index?: number) => {
      if (!activity) {
        return;
      }
      const newContent = activity.content ? [...activity.content] : [];
      const newId = Math.max(1, ...newContent.map((p) => p.id)) + 1;
      if (index !== undefined) {
        newContent.splice(index, 0, {
          id: newId,
          type,
          value,
        });
      } else {
        newContent.push({
          id: newId,
          type,
          value,
        });
      }
      updateActivity({ content: newContent });
    },
    [activity, updateActivity],
  );

  const deleteContent = React.useCallback(
    (index: number) => {
      if (!activity) {
        return;
      }
      const newContent = activity.content ? [...activity.content] : [];
      if (newContent.length <= index) {
        return;
      }
      newContent.splice(index, 1);
      updateActivity({ content: newContent });
    },
    [activity, updateActivity],
  );

  // Use ref to always save last activity
  const activityRef = React.useRef<Activity | null>(activity);
  React.useEffect(() => {
    activityRef.current = activity;
  }, [activity]);

  const createActivity = React.useCallback(
    async (publish: boolean): Promise<ActivitySaveResponse> => {
      if (!activityRef.current || !village) {
        return {
          success: false,
        };
      }
      const data: Partial<Activity> = {
        phase: getActivityPhase(activityRef.current.type, village.activePhase, activityRef.current.phase),
        type: activityRef.current.type,
        subType: activityRef.current.subType,
        villageId: activityRef.current.villageId,
        responseActivityId: activityRef.current.responseActivityId,
        responseType: activityRef.current.responseType,
        status: publish ? ActivityStatus.PUBLISHED : ActivityStatus.DRAFT,
        content: activityRef.current.content,
        data: activityRef.current.data,
        isPinned: activityRef.current.isPinned,
      };
      if (!publish) {
        if (data.data) {
          data.data.draftUrl = window.location.pathname;
        } else {
          data.data = {
            draftUrl: window.location.pathname,
          };
        }
      }
      const response = await axiosRequest({
        method: 'POST',
        url: '/activities',
        data,
      });
      if (response.error) {
        return {
          success: false,
        };
      } else {
        setActivity(response.data);
        return {
          success: true,
          activity: response.data as Activity,
        };
      }
    },
    [village],
  );

  const editActivity = React.useCallback(
    async (publish: boolean): Promise<ActivitySaveResponse> => {
      if (!activityRef.current || !village) {
        return {
          success: false,
        };
      }
      const data: Partial<Activity> = {
        content: activityRef.current.content,
        data: activityRef.current.data,
        isPinned: activityRef.current.isPinned,
        displayAsUser: activityRef.current.displayAsUser,
      };
      // if not yet published, the response type and isPinned can be changed.
      if (activityRef.current.status === ActivityStatus.DRAFT) {
        data.responseActivityId = activityRef.current.responseActivityId;
        data.responseType = activityRef.current.responseType;
      }
      if (publish) {
        data.phase = getActivityPhase(activityRef.current.type, village.activePhase, activityRef.current.phase);
        data.status = ActivityStatus.PUBLISHED;
      } else {
        if (data.data) {
          data.data.draftUrl = window.location.pathname;
        } else {
          data.data = {
            draftUrl: window.location.pathname,
          };
        }
      }
      const response = await axiosRequest({
        method: 'PUT',
        url: `/activities/${activityRef.current.id}`,
        data,
      });
      if (response.error) {
        return {
          success: false,
        };
      }
      setActivity(response.data);
      return {
        success: true,
        activity: response.data as Activity,
      };
    },
    [village],
  );

  const save = React.useCallback(
    async (publish: boolean = false): Promise<ActivitySaveResponse> => {
      if (activityRef.current === null) {
        return {
          success: false,
        };
      }
      if (activityRef.current.status !== ActivityStatus.DRAFT && !publish) {
        return {
          success: false,
        }; // don't save draft for already published activities.
      }
      if (!publish) {
        clearTimeout(draftStepTimeout.current);
        setDraftStep(1);
      }
      queryClient.invalidateQueries('activities');
      let result: ActivitySaveResponse = { success: false };
      if (activityRef.current.id === 0) {
        result = await createActivity(publish);
      } else {
        result = await editActivity(publish);
      }

      if (!publish) {
        setDraftStep(2);
        draftStepTimeout.current = window.setTimeout(() => {
          setDraftStep(0);
        }, 1500);
      }
      return result;
    },
    [queryClient, createActivity, editActivity],
  );

  const value = React.useMemo(
    () => ({
      activity,
      setActivity,
      updateActivity,
      createNewActivity,
      addContent,
      deleteContent,
      createActivityIfNotExist,
      save,
      setDraft,
      activityId,
      setActivityId,
    }),
    [activity, setActivity, updateActivity, createNewActivity, addContent, deleteContent, createActivityIfNotExist, save, activityId, setActivityId],
  );

  return (
    <ActivityContext.Provider value={value}>
      {children}
      {draftStep > 0 && (
        <div style={{ position: 'fixed', bottom: '1rem', right: '4.5rem' }}>
          <Card style={{ backgroundColor: primaryColor, color: 'white', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center' }}>
            {draftStep === 1 && <CircularProgress color="inherit" size="1.25rem" />}
            {draftStep === 2 && <p className="text text--small">Brouillon enregistré</p>}
          </Card>
        </div>
      )}
      <Modal
        open={draft !== null}
        maxWidth="sm"
        fullWidth
        title="Brouillon en cours !"
        cancelLabel="Créer une nouvelle activité"
        confirmLabel="Reprendre le brouillon"
        onClose={() => {
          setDraft(null);
        }}
        onConfirm={() => {
          if (draft === null) {
            return;
          }
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
