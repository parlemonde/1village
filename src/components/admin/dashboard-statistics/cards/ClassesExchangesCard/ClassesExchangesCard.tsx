import React from 'react';

import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';

import styles from './ClassesExchangesCard.module.css';

interface ClassesExchangesCardProps {
  totalPublications: number;
  totalComments: number;
  totalVideos: number;
  enableColumns?: boolean;
}

const ICON_SX = { fontSize: '2.2rem', margin: '1rem .3rem' };

const StatItem: React.FC<{
  icon: React.ReactNode;
  value: number;
  label: string;
  inlineLabel?: boolean;
}> = ({ icon, value, label, inlineLabel = false }) => {
  if (inlineLabel) {
    return (
      <div className={`${styles.cardCountContainer} ${styles.cardCountContainerInline}`}>
        <span style={{ color: 'var(--secondary-color)' }}> {icon}</span>
        <p className={styles.cardCount}>{value}</p>
        <h4 style={{ fontWeight: 600 }}>{label}</h4>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.cardCountContainer}>
        {icon}
        <p className={styles.cardCount}>{value}</p>
      </div>
      <h5 className={styles.cardLabel}>{label}</h5>
    </div>
  );
};

const ClassesExchangesCard: React.FC<ClassesExchangesCardProps> = ({ totalPublications, totalComments, totalVideos, enableColumns = false }) => {
  const stats = [
    { key: 'publications', icon: <DescriptionOutlinedIcon sx={ICON_SX} />, value: totalPublications, label: 'Total des publications' },
    { key: 'comments', icon: <ChatBubbleOutlineOutlinedIcon sx={ICON_SX} />, value: totalComments, label: 'Commentaires' },
    { key: 'videos', icon: <YouTubeIcon sx={ICON_SX} />, value: totalVideos, label: 'Vidéos en ligne' },
  ];

  if (enableColumns) {
    return (
      <div className={`${styles.root} ${styles.cardContainerColumn}`}>
        <h5 className={styles.title}>Résumé des échanges sur 1Village</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '2rem' }}>
          {stats.map((s) => (
            <StatItem key={s.key} icon={s.icon} value={s.value} label={s.label} inlineLabel={true} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.root} ${styles.cardContainer}`}>
      <h5 className={styles.title}>Résumé des échanges sur 1Village</h5>
      <div className={styles.cardContainerExchange}>
        {stats.map((s) => (
          <StatItem key={s.key} icon={s.icon} value={s.value} label={s.label} />
        ))}
      </div>
    </div>
  );
};

export default ClassesExchangesCard;
