import React from 'react';

import { Map } from 'src/components/Map';
import type { ClassroomIdentityDetails } from 'types/statistics.type';

interface CountryMapProps {
  classroomDetails: ClassroomIdentityDetails;
}

const CountryMap = ({ classroomDetails }: CountryMapProps) => {
  return (
    <div style={{ flex: 1, height: '300px', borderRadius: '10px', overflow: 'hidden' }}>
      <Map
        key={classroomDetails.school}
        position={classroomDetails.position}
        zoom={3}
        markers={[{ position: classroomDetails.position, label: classroomDetails.address, activityCreatorMascotte: undefined }]}
      />
    </div>
  );
};

export default CountryMap;
