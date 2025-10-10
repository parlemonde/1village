import { getCountryColor } from '../../utils/colorMapper';
import styles from './VillageListCard.module.css'; // Import du CSS modulaire
import { useGetVillageEngagementStatus } from 'src/api/statistics/statistics.get';
import type { Village } from 'types/village.type';

interface VillageListCardProps {
  villageList: Village[];
  selectedCountry?: string;
  onVillageClick?: (villageId: number, countryCode?: string) => void;
}

const VillageListCard = ({ villageList, selectedCountry, onVillageClick }: Readonly<VillageListCardProps>) => {
  return (
    <div className={styles.villageListContainer}>
      <h3>Ce pays participe dans les villages-monde suivants :</h3>
      <div className={styles.villageList}>
        {villageList.map((village) => (
          <VillageItem
            key={village.id}
            village={village}
            selectedCountry={selectedCountry}
            onClick={() => onVillageClick?.(village.id, selectedCountry)}
          />
        ))}
      </div>
    </div>
  );
};

interface VillageItemProps {
  village: Village;
  selectedCountry?: string;
  onClick?: (villageId: number, countryCode?: string) => void;
}

const VillageItem = ({ village, selectedCountry, onClick }: VillageItemProps) => {
  const { data: status, isLoading } = useGetVillageEngagementStatus(village.id);

  const color = isLoading ? 'gray' : getCountryColor(status);

  return (
    <div className={styles.villageItem}>
      <span className={styles.villageBullet} style={{ backgroundColor: color }}></span>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick && onClick(village.id, selectedCountry);
        }}
      >
        {village.name}
      </a>
    </div>
  );
};

export default VillageListCard;
