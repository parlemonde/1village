import React from "react";

import { Activity, ActivityType } from "types/activity.type";

import { UserContext } from "./userContext";
import { VillageContext } from "./villageContext";

interface ActivityContextValue {
  activity: Activity | null;
  updateActivity(newActivity: Partial<Activity>): void;
  createNewActivity(type: ActivityType, initialData?: { [key: string]: string | number | boolean }): boolean;
}

export const ActivityContext = React.createContext<ActivityContextValue>(null);

interface ActivityContextProviderProps {
  children: React.ReactNode;
}

export const ActivityContextProvider: React.FC<ActivityContextProviderProps> = ({ children }: ActivityContextProviderProps) => {
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);

  const [activity, setActivity] = React.useState<Activity | null>(null);

  const updateActivity = React.useCallback((newActivity: Partial<Activity>) => {
    setActivity((a) => ({ ...a, ...newActivity }));
  }, []);

  const createNewActivity = React.useCallback(
    (type: ActivityType, initialData?: { [key: string]: string | number | boolean }) => {
      if (user === null || village === null) {
        return false;
      }
      const activity: Activity = {
        id: 0,
        type: type,
        userId: user.id,
        villageId: village.id,
        content: initialData
          ? [
              {
                id: 0,
                activityId: 0,
                order: 0,
                key: "data",
                value: JSON.stringify(initialData),
              },
            ]
          : [],
        responseActivityId: null,
        responseType: null,
      };
      setActivity(activity);
      return true;
    },
    [user, village],
  );

  return (
    <ActivityContext.Provider
      value={{
        activity,
        updateActivity,
        createNewActivity,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
