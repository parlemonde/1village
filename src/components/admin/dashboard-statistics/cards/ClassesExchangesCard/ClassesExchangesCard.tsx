import React from 'react';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';

import styles from './ClassesExchangesCard.module.css';

interface ClassesExchangesCardProps {
  totalPublications: number;
  totalComments: number;
  totalVideos: number;
}

const ClassesExchangesCard = ({ totalPublications, totalComments, totalVideos }: ClassesExchangesCardProps) => {
  return (
    <div className={`${styles.root} ${styles.cardContainer}`}>
      <h5 className={styles.title}>Résumé des échanges sur 1Village</h5>

      <div className={styles.cardContainerExchange}>
        <div>
          <div className={styles.cardCountContainer}>
            <DescriptionOutlinedIcon sx={{ fontSize: '2.2rem', margin: '1rem .3rem' }} />
            <p className={styles.cardCount}>{totalPublications}</p>
          </div>
          <h5 className={styles.cardLabel}>Total des publications</h5>
        </div>
        <div>
          <div className={styles.cardCountContainer}>
            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: '2.2rem', margin: '1rem .3rem' }} />
            <p className={styles.cardCount}>{totalComments}</p>
          </div>
          <h5 className={styles.cardLabel}>Commentaires</h5>
        </div>
        <div>
          <div className={styles.cardCountContainer}>
            <YouTubeIcon sx={{ fontSize: '2.2rem', margin: '1rem .3rem' }} />
            <p className={styles.cardCount}>{totalVideos}</p>
          </div>
          <h5 className={styles.cardLabel}>Vidéos en ligne</h5>
        </div>
      </div>
    </div>
  );
};

export default ClassesExchangesCard;
