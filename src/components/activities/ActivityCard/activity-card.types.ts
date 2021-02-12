import type { ExtendedActivity } from 'src/components/activities/editing.types';
import type { User } from 'types/user.type';

export interface ActivityCardProps {
  activity: ExtendedActivity;
  user?: User;
  isSelf?: boolean;
  showEditButtons?: boolean;
  noButtons?: boolean;
  onDelete?(): void;
}
