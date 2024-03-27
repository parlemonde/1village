import React from 'react';
import Link from 'next/link';
import BackArrow from 'src/svg/back-arrow.svg';

const Users = () => {

  const renderTitle = () => {
    return (
      <div>
        <div style={{display: 'flex',alignItems: 'center'}}>
            <div style={{cursor: 'pointer', display: 'flex',alignItems: 'center'}}>
                <Link href="/admin/newportal/manage">
                    <BackArrow />
                </Link>
            </div>
            <h1 style={{ marginLeft: '10px' }}>Utilisateurs</h1>
        </div>
        <p>
            Il y a ici la liste complète des utilisateurs sur 1Village.
        </p>
      </div>
    );
  };

  return (
    <>
      {renderTitle()}
    </>
  );

};

export default Users;
