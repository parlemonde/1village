import React from 'react';

import { Map } from 'src/components/Map';
import type { ClassroomDetails } from 'types/statistics.type';

interface CountryMapProps {
  classroomDetails: ClassroomDetails;
}

const CountryMap = ({ classroomDetails }: CountryMapProps) => {
  return (
    <div style={{ flex: 1, height: '300px', borderRadius: '10px', overflow: 'hidden' }}>
      <Map
        position={classroomDetails.position}
        zoom={3}
        markers={[{ position: classroomDetails.position, label: classroomDetails.address, activityCreatorMascotte: undefined }]}
      />
    </div>
  );
};

export default CountryMap;
