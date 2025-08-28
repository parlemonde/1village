import React from 'react';

import CountryMap from '../../map/CountryMap/CountryMap';
import styles from './ClassroomDetailsCard.module.css';
import { useStatisticsClassrooms } from 'src/services/useStatistics';

interface ClassroomDetailsCardProps {
  selectedClassroom?: number;
  selectedCountry?: string;
  selectedVillage?: number;
}

const ClassroomDetailsCard = ({ selectedClassroom, selectedCountry, selectedVillage }: ClassroomDetailsCardProps) => {
  const { data: classroomStatistics } = useStatisticsClassrooms(selectedVillage, selectedCountry, selectedClassroom);

  // If no classroom is selected, show a placeholder
  if (!selectedClassroom || !classroomStatistics) {
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

  // Extract classroom data from statistics
  // const classroom = statisticsClassrooms as any; // Type assertion for now

  return (
    <div className={`${styles.root} ${styles.mainContainer}`}>
      <CountryMap countryIso2={selectedCountry || 'VN'} />
      <div className={styles.infoContainer}>
        <h3>Détails de la classe</h3>
        <ul>
          <li>
            <strong>Nom de la classe :</strong> {classroomStatistics?.classroomName || 'N/A'}
          </li>
          <li>
            <strong>Pays :</strong> {classroomStatistics?.classroomCountryCode || 'N/A'}
          </li>
          <li>
            <strong>Village :</strong> {classroomStatistics?.villageName || 'N/A'}
          </li>
          <li>
            <strong>Nombre de commentaires :</strong> {classroomStatistics?.commentsCount || 0}
          </li>
          <li>
            <strong>Nombre de vidéos :</strong> {classroomStatistics?.videosCount || 0}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ClassroomDetailsCard;
