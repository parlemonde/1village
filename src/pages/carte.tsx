import React from 'react';

import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { WorldMap } from 'src/components/WorldMap';

const MapPage: React.FC = () => {
  return (
    <Base>
      <KeepRatio ratio={1 / 2}>
        <WorldMap />
      </KeepRatio>
    </Base>
  );
};

export default MapPage;
