import Link from 'next/link';
import React from 'react';

import { primaryColor } from 'src/styles/variables.const';

interface LinkProps {
  url: string;
}

const ActivityLink = ({ url }: LinkProps) => {
  return (
    <div style={{ margin: '1rem 0' }}>
      Votre défi initie un nouvel échange avec les pélicopains, vous pouvez changer et{' '}
      <Link href={url}>
        <a style={{ color: primaryColor }} href={url}>
          réagir à une activité déjà publiée.
        </a>
      </Link>
    </div>
  );
};

export default ActivityLink;
