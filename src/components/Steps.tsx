import React from "react";

import StepConnector from "@material-ui/core/StepConnector";
import { StepIconProps } from "@material-ui/core/StepIcon";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import { withStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";

const DotConnector = withStyles({
  alternativeLabel: {
    top: "16.5px",
    left: "-2.5px",
    right: "unset",
  },
  line: {
    border: "none",
    width: "5px",
    height: "5px",
    borderRadius: "2.5px",
    backgroundColor: "#b3b5fc",
  },
})(StepConnector);

const StepIcon = ({ icon, active, completed }: StepIconProps) => {
  return (
    <div
      style={{
        backgroundColor: active ? "#4c3ed9" : "white",
        color: completed ? "#008000" : active ? "white" : "#4c3ed9",
        width: "38px",
        height: "38px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: completed ? "1px solid #008000" : "1px solid #4c3ed9",
      }}
    >
      {completed ? <CheckIcon /> : icon}
    </div>
  );
};

interface Steps {
  steps: string[];
  activeStep?: number;
}

export const Steps: React.FC<Steps> = ({ steps, activeStep = 0 }: Steps) => {
  return (
    <div className="custom-steps--container" style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: "43px", left: "10%", right: "10%", borderTop: "1px solid #b3b5fc", zIndex: 0 }}></div>
      <Stepper activeStep={activeStep} alternativeLabel connector={<DotConnector />} style={{ zIndex: 1, position: "relative", background: "none" }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={StepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};
