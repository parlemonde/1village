import type { Activity } from 'types/activity.type';
import type { User } from 'types/user.type';

export interface ActivityViewProps<T extends Activity = Activity> {
  activity: T;
  user: User;
  isSelf?: boolean;
}
