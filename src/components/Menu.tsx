import { useRouter } from "next/router";
import React from "react";

import Button from "@material-ui/core/Button";

import AgendaIcon from "src/svg/agendaIcon.svg";
import GameIcon from "src/svg/gameIcon.svg";
import HomeIcon from "src/svg/homeIcon.svg";
import KeyIcon from "src/svg/keyIcon.svg";
import Map from "src/svg/map.svg";
import QuestionIcon from "src/svg/questionIcon.svg";
import TargetIcon from "src/svg/targetIcon.svg";
import UserIcon from "src/svg/userIcon.svg";

interface Tab {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    label: "Accueil",
    path: "/",
    icon: <HomeIcon style={{ fill: "currentcolor" }} width="1.4rem" />,
  },
  {
    label: "Se présenter",
    path: "/se-presenter",
    icon: <UserIcon style={{ fill: "currentcolor" }} width="1.4rem" />,
  },
  {
    label: "Créer une énigme",
    path: "/creer-une-enigme",
    icon: <KeyIcon style={{ fill: "currentcolor" }} width="1.4rem" />,
  },
  {
    label: "Lancer un défi",
    path: "/lancer-un-defi",
    icon: <TargetIcon style={{ fill: "currentcolor" }} width="1.4rem" />,
  },
  {
    label: "Poser une question",
    path: "/poser-une-question",
    icon: <QuestionIcon style={{ fill: "currentcolor" }} width="1.4rem" />,
  },
  {
    label: "Créer un jeu",
    path: "/creer-un-jeu",
    icon: <GameIcon style={{ fill: "currentcolor" }} width="1.4rem" />,
  },
  {
    label: "Mes activités",
    path: "/mes-activites",
    icon: <AgendaIcon style={{ fill: "currentcolor" }} width="1.4rem" />,
  },
];

export const Menu: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = React.useState(-1);

  React.useEffect(() => {
    const index = tabs.findIndex((tab) => tab.path.split("/")[1] === router.pathname.split("/")[1]);
    setSelectedTab(index);
  }, [router.pathname]);

  return (
    <nav className="LeftNavigation">
      <div className="Menu withShadow">
        <div style={{ padding: "10% 15%", position: "relative" }}>
          <Map width="100%" height="100%" />
          <div className="absolute-center">
            <Button className="menuButton" color="primary" variant="contained">
              Voir sur la carte
            </Button>
          </div>
        </div>
        <div style={{ padding: "0 5%", position: "relative" }}>
          {tabs.map((tab, index) => (
            <Button
              component="a"
              onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                event.preventDefault();
                router.push(tab.path);
              }}
              href={tab.path}
              key={tab.path}
              color="primary"
              startIcon={tab.icon}
              variant={index === selectedTab ? "contained" : "outlined"}
              className="menuButton full-width"
              style={{ justifyContent: "flex-start", paddingRight: "0.1rem", marginBottom: "0.4rem", width: index === selectedTab ? "112%" : "100%" }}
              disableElevation
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};
