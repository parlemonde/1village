import Link from 'next/link';
import React from 'react';

import ButtonBase from '@mui/material/ButtonBase';

import { KeepRatio } from 'src/components/KeepRatio';

interface ActivityChoiceButtonProps {
  label: string;
  href: string;
  icon?: React.FunctionComponent<React.SVGAttributes<SVGElement>> | null;
  disabled?: boolean;
}

export const ActivityChoiceButton = ({ label, href, icon: Icon = null, disabled = false }: ActivityChoiceButtonProps) => {
  return (
    <KeepRatio ratio={0.5} maxWidth="14rem">
      {disabled ? (
        <div
          className="bg-grey"
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            borderRadius: '10px',
            overflow: 'hidden',
            padding: '10px',
            cursor: 'not-allowed',
            justifyContent: 'center',
          }}
        >
          {Icon !== null && <Icon style={{ fill: 'currentcolor', width: '3rem', height: '3rem', marginBottom: '0.5rem' }} />}
          <span className="text text--bold">{label}</span>
        </div>
      ) : (
        <ButtonBase style={{ width: '100%', height: '100%' }}>
          <Link href={href} passHref>
            <a
              href={href}
              className="bg-grey hover-bg-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                borderRadius: '10px',
                overflow: 'hidden',
                padding: '10px',
                justifyContent: 'center',
              }}
            >
              {Icon !== null && <Icon style={{ fill: 'currentcolor', width: '3rem', height: '3rem', marginBottom: '0.5rem' }} />}
              <span className="text text--bold">{label}</span>
            </a>
          </Link>
        </ButtonBase>
      )}
    </KeepRatio>
  );
};
