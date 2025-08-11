import { CircularProgress } from '@mui/material';

export enum AnalyticsDataType {
  GRAPHS = 'GRAPHS',
  WIDGETS = 'WIDGETS',
}

const Loader = ({ analyticsDataType }: { analyticsDataType: AnalyticsDataType }) => {
  return (
    <div
      style={{
        height: '4.5rem',
        margin: '6rem 21.5rem',
        padding: '0.75rem',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <CircularProgress />
      <p style={{ margin: 0, padding: '0.4rem 0 0.6rem', fontSize: '1.3rem' }}>{getLoaderLegend(analyticsDataType)}...</p>
    </div>
  );
};

export default Loader;

function getLoaderLegend(analyticsDataType: AnalyticsDataType): string {
  return analyticsDataType === AnalyticsDataType.GRAPHS ? 'Chargement des visuels' : 'Chargement des données';
}
