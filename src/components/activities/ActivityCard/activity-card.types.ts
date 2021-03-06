import { AnyActivity } from 'src/activity-types/anyActivities.types';
import type { User } from 'types/user.type';

export interface ActivityCardProps<T extends AnyActivity = AnyActivity> {
  activity: T;
  user?: User;
  isSelf?: boolean;
  showEditButtons?: boolean;
  noButtons?: boolean;
  isDraft?: boolean;
  forComment?: boolean;
  onDelete?(): void;
  onSelect?: () => void;
}
