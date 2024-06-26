import React from 'react';

import styles from './ClassroomDetailsCard.module.css';
import CountrySVG from 'src/components/country-svg/CountrySVG';

const ClassroomDetailsCard = () => {
  return (
    <div className={styles.mainContainer}>
      <CountrySVG countryIso2="VN" />
      <div className={styles.infoContainer}>
        <h1>Ecole</h1>
        <ul>
          <li>Adresse</li>
          <li>Pays: </li>
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
