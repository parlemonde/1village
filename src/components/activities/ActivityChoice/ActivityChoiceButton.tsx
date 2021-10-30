import Link from 'next/link';
import React from 'react';

import ButtonBase from '@mui/material/ButtonBase';

import { KeepRatio } from 'src/components/KeepRatio';

interface ActivityChoiceButtonProps {
  label: string;
  href: string;
  icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  disabled?: boolean;
}

export const ActivityChoiceButton = ({ label, href, icon: Icon, disabled = false }: ActivityChoiceButtonProps) => {
  return (
    <KeepRatio ratio={0.5}>
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
            }}
          >
            {<Icon style={{ fill: 'currentcolor', width: '3rem', height: '3rem' }} />}
            <span className="text text--bold" style={{ marginTop: '0.5rem' }}>
              {label}
            </span>
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
                }}
              >
                {<Icon style={{ fill: 'currentcolor', width: '3rem', height: '3rem' }} />}
                <span className="text text--bold" style={{ marginTop: '0.5rem' }}>
                  {label}
                </span>
              </a>
            </Link>
          </ButtonBase>
        )}
      </KeepRatio>
    </KeepRatio>
  );
};
