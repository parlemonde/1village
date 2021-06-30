import React from 'react';

import { Base } from 'src/components/Base';
import { WorldMap } from 'src/components/WorldMap';

const MapPage: React.FC = () => {
  return (
    <Base>
      <WorldMap />
    </Base>
  );
};

export default MapPage;
