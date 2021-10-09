import { useRouter } from 'next/router';
import React from 'react';

import ArrowRight from 'src/svg/arrow-right.svg';

type BackButtonProps = {
  href?: string;
  label?: string;
};

export const BackButton = ({ href, label = 'Retour' }: BackButtonProps) => {
  const router = useRouter();

  const onBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <a className="text" style={{ position: 'absolute', left: 0, top: 0, zIndex: 2 }} onClick={onBack}>
        <span style={{ marginRight: '0.5rem' }}>
          <ArrowRight style={{ height: '0.6rem', width: '0.6rem', transform: 'rotate(180deg)' }} />
        </span>
        {label}
      </a>
    </div>
  );
};
