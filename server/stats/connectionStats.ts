import moment from 'moment';

import { AnalyticPerformance } from '../entities/analytic';
import { AppDataSource } from '../utils/data-source';
// Pour manipuler les dates
const analyticPerformanceRepository = AppDataSource.getRepository(AnalyticPerformance);

export const getConnections = async (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const queryBuilder = analyticPerformanceRepository
    .createQueryBuilder('analytic_performance')
    .select('user.villageId', 'villageId')
    .select('MIN(analytic_session.duration)', 'minDuration')
    .innerJoin('analytic_session.user', 'user')
    .leftJoin('user.classroom', 'classroom');

  if (villageId) {
    queryBuilder.andWhere('user.villageId = :villageId', { villageId });
  }

  if (countryCode) {
    queryBuilder.andWhere('user.countryCode = :countryCode', { countryCode });
  }

  if (classroomId) {
    queryBuilder.andWhere('classroom.id = :classroomId', { classroomId });
  }

  const result = await queryBuilder.getRawOne();

  return result.minDuration ? parseInt(result.minDuration, 10) : null;
};

type DayData = { value: number; isSelected: boolean };
type MonthData = { month: string; barChartData: DayData[] };

export const getBarChartData = async () => {
  // Données fictives pour tester (remplace par les données de ta base)
  const analyticPerformanceRepository = AppDataSource.getRepository(AnalyticPerformance);
  const rawData = await analyticPerformanceRepository.find();

  // Étape 1 : Regrouper les données par mois et jour
  const groupedData = rawData.reduce((acc, item) => {
    const date = moment(item.date);
    const monthYear = date.format('MMMM YYYY'); // Exemple : "Mars 2023"
    const day = date.date(); // Numéro du jour dans le mois

    if (!acc[monthYear]) {
      acc[monthYear] = {};
    }
    if (!acc[monthYear][day]) {
      acc[monthYear][day] = 0;
    }

    acc[monthYear][day] += 1; // Incrémenter le compteur pour ce jour
    return acc;
  }, {} as Record<string, Record<number, number>>);

  // Étape 2 : Compléter les jours manquants dans chaque mois
  const result: MonthData[] = Object.keys(groupedData).map((monthYear) => {
    const daysInMonth = moment(monthYear, 'MMMM YYYY').daysInMonth(); // Nombre de jours dans le mois
    const barChartData: DayData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const value = groupedData[monthYear][day] || 0; // Utilise 0 si aucune donnée pour ce jour
      barChartData.push({
        value,
        isSelected: value > 0, // Exemple : sélectionner si ce jour a au moins une occurrence
      });
    }

    return {
      month: monthYear,
      barChartData,
    };
  });

  return result;
};
