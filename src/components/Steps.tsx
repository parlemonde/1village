import { useRouter } from 'next/router';
import React from 'react';

import CheckIcon from '@mui/icons-material/Check';
import { Step, StepConnector, StepLabel, Stepper } from '@mui/material/';
import type { StepIconProps } from '@mui/material/StepIcon';

import { ActivityContext } from 'src/contexts/activityContext';
import { primaryColor, primaryColorLight2, successColor, warningColor } from 'src/styles/variables.const';

const StepIcon = ({ icon, active, completed, error, onClick }: StepIconProps) => {
  return (
    <div
      style={{
        backgroundColor: active ? primaryColor : error ? warningColor : 'white',
        color: completed ? (error ? 'white' : successColor) : active ? 'white' : primaryColor,
        width: '38px',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: completed ? (error ? `1px solid ${warningColor}` : `1px solid ${successColor}`) : `1px solid ${primaryColor}`,
      }}
      className={onClick !== undefined ? 'background-hover' : ''}
      onClick={onClick}
    >
      {completed && !error ? <CheckIcon /> : icon}
    </div>
  );
};

interface StepsProps {
  steps: string[];
  urls?: string[];
  activeStep?: number;
  errorSteps?: number[];
  onBeforeLeavePage?: () => Promise<void>;
}

export const Steps = ({ steps, urls, activeStep = 0, errorSteps = [], onBeforeLeavePage }: StepsProps) => {
  const router = useRouter();
  const { save } = React.useContext(ActivityContext);

  return (
    <div className="custom-steps--container" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '43px', left: '10%', right: '10%', borderTop: `1px solid ${primaryColorLight2}`, zIndex: 0 }}></div>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={
          <StepConnector
            sx={{
              top: '16.5px',
              left: '-2.5px',
              right: 'unset',
              '& .MuiStepConnector-line': { border: 'none', width: '5px', height: '5px', borderRadius: '2.5px', backgroundColor: primaryColorLight2 },
            }}
          />
        }
        sx={{
          zIndex: 1,
          position: 'relative',
          background: 'none',
          p: {
            xs: '24px 0',
            md: 3,
          },
        }}
      >
        {steps.map((label, index) => (
          <Step
            sx={{
              px: {
                xs: 0,
                md: 1,
              },
            }}
            key={label}
          >
            <StepLabel
              StepIconComponent={StepIcon}
              StepIconProps={{
                onClick:
                  urls !== undefined && urls.length > index
                    ? async () => {
                        if (onBeforeLeavePage !== undefined) {
                          await onBeforeLeavePage();
                        }
                        save().catch(console.error);
                        router.push(urls[index]);
                      }
                    : undefined,
              }}
              error={errorSteps.includes(index)}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};
