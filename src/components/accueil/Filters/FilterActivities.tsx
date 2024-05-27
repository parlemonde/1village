import { getSubtype, getType } from 'src/activity-types/activity.constants';
import { isGame } from 'src/activity-types/anyActivity';
import type { Activity, AnyData } from 'types/activity.type';
import { GameType } from 'types/game.type';

export function filterActivitiesWithLastGame(activitiesData: Activity<AnyData>[], subType: number = GameType.MIMIC): Activity<AnyData>[] {
  const indexOfLastMimic = activitiesData.findIndex((activity) => isGame(activity) && activity.subType === subType); // Get the index of this last mimic
  if (indexOfLastMimic === -1) {
    return activitiesData;
  }
  const mostRecentMimic = activitiesData[indexOfLastMimic]; // Get the last mimic created
  const activitiesWithoutMimic = activitiesData.filter((activity) => !isGame(activity) || activity.subType !== subType); // Remove all mimics in activities
  const activitiesWithLastMimic = [...activitiesWithoutMimic];
  activitiesWithLastMimic.splice(indexOfLastMimic, 0, mostRecentMimic); // Put the last mimic created at the same spot in the array

  return activitiesWithLastMimic;
}

export function filterActivitiesByTerm(activitiesData: Activity<AnyData>[], searchTerm: string): Activity<AnyData>[] {
  const activitiesFilteredBySearchTermOnType = activitiesData.filter((activity) => {
    const type = getType(activity.type);
    const subType = type && activity.subType !== null && activity.subType !== undefined ? getSubtype(type, activity.subType) : undefined;
    return subType && subType.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0;
  });
  const activitiesFilteredBySearchTerm = activitiesData.filter((activity) => filterActivityByTerm(activity, searchTerm));
  let agregatedFilters = [...activitiesFilteredBySearchTerm, ...activitiesFilteredBySearchTermOnType];
  agregatedFilters = [...new Set(agregatedFilters)];
  return agregatedFilters;
}

// to check a given activity contains a given term
export function filterActivityByTerm(activity: Activity, term: string) {
  // for cas insensivitive search
  const lowerTerm = term.toLowerCase();
  if (activity.content[0].value.toLowerCase().indexOf(lowerTerm) !== -1) {
    return true;
  }

  const dataStr = JSON.stringify(activity.data);

  //resume if exists
  if (dataStr.toLowerCase().indexOf(lowerTerm) !== -1) {
    return true;
  }
  return false;
}
