import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import React from 'react';

import { Card, CircularProgress } from '@mui/material';

import { Modal } from 'src/components/Modal';
import { getActivityPhase } from 'src/components/activities/utils';
import { primaryColor } from 'src/styles/variables.const';
import { serializeToQueryUrl, debounce, getQueryString } from 'src/utils';
import type { Activity, AnyData, ActivityContentType, ActivityContent } from 'types/activity.type';
import { ActivityType, ActivityStatus } from 'types/activity.type';

import { UserContext } from './userContext';
import { VillageContext } from './villageContext';

interface ActivityContextValue {
  activity: Activity | null;
  setActivity(newActivity: Activity | null): void;
  updateActivity(newActivity: Partial<Activity>): void;
  createNewActivity(
    type: number,
    subType?: number,
    initialData?: AnyData,
    responseActivityId?: number | null,
    responseType?: number | null,
    initialContent?: ActivityContent[],
  ): boolean;
  addContent(type: ActivityContentType, value?: string, index?: number): void;
  deleteContent(index: number): void;
  save(publish?: boolean): Promise<boolean>;
  createActivityIfNotExist(type: number, subType?: number, initialData?: AnyData): Promise<void>;
}

export const ActivityContext = React.createContext<ActivityContextValue>({
  activity: null,
  setActivity: () => {},
  updateActivity: () => {},
  createNewActivity: () => false,
  addContent: () => {},
  deleteContent: () => {},
  save: async () => false,
  createActivityIfNotExist: async () => {},
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
  } catch {
    return;
  }
}
const debouncedSaveActivityInSession = debounce(saveActivityInSession, 400, false);

export const ActivityContextProvider: React.FC = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const [activity, setActivity] = React.useState<Activity | null>(null);
  const [draft, setDraft] = React.useState<Activity | null>(null);
  const [draftStep, setDraftStep] = React.useState(0);
  const draftStepTimeout = React.useRef<number | undefined>(undefined);

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
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/activities/${id}`,
      });
      if (response.error) {
        router.push('/');
      } else {
        setActivity(response.data);
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

  const updateActivity = React.useCallback((newActivity: Partial<Activity>) => {
    setActivity((a) => (a === null ? a : { ...a, ...newActivity }));
  }, []);

  const getDraft = React.useCallback(
    async (type: number, subType?: number) => {
      if (!village) {
        return;
      }
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
        setDraft(response.data.draft);
      }
    },
    [village, axiosLoggedRequest],
  );

  const createNewActivity = React.useCallback(
    (
      type: number,
      subType?: number,
      initialData?: AnyData,
      responseActivityId?: number | null,
      responseType?: number | null,
      initialContent?: ActivityContent[],
    ) => {
      if (user === null || village === null) {
        return false;
      }
      const activity: Activity = {
        id: 0,
        phase: getActivityPhase(type, village.activePhase),
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
      setActivity(activity);
      if (type !== ActivityType.QUESTION) {
        getDraft(type, subType).catch();
      }
      return true;
    },
    [user, village, getDraft],
  );

  const createActivityIfNotExist = React.useCallback(
    async (type: number, subType?: number, initialData?: AnyData) => {
      if (user === null || village === null) {
        return;
      }
      const userId = user.id;
      const villageId = village.id;
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: '/activities' + serializeToQueryUrl({ type, subType, userId, villageId }),
      });
      if (response.data && response.data.length > 0) {
        setActivity(response.data[0]);
      } else {
        createNewActivity(type, subType, initialData);
      }
    },
    [user, village, axiosLoggedRequest, createNewActivity],
  );

  const addContent = (type: ActivityContentType, value: string = '', index?: number) => {
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
  };

  const deleteContent = (index: number) => {
    if (!activity) {
      return;
    }
    const newContent = activity.content ? [...activity.content] : [];
    if (newContent.length <= index) {
      return;
    }
    newContent.splice(index, 1);
    updateActivity({ content: newContent });
  };

  const createActivity = React.useCallback(
    async (publish: boolean) => {
      if (!activity || !village) {
        return false;
      }
      const data: Partial<Activity> = {
        phase: getActivityPhase(activity.type, village.activePhase),
        type: activity.type,
        subType: activity.subType,
        villageId: activity.villageId,
        responseActivityId: activity.responseActivityId,
        responseType: activity.responseType,
        status: publish ? ActivityStatus.PUBLISHED : ActivityStatus.DRAFT,
        content: activity.content,
        data: activity.data,
        isPinned: activity.isPinned,
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
      const response = await axiosLoggedRequest({
        method: 'POST',
        url: '/activities',
        data,
      });
      if (response.error) {
        return false;
      } else {
        setActivity(response.data);
        return true;
      }
    },
    [axiosLoggedRequest, activity, village],
  );

  const editActivity = React.useCallback(
    async (publish: boolean) => {
      if (!activity || !village) {
        return false;
      }
      const data: Partial<Activity> = {
        content: activity.content,
        data: activity.data,
        isPinned: activity.isPinned,
      };
      // if not yet published, the response type and isPinned can be changed.
      if (activity.status === ActivityStatus.DRAFT) {
        data.responseActivityId = activity.responseActivityId;
        data.responseType = activity.responseType;
      }
      if (publish) {
        data.phase = getActivityPhase(activity.type, village.activePhase);
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
      const response = await axiosLoggedRequest({
        method: 'PUT',
        url: `/activities/${activity.id}`,
        data,
      });
      if (response.error) {
        return false;
      }
      setActivity(response.data);
      return true;
    },
    [axiosLoggedRequest, activity, village],
  );

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
      queryClient.invalidateQueries('activities');
      let result = false;
      if (activity.id === 0) {
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
    [queryClient, createActivity, editActivity, activity],
  );

  return (
    <ActivityContext.Provider
      value={{
        activity,
        setActivity,
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
