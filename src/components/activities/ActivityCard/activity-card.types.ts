import { AnyActivity } from 'src/activities/anyActivities.types';
import type { User } from 'types/user.type';

export interface ActivityCardProps<T extends AnyActivity> {
  activity: T;
  user?: User;
  isSelf?: boolean;
  showEditButtons?: boolean;
  noButtons?: boolean;
  isDraft?: boolean;
  onDelete?(): void;
}
