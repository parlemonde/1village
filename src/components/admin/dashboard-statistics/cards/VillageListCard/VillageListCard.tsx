import React from 'react';

import styles from './VillageListCard.module.css'; // Import du CSS modulaire

const villages = [
  { name: 'Village France - Canada', color: 'green' },
  { name: 'Village France - Liban', color: 'orange' },
  { name: 'Village France - Italie', color: 'gold' },
  { name: 'Village France - Canada', color: 'yellow' },
  { name: 'Village France - Liban', color: 'green' },
  { name: 'Village France - Italie', color: 'limegreen' },
  { name: 'Village France - Canada', color: 'blue' },
  { name: 'Village France - Liban', color: 'red' },
  { name: 'Village France - Italie', color: 'orange' },
];

const VillageListCard = () => {
  return (
    <div className={styles.villageListContainer}>
      <h3>Ce pays participe dans les villages-monde suivants :</h3>
      <div className={styles.villageList}>
        {villages.map((village, index) => (
          <div key={index} className={styles.villageItem}>
            <span className={styles.villageBullet} style={{ backgroundColor: village.color }}></span>
            <a href="#">{village.name}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VillageListCard;
