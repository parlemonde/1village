import Link from "next/link";
import React from "react";

import { Button } from "@material-ui/core";

import { RedButton } from "../buttons/RedButton";

import { ActivityCardProps } from "./activity-card.types";

export const PresentationCard: React.FC<ActivityCardProps> = ({ activity }: ActivityCardProps) => {
  const firstImage = React.useMemo(() => activity.processedContent.find((c) => c.type === "image"), [activity.processedContent]);
  const firstText = React.useMemo(() => activity.processedContent.find((c) => c.type === "text"), [activity.processedContent]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-start",
      }}
    >
      {firstImage && <img style={{ height: "15rem", width: "auto" }} src={firstImage.value} />}
      <div style={{ minWidth: 0, flexShrink: 1, flex: 1, height: firstImage ? "15rem" : "unset", maxHeight: firstImage ? "15rem" : "8rem" }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
          <div style={{ position: "relative", flex: 1, minHeight: 0, maxHeight: "10rem", overflow: "hidden", flexShrink: 0 }}>
            <div style={firstImage ? {} : { maxWidth: "40rem", margin: "0 0.25rem" }} dangerouslySetInnerHTML={{ __html: firstText.value }} />
            <div className="scrollGradient"></div>
          </div>
          <div style={{ margin: "1rem 0.25rem 0.25rem 0.25rem", textAlign: "right" }}>
            <Button color="primary" variant="outlined">
              Voir la présentation
            </Button>
            <Link href={`se-presenter/thematique/3?activity-id=${activity.id}`}>
              <Button
                component="a"
                href={`se-presenter/thematique/3?activity-id=${activity.id}`}
                color="secondary"
                variant="contained"
                style={{ marginLeft: "0.25rem" }}
              >
                Modifier
              </Button>
            </Link>
            <RedButton style={{ marginLeft: "0.25rem" }}>Supprimer</RedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
