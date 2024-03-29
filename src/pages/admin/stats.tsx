import Link from 'next/link';
import React from 'react';

import MaterialLink from '@mui/material/Link';

const Stats = () => {
  return (
    <div className="admin--container">
      <Link href="/admin/stats" passHref>
        <MaterialLink href="/admin/stats">
          <h1 style={{ marginBottom: '1rem' }}>Statistiques</h1>
        </MaterialLink>
      </Link>
    </div>
  );
};

export default Stats;
