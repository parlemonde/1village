import * as React from 'react';

import { Flag } from 'src/components/Flag';
import { ClassroomContext } from 'src/contexts/classroomContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import type { Country } from 'types/country.type';
import { UserType } from 'types/user.type';

export const VillageMonde = (): JSX.Element => {
  const { village, selectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);
  const { parentClassroom } = React.useContext(ClassroomContext);
  //* NOTE: might be interesting to make a hook for this below
  const isPelico =
    (user !== null && user.type === UserType.MEDIATOR) ||
    (user !== null && user.type === UserType.ADMIN) ||
    (user !== null && user.type === UserType.SUPER_ADMIN);
  const isObservator = user !== null && user.type === UserType.OBSERVATOR;

  if (!user) {
    return <div></div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '6px',
      }}
    >
      <h2 style={{ margin: '0 0.55rem 0 0.8rem' }}>Village-monde </h2>
      {village &&
        village.countries.map((country: Country) => {
          if (user.type === UserType.FAMILY) {
            return (
              <Flag
                style={{ margin: '0.25rem' }}
                key={country.isoCode}
                country={country.isoCode}
                isMistery={
                  !village ||
                  !user ||
                  (selectedPhase === 1 && parentClassroom?.student?.classroom.user.toUpperCase() !== country.isoCode) ||
                  (user.firstLogin < 2 && parentClassroom?.student?.classroom.user.toUpperCase() !== country.isoCode)
                }
              ></Flag>
            );
          } else {
            return (
              <Flag
                style={{ margin: '0.25rem' }}
                key={country.isoCode}
                country={country.isoCode}
                isMistery={
                  !village ||
                  !user ||
                  (selectedPhase === 1 && user.country?.isoCode.toUpperCase() !== country.isoCode && (!isPelico || isObservator)) ||
                  (user.firstLogin < 2 && user.country?.isoCode.toUpperCase() !== country.isoCode && (!isPelico || isObservator))
                }
              ></Flag>
            );
          }
        })}
    </div>
  );
};
