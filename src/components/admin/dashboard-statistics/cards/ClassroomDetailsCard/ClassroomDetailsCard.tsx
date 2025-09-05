import React from 'react';

import CountryMap from '../../map/CountryMap/CountryMap';
import styles from './ClassroomDetailsCard.module.css';
import type { ClassroomDetails } from 'types/statistics.type';

interface ClassroomDetailsCardProps {
  classroomDetails?: ClassroomDetails;
}

const ClassroomDetailsCard = ({ classroomDetails }: ClassroomDetailsCardProps) => {
  if (!classroomDetails) {
    return (
      <div className={`${styles.root} ${styles.mainContainer}`}>
        <CountryMap countryIso2="VN" />
        <div className={styles.infoContainer}>
          <h3>Détails de la classe</h3>
          <p>Sélectionnez une classe pour voir ses détails</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.root} ${styles.mainContainer}`}>
      <CountryMap countryIso2={classroomDetails.countryCode || 'VN'} />
      <div className={styles.infoContainer}>
        <h3>Détails de la classe</h3>
        <ul>
          <li>
            <strong>Nom de la classe :</strong> {classroomDetails.classroomName}
          </li>
          <li>
            <strong>Pays :</strong> {classroomDetails.countryCode}
          </li>
          <li>
            <strong>Village :</strong> {classroomDetails.villageName}
          </li>
          <li>
            <strong>Nombre de commentaires :</strong> {classroomDetails.commentsCount}
          </li>
          <li>
            <strong>Nombre de vidéos :</strong> {classroomDetails.videosCount}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ClassroomDetailsCard;
