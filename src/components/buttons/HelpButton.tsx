import React from "react";

import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { ButtonProps } from "@material-ui/core";

import PelicoSearch from "src/svg/pelico/pelico-search.svg";

const helpColor = "#E1C7D1";
const helpColorDarker = "#cfbac3";

const PinkButton = withStyles(() => ({
  root: {
    padding: "0.5rem 2rem",
    width: "100%",
    marginTop: "25px",
    color: "black",
    fontWeight: 600,
    fontSize: "0.9rem",
    position: "relative",
    backgroundColor: helpColor,
    "&:hover": {
      backgroundColor: helpColorDarker,
    },
  },
}))(Button);

export const HelpButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  return (
    <div style={{ width: "100%", padding: "0 10px" }}>
      <PinkButton {...props}>
        {"Besoin d'aide ?"}
        <div style={{ position: "absolute", left: "-5px", top: "-25px" }}>
          <PelicoSearch style={{ width: "60px", height: "auto" }} />
        </div>
      </PinkButton>
    </div>
  );
};
