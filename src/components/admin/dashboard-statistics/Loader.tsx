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
        padding: '0.75rem',
        margin: '6rem auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <CircularProgress />
      <p style={{ margin: 0, padding: '0.4rem 0 0.6rem 0.4rem', fontSize: '1.3rem' }}>{getLoaderLegend(analyticsDataType)}...</p>
    </div>
  );
};

export default Loader;

function getLoaderLegend(analyticsDataType: AnalyticsDataType): string {
  return analyticsDataType === AnalyticsDataType.GRAPHS ? 'Chargement des visuels' : 'Chargement des données';
}
