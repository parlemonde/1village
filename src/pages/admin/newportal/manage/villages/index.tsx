import React from 'react';
import Link from 'next/link';
import BackArrow from 'src/svg/back-arrow.svg';

const Villages = () => {

  const renderTitle = () => {
    return (
      <div>
        <Link href="/admin/newportal/manage">
          <div style={{cursor: 'pointer', display: 'flex',alignItems: 'center'}}>
            <BackArrow />
            <h1 style={{ marginLeft: '10px' }}>Villages-mondes</h1>
          </div>
        </Link>
        <p>
            Il y a ici la liste complète des villages-mondes.
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

export default Villages;
