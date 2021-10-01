import React from 'react';

import StepConnector from '@material-ui/core/StepConnector';
import type { StepIconProps } from '@material-ui/core/StepIcon';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import { withStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';

import { primaryColor, primaryColorLight2, successColor, errorColor } from 'src/styles/variables.const';

const DotConnector = withStyles({
  alternativeLabel: {
    top: '16.5px',
    left: '-2.5px',
    right: 'unset',
  },
  line: {
    border: 'none',
    width: '5px',
    height: '5px',
    borderRadius: '2.5px',
    backgroundColor: primaryColorLight2,
  },
})(StepConnector);

const StepIcon = ({ icon, active, completed, error }: StepIconProps) => {
  return (
    <div
      style={{
        backgroundColor: active ? primaryColor : error ? errorColor : 'white',
        color: completed ? (error ? 'white' : successColor) : active ? 'white' : primaryColor,
        width: '38px',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: completed ? (error ? `1px solid ${errorColor}` : `1px solid ${successColor}`) : `1px solid ${primaryColor}`,
      }}
    >
      {completed ? error ? icon : <CheckIcon /> : icon}
    </div>
  );
};

interface StepsProps {
  steps: string[];
  activeStep?: number;
  errorSteps?: number[];
}

export const Steps = ({ steps, activeStep = 0, errorSteps = [] }: StepsProps) => {
  return (
    <div className="custom-steps--container" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '43px', left: '10%', right: '10%', borderTop: `1px solid ${primaryColorLight2}`, zIndex: 0 }}></div>
      <Stepper activeStep={activeStep} alternativeLabel connector={<DotConnector />} style={{ zIndex: 1, position: 'relative', background: 'none' }}>
        {steps.map((label, index) => {
          let error: boolean = false;
          errorSteps.map((step) => {
            if (index === step) {
              error = true;
            }
          });
          return (
            <Step key={label}>
              <StepLabel StepIconComponent={StepIcon} error={error}>
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
};
