import styles from './VillageListCard.module.css'; // Import du CSS modulaire
import type { VillageListItem } from 'types/analytics/village-list-item';

interface VillageListCardProps {
  villageList: VillageListItem[];
}

const VillageListCard = ({ villageList }: Readonly<VillageListCardProps>) => {
  return (
    <div className={styles.villageListContainer}>
      <h3>Ce pays participe dans les villages-monde suivants :</h3>
      <div className={styles.villageList}>
        {villageList.map((village) => (
          <div key={village.name} className={styles.villageItem}>
            <span className={styles.villageBullet} style={{ backgroundColor: village.color }}></span>
            <a href="#">{village.name}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VillageListCard;
