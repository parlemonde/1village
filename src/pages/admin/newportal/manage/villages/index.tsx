import Link from 'next/link';
import React from 'react';

import BackArrow from 'src/svg/back-arrow.svg';

const Villages = () => {
  return (
    <div>
      <Link href="/admin/newportal/manage">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Villages-mondes</h1>
        </div>
      </Link>
      <p>Il y a ici la liste complète des villages-mondes.</p>
    </div>
  );
};

export default Villages;