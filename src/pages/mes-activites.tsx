import React from "react";

import { ActivityCard } from "src/components/ActivityCard";
import { Base } from "src/components/Base";
import { useActivities } from "src/services/useActivities";

const MesActivites: React.FC = () => {
  const { activities } = useActivities();

  return (
    <Base>
      <h1>{"Mes activités"}</h1>
      {activities.map((activity, index) => (
        <ActivityCard activity={activity} key={index} />
      ))}
    </Base>
  );
};

export default MesActivites;
