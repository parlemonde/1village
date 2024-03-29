import Link from 'next/link';
import React from 'react';

import BackArrow from 'src/svg/back-arrow.svg';

const Users = () => {
  const renderTitle = () => {
    return (
      <div>
        <Link href="/admin/newportal/manage">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <BackArrow />
            <h1 style={{ marginLeft: '10px' }}>Utilisateurs</h1>
          </div>
        </Link>
        <p>Il y a ici la liste complète des utilisateurs sur 1Village.</p>
      </div>
    );
  };

  return <>{renderTitle()}</>;
};

export default Users;
