import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';

const Anthem = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/parametrer-hymne/1');
  });

  return <Base></Base>;
};

export default Anthem;
