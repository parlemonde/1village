import type { Activity } from 'types/activity.type';
import type { User } from 'types/user.type';

export interface ActivityCardProps<T extends Activity = Activity> {
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
