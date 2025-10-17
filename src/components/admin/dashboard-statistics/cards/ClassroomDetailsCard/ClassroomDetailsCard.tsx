import React from 'react';

import CountryMap from '../../map/CountryMap/CountryMap';
import styles from './ClassroomDetailsCard.module.css';
import { UserContext } from 'src/contexts/userContext';
import { toDate } from 'src/utils';
import type { ClassroomIdentityDetails } from 'types/statistics.type';
import { UserType } from 'types/user.type';

interface ClassroomDetailsCardProps {
  classroomIdentityDetails: ClassroomIdentityDetails;
}

const ClassroomDetailsCard = ({ classroomIdentityDetails: classroomDetails }: ClassroomDetailsCardProps) => {
  const { user } = React.useContext(UserContext);
  const isObservator = user !== null && user.type === UserType.OBSERVATOR;

  return (
    <div className={styles.mainContainer}>
      <CountryMap classroomDetails={classroomDetails} />
      <div className={styles.infoContainer}>
        <h1 style={{ paddingBottom: '20px' }}>École {classroomDetails.school}</h1>
        <ul>
          <li>
            Adresse: {classroomDetails.address}, {classroomDetails.postalCode} {classroomDetails.city}
          </li>
          <li>Pays: {classroomDetails.country?.name}</li>
          <li>Village Monde: {classroomDetails.village}</li>
          {!isObservator && (
            <>
              <li>Adresse Mail: {classroomDetails.email}</li>
              <li>Dernière connexion: {toDate(classroomDetails.lastConnexion as string)} </li>
              <li>
                Professeur: {classroomDetails.firstname} {classroomDetails.lastname}
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ClassroomDetailsCard;
