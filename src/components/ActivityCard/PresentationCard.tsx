import { htmlToText } from "html-to-text";
import Link from "next/link";
import React from "react";

import { Button } from "@material-ui/core";

import { RedButton } from "../buttons/RedButton";

import { ActivityCardProps } from "./activity-card.types";

export const PresentationCard: React.FC<ActivityCardProps> = ({ activity }: ActivityCardProps) => {
  const firstImage = React.useMemo(() => activity.processedContent.find((c) => c.type === "image"), [activity.processedContent]);
  const firstTextContent = React.useMemo(() => activity.processedContent.find((c) => c.type === "text"), [activity.processedContent]);
  const firstText = firstTextContent ? htmlToText(firstTextContent.value) : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-start",
      }}
    >
      {firstImage && (
        <div style={{ width: "40%", flexShrink: 0, padding: "0.25rem" }}>
          <div
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "#f5f5f5",
              backgroundImage: `url(${firstImage.value})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </div>
      )}
      <div style={{ margin: "0.25rem", flex: 1 }}>
        <div style={{ margin: "0 0.5rem 1rem", height: `${firstImage ? 4 : 2}rem`, textAlign: "justify" }}>
          <div className="text multine-with-ellipsis" style={{ maxHeight: `${firstImage ? 4 : 2}rem` }}>
            {firstText}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
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
  );
};
