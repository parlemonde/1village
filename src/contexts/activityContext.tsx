import { useRouter } from "next/router";
import React from "react";

import type { EditorTypes, EditorContent } from "src/components/activityEditor/editing.types";
import { getQueryString } from "src/utils";
import { Activity, ActivityType } from "types/activity.type";

import { UserContext } from "./userContext";
import { VillageContext } from "./villageContext";

export type ExtendedActivity = Activity & {
  data: { [key: string]: string | number | boolean };
  processedContent: Array<EditorContent>;
};

interface ActivityContextValue {
  activity: ExtendedActivity | null;
  updateActivity(newActivity: Partial<ExtendedActivity>): void;
  createNewActivity(type: ActivityType, initialData?: { [key: string]: string | number | boolean }): boolean;
  addContent(type: EditorTypes, value?: string): void;
  deleteContent(index: number): void;
  save(): Promise<boolean>;
}

export const ActivityContext = React.createContext<ActivityContextValue>(null);

interface ActivityContextProviderProps {
  children: React.ReactNode;
}

export function getExtendedActivity(activity: Activity): ExtendedActivity {
  let data: { [key: string]: string | number | boolean } = {};
  const processedContent: Array<EditorContent> = [];
  activity.content.forEach((c) => {
    if (c.key === "h5p") {
      return; // not yet handled
    }
    if (c.key === "json") {
      const decodedValue = JSON.parse(c.value);
      if (decodedValue.type && decodedValue.type === "data") {
        data = decodedValue.data || {};
        // } else {
        // processedContent.push() // todo
      }
    } else {
      processedContent.push({
        type: c.key,
        id: c.id,
        value: c.value,
      });
    }
  });
  return {
    ...activity,
    data,
    processedContent,
  };
}

export const ActivityContextProvider: React.FC<ActivityContextProviderProps> = ({ children }: ActivityContextProviderProps) => {
  const router = useRouter();
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);
  const [activity, setActivity] = React.useState<ExtendedActivity | null>(null);

  const getActivity = React.useCallback(
    async (id: number) => {
      const response = await axiosLoggedRequest({
        method: "GET",
        url: `/activities/${id}`,
      });
      if (response.error) {
        router.push("/");
      } else {
        setActivity(getExtendedActivity(response.data));
      }
    },
    [router, axiosLoggedRequest],
  );
  React.useEffect(() => {
    if ("activity-id" in router.query) {
      setActivity(null);
      getActivity(parseInt(getQueryString(router.query["activity-id"]), 10)).catch();
    }
  }, [getActivity, router]);

  const updateActivity = React.useCallback((newActivity: Partial<ExtendedActivity>) => {
    setActivity((a) => (a === null ? a : { ...a, ...newActivity }));
  }, []);

  const createNewActivity = React.useCallback(
    (type: ActivityType, initialData?: { [key: string]: string | number | boolean }) => {
      if (user === null || village === null) {
        return false;
      }
      const activity: ExtendedActivity = {
        id: 0,
        type: type,
        userId: user.id,
        villageId: village.id,
        content: [],
        responseActivityId: null,
        responseType: null,
        data: initialData || {},
        processedContent: [{ type: "text", id: 0, value: "" }],
      };
      setActivity(activity);
      return true;
    },
    [user, village],
  );

  const activityContent = activity?.processedContent || null;

  const addContent = React.useCallback(
    (type: EditorTypes, value: string = "") => {
      if (activityContent === null) {
        return;
      }
      const newId = Math.max(1, ...activityContent.map((p) => p.id)) + 1;
      const newContent = activityContent;
      newContent.push({
        id: newId,
        type,
        value,
      });
      updateActivity({ processedContent: newContent });
    },
    [updateActivity, activityContent],
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

  const createActivity = React.useCallback(async () => {
    const content: Array<{ key: string; value: string }> = activity.processedContent
      .map((p) => {
        if (p.type === "text" || p.type === "image" || p.type === "video") {
          return {
            key: p.type,
            value: p.value,
          };
        }
        return null;
      })
      .filter((c) => c !== null);
    content.push({
      key: "json",
      value: JSON.stringify({
        type: "data",
        data: activity.data,
      }),
    });
    const data: Omit<Partial<Activity>, "content"> & { content: Array<{ key: string; value: string }> } = {
      type: activity.type,
      villageId: activity.villageId,
      content,
    };
    // if (activity.responseActivityId !== undefined) {
    //   data.responseActivityId = activity.responseActivityId;
    //   data.responseType = activity.responseType;
    // }
    const response = await axiosLoggedRequest({
      method: "POST",
      url: "/activities",
      data,
    });
    if (response.error) {
      return false;
    } else {
      setActivity(getExtendedActivity(response.data));
      return true;
    }
  }, [axiosLoggedRequest, activity]);

  const save = React.useCallback(async () => {
    if (activity?.id === 0) {
      return await createActivity();
    }
    return false;
  }, [createActivity, activity]);

  return (
    <ActivityContext.Provider
      value={{
        activity,
        updateActivity,
        createNewActivity,
        addContent,
        deleteContent,
        save,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
