import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { UserContext } from 'src/contexts/userContext';
import { UserType } from 'types/user.type';

const Prepublier = () => {
  const { user } = React.useContext(UserContext);
  const router = useRouter();

  const { id } = router.query;

  useEffect(() => {
    if (user?.type === UserType.OBSERVATOR) {
      router.push('/admin/newportal/analyze');
    }
  }, [router, user]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '60vw' }}>
      <h1>Pre-publier</h1>
      <p>{id}</p>
    </div>
  );
};

export default Prepublier;
