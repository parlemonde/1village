import Link from "next/link";
import React from "react";

import ButtonBase from "@material-ui/core/ButtonBase";

import { KeepRatio } from "../KeepRatio";

interface ActivityChoiceButtonProps {
  label: string;
  href: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}

export const ActivityChoiceButton: React.FC<ActivityChoiceButtonProps> = ({ label, href, icon: Icon }: ActivityChoiceButtonProps) => {
  return (
    <KeepRatio ratio={0.5}>
      <KeepRatio ratio={0.5} maxWidth="14rem">
        <Link href={href}>
          <ButtonBase style={{ width: "100%", height: "100%" }}>
            <a
              href={href}
              className="bg-grey hover-bg-primary"
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                borderRadius: "10px",
                overflow: "hidden",
                padding: "10px",
              }}
            >
              {<Icon style={{ fill: "currentcolor", width: "3rem", height: "3rem" }} />}
              <span className="text text--bold" style={{ marginTop: "0.5rem" }}>
                {label}
              </span>
            </a>
          </ButtonBase>
        </Link>
      </KeepRatio>
    </KeepRatio>
  );
};
