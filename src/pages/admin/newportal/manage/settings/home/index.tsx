import Link from 'next/link';
import React from 'react';

import BackArrow from 'src/svg/back-arrow.svg';

const Home = () => {
  return (
    <div>
      <Link href="/admin/newportal/manage/settings">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Paramétrer la home</h1>
        </div>
      </Link>
    </div>
  );
};

export default Home;
