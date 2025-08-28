import React from 'react';

import styles from './ClassesExchangesCard.module.css';

interface ClassesExchangesCardProps {
  totalPublications: number;
  totalComments: number;
  totalVideos: number;
}

const ClassesExchangesCard = ({ totalPublications, totalComments, totalVideos }: ClassesExchangesCardProps) => {
  return (
    <div className={`${styles.root} ${styles.cardContainer}`}>
      <div className={styles.cardContainerExchange}>
        <div>
          <p>kk</p>
          <p>{totalPublications}</p>
        </div>
        <div>
          <p>qq</p>
          <p>{totalComments}</p>
        </div>
        <div>
          <p>pp</p>
          <p>{totalVideos}</p>
        </div>
      </div>
    </div>
  );
};

export default ClassesExchangesCard;
