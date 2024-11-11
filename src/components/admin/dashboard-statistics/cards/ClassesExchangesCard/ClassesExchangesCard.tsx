import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import YouTubeIcon from '@mui/icons-material/YouTube';
import classNames from 'classnames';
import React from 'react';

import styles from './ClassesExchangesCard.module.css';

interface ClassesExchangesCardProps {
  totalPublications: number;
  totalComments: number;
  totalVideos: number;
  className?: string;
}

const ClassesExchangesCard = ({ totalPublications, totalComments, totalVideos, className }: ClassesExchangesCardProps) => {
  return (
    <div className={classNames(styles.cardContainer, className)}>
      <p>Résumé des échanges sur 1village</p>
      <div>
        <div className={styles.cardContainerExchange}>
          <div>
            <DescriptionIcon sx={{ fontSize: 'inherit' }} />
            <p>{totalPublications}</p>
          </div>
          <p>Total des publications</p>
        </div>
        <div className={styles.cardContainerExchange}>
          <div>
            <ChatBubbleOutlineIcon sx={{ fontSize: 'inherit' }} />
            <p>{totalComments}</p>
          </div>
          <p>Commentaires</p>
        </div>
        <div className={styles.cardContainerExchange}>
          <div>
            <YouTubeIcon sx={{ fontSize: 'inherit' }} />
            <p>{totalVideos}</p>
          </div>
          <p>Vidéos en ligne</p>
        </div>
      </div>
    </div>
  );
};

export default ClassesExchangesCard;
