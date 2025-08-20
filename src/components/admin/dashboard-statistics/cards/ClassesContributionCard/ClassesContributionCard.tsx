import React from 'react';

import ContributionBarChart from '../../charts/ContributionBarChart';
import styles from './ClassesContributionCard.module.css';
import type { ContributionBarChartData } from 'types/dashboard.type';

const CONTRIBUTION_BAR_CHAR_TITLE = 'Contribution des classes';

interface ClassesContributionCardProps {
  data: ContributionBarChartData;
}

const ClassesContributionCard = ({ data }: ClassesContributionCardProps) => {
  return (
    <div className={styles.cardContainer}>
      <ContributionBarChart dataByStep={data} title={CONTRIBUTION_BAR_CHAR_TITLE} />
    </div>
  );
};

export default ClassesContributionCard;
