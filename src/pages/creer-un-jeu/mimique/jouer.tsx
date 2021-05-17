import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';

const PlayMimique: React.FC = () => {
  const router = useRouter();

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>//TODO play screen</div>
    </Base>
  );
};

export default PlayMimique;
