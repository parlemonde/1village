import React from "react";

import { ButtonBase } from "@material-ui/core";

import ArrowRight from "src/svg/arrow-right.svg";

interface ThemeChoiceButtonProps {
  label: string;
  description: string;
  onClick?(): void;
}

export const ThemeChoiceButton: React.FC<ThemeChoiceButtonProps> = ({ label, description, onClick = () => {} }: ThemeChoiceButtonProps) => {
  return (
    <ButtonBase style={{ width: "100%", textAlign: "left", borderRadius: "10px", marginBottom: "1rem" }}>
      <div
        onClick={onClick}
        className="bg-grey"
        style={{ padding: "0.8rem 1.4rem", borderRadius: "10px", width: "100%", display: "flex", alignItems: "center" }}
      >
        <div style={{ flex: "1" }}>
          <h3>{label}</h3>
          <span className="text" style={{ display: "block", marginTop: "0.4rem" }}>
            {description}
          </span>
        </div>
        <ArrowRight />
      </div>
    </ButtonBase>
  );
};
