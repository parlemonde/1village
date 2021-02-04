import React from "react";

import Paper from "@material-ui/core/Paper";

import { UserContext } from "src/contexts/userContext";
import GameIcon from "src/svg/navigation/game-icon.svg";
import KeyIcon from "src/svg/navigation/key-icon.svg";
import QuestionIcon from "src/svg/navigation/question-icon.svg";
import TargetIcon from "src/svg/navigation/target-icon.svg";
import UserIcon from "src/svg/navigation/user-icon.svg";
import { getGravatarUrl, toDate } from "src/utils";
import { ActivityType } from "types/activity.type";

import { PresentationCard } from "./PresentationCard";
import { ActivityCardProps } from "./activity-card.types";

const titles = {
  [ActivityType.PRESENTATION]: "créé une présentation",
  [ActivityType.DEFI]: "créé un défi",
  [ActivityType.GAME]: "lancé un jeu",
  [ActivityType.ENIGME]: "créé une énigme",
  [ActivityType.QUESTION]: "posé une question",
};
const icons = {
  [ActivityType.PRESENTATION]: UserIcon,
  [ActivityType.DEFI]: TargetIcon,
  [ActivityType.GAME]: GameIcon,
  [ActivityType.ENIGME]: KeyIcon,
  [ActivityType.QUESTION]: QuestionIcon,
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }: ActivityCardProps) => {
  const { user } = React.useContext(UserContext);

  if (!user) {
    return <div></div>;
  }

  const ActivityIcon = icons[activity.type] || null;

  return (
    <Paper variant="outlined" square style={{ margin: "1rem 0" }}>
      <div className="activity-card__header">
        <img alt="Image de profil" src={getGravatarUrl(user.email)} width="40px" height="40px" style={{ borderRadius: "20px", margin: "0.25rem" }} />
        <div className="activity-card__header_info">
          <p className="text">
            Votre classe a <strong>{titles[activity.type]}</strong>
          </p>
          <p className="text text--small">
            Publié le {toDate(activity.createDate as string)} <span>{user.countryCode}</span>
          </p>
        </div>
        {ActivityIcon && <ActivityIcon style={{ fill: "#4c3ed9", margin: "0 0.65rem" }} height="45px" />}
      </div>
      <div className="activity-card__content">{activity.type === ActivityType.PRESENTATION && <PresentationCard activity={activity} />}</div>
    </Paper>
  );
};
