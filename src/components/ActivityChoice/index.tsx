import React from "react";

import { ActivityChoiceButton } from "./ActivityChoiceButton";

interface ActivityChoiceProps {
  activities: Array<{
    label: string;
    href: string;
    icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  }>;
}

export const ActivityChoice: React.FC<ActivityChoiceProps> = ({ activities }: ActivityChoiceProps) => {
  return (
    <div style={{ width: "100%", padding: "1rem" }}>
      <div style={{ margin: "0 auto", width: "100%", maxWidth: "750px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem 1rem" }}>
        {activities.map((activity) => (
          <ActivityChoiceButton key={activity.label} label={activity.label} href={activity.href} icon={activity.icon} />
        ))}
      </div>
    </div>
  );
};
