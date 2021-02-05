import type { ExtendedActivity } from "src/contexts/activityContext";
import type { User } from "types/user.type";

export interface ActivityCardProps {
  activity: ExtendedActivity;
  user?: User;
  isSelf?: boolean;
  showEditButtons?: boolean;
}
