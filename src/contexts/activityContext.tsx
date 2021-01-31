import React from "react";

import type { EditorTypes, EditorContent } from "src/components/activityEditor/editing.types";
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
}

export const ActivityContext = React.createContext<ActivityContextValue>(null);

interface ActivityContextProviderProps {
  children: React.ReactNode;
}

export const ActivityContextProvider: React.FC<ActivityContextProviderProps> = ({ children }: ActivityContextProviderProps) => {
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);

  const [activity, setActivity] = React.useState<ExtendedActivity | null>(null);

  const updateActivity = React.useCallback((newActivity: Partial<ExtendedActivity>) => {
    setActivity((a) => ({ ...a, ...newActivity }));
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

  return (
    <ActivityContext.Provider
      value={{
        activity,
        updateActivity,
        createNewActivity,
        addContent,
        deleteContent,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
