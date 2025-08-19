import React from 'react';

import CountryMap from '../../map/CountryMap/CountryMap';
import styles from './ClassroomDetailsCard.module.css';

interface ClassroomDetailsCardProps {
  classroomDetails: string;
}

const ClassroomDetailsCard = ({ classroomDetails }: ClassroomDetailsCardProps) => {
  return (
    <div className={styles.mainContainer}>
      <CountryMap countryIso2="VN" />
      <div className={styles.infoContainer}>
        <h1>Ecole</h1>
        <ul>
          <li>Adresse</li>
          <li>Pays: {classroomDetails}</li>
          <li>Village Monde: </li>
          <li>Adresse Mail: </li>
          <li>Dernière connexion: </li>
          <li>
            <a href="#">Lien vers la fiche civicrm</a>
          </li>
          <li>
            <a href="#">Lien vers la salle des professeurs</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ClassroomDetailsCard;
