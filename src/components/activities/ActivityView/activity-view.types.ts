import { AnyActivity } from 'src/activity-types/anyActivities.types';
import type { User } from 'types/user.type';

export interface ActivityViewProps<T extends AnyActivity = AnyActivity> {
  activity: T;
  user: User;
  isSelf?: boolean;
}
