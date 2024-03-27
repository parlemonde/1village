import React from 'react';
import Link from 'next/link';
import BackArrow from 'src/svg/back-arrow.svg';

const Access = () => {

  const renderTitle = () => {
    return (
      <div>
        <div style={{display: 'flex',alignItems: 'center'}}>
            <div style={{cursor: 'pointer', display: 'flex',alignItems: 'center'}}>
                <Link href="/admin/newportal/manage">
                    <BackArrow />
                </Link>
            </div>
            <h1 style={{ marginLeft: '10px' }}>Droits d'accès</h1>
        </div>
        <p>
            Il y a ici la liste complète des droits d'accès sur 1Village.
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

export default Access;
