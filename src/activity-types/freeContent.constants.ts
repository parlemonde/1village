import type { FreeContentData } from './freeContent.types';
import type { ActivityContent } from 'types/activity.type';

export const getImage = (activityContent: ActivityContent[], data: FreeContentData | null) => {
  if (data !== null && data.noImage) {
    return undefined;
  }
  if (data !== null && data.imageUrl !== undefined) {
    return data.imageUrl;
  }
  return activityContent.find((c) => c.type === 'image')?.value;
};
