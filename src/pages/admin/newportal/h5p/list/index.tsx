import React, { useEffect } from 'react';

import { Button } from '@mui/material';

import Layout from '../layout';
import { useH5pContentList } from 'src/api/h5p/h5p-content.list';
import H5pBanner from 'src/components/admin/H5pBanner';
import { UserContext } from 'src/contexts/userContext';
import { UserType } from 'types/user.type';

export default function H5pList() {
  const { user } = React.useContext(UserContext);
  const h5pList = useH5pContentList();
  const isModerator = user !== null && user.type <= UserType.MEDIATOR;

  useEffect(() => {
    console.log(h5pList.data);
  }, [h5pList.data]);
  if (!isModerator) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être modérateur.</h1>;
  }

  if (h5pList.isIdle || h5pList.isLoading) {
    return <div>loading...</div>;
  }
  if (h5pList.isError) {
    return <div>Error...</div>;
  }
  return (
    <Layout>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>drop down</div>
          <div>search bar</div>
        </div>
        <Button variant="contained">Contained</Button>
      </div>
      <div style={{ display: 'flex' }}>
        <H5pBanner
          lastUpdatedAt={new Date()}
          onDelete={() => console.log('delete')}
          onUpdate={() => console.log('update')}
          title={'toto'}
          type={'toto type'}
        />
      </div>
    </Layout>
  );
}
