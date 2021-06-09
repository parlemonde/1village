import Link from 'next/link';
import React from 'react';

import MaterialLink from '@material-ui/core/Link';
import { Paper, Grid } from '@material-ui/core';

import { BarWidget } from 'src/components/admin/analytics/BarWidget';
import { TimePicker, getToday } from 'src/components/admin/analytics/TimePicker';
import { TimeserieWidget } from 'src/components/admin/analytics/TimeserieWidget';
import { UserContext } from 'src/contexts/userContext';
import { serializeToQueryUrl } from 'src/utils';
import type { AnalyticData } from 'types/analytics.type';

const NumberStat = ({ label, value }: { label: string; value: string }) => {
  return (
    <Grid item xs={6} md="auto" style={{ position: 'relative' }}>
      <span>{label}</span>
      <div className="stat-number">{value}</div>
      <div style={{ borderRight: '1px solid #bbbbbb', height: '60%', position: 'absolute', right: '-1px', top: '20%' }} />
    </Grid>
  );
};

const getValues = (data: Partial<Record<string, number>>): Array<{ key: string; value: number }> =>
  Object.keys(data).map((key) => ({ key, value: data[key] }));

const Stats: React.FC = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const [period, setPeriod] = React.useState(getToday());
  const [data, setData] = React.useState<AnalyticData | null>(null);

  const getData = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      url: `/analytics${serializeToQueryUrl({
        from: period.startDate.getTime(),
        to: period.endDate.getTime(),
        aggregate: period.type === 'day' ? 'hours' : period.type === 'month' ? 'day' : 'month',
      })}`,
    });
    if (!response.error) {
      setData(response.data as AnalyticData);
    }
  }, [period, axiosLoggedRequest]);
  React.useEffect(() => {
    getData().catch(console.error);
  }, [getData]);

  const pages = React.useMemo(
    () => [
      {
        name: 'Toutes les pages',
        labels: ['Page', 'Nb de vues'],
        data: data === null ? [] : getValues(data.pages.all),
      },
      {
        name: 'Pages initiales',
        labels: ['Page', 'Nb de vues'],
        data: data === null ? [] : getValues(data.pages.initial),
      },
    ],
    [data],
  );

  const users = React.useMemo(
    () => [
      {
        name: 'Navigateurs',
        labels: ['Navigateur', 'Nb de sessions'],
        data: data === null ? [] : getValues(data.users.browsers),
      },
      {
        name: 'Os',
        labels: ['Os', 'Nb de sessions'],
        data: data === null ? [] : getValues(data.users.os),
      },
      {
        name: 'Taille',
        labels: ["Taille d'écran", 'Nb de sessions'],
        data: data === null ? [] : getValues(data.users.width),
      },
      {
        name: 'Type',
        labels: ['Type', 'Nb de sessions'],
        data: data === null ? [] : getValues(data.users.type),
      },
    ],
    [data],
  );

  return (
    <div className="admin--container">
      <Link href="/admin/analytics">
        <MaterialLink href="/admin/analytics">
          <h1 style={{ marginBottom: '1rem' }}>Web Analytics</h1>
        </MaterialLink>
      </Link>
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        <Grid container justify="flex-start" spacing={3}>
          <Grid item xs={12} md={6} />
          <Grid item xs={12} md={6}>
            <TimePicker period={period} setPeriod={setPeriod} />
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper style={{ padding: '1rem' }}>
              <Grid container justify="flex-start" spacing={4} style={{ overflow: 'hidden' }}>
                {data !== null && (
                  <>
                    <NumberStat label="Visiteurs uniques" value={`${data.sessions.uniqueVisitors.total}`} />
                    <NumberStat label="Visiteurs" value={`${data.sessions.visitors.total}`} />
                    <NumberStat label="Nombre de pages vues" value={`${data.sessions.pageCount}`} />
                    <NumberStat label="Durées moyennes des sessions" value={`${data.sessions.meanDuration}`} />
                  </>
                )}
              </Grid>
              {data !== null && (
                <TimeserieWidget
                  labels={data.sessions.labels}
                  datasets={[
                    {
                      name: 'Visiteurs',
                      data: data.sessions.visitors.data,
                    },
                    {
                      name: 'Visiteurs uniques',
                      data: data.sessions.uniqueVisitors.data,
                    },
                  ]}
                  aggregation={data.aggregation}
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <BarWidget name="Page les plus vues" datasets={pages} />
          </Grid>
          <Grid item xs={12} md={6}>
            <BarWidget name="Navigateurs et taille d'écrans" datasets={users} />
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper style={{ padding: '1rem' }}>
              <div style={{ margin: '0.25rem 0' }}>
                <strong>Signaux Web Essentiels</strong> (Core Web Vitals)
              </div>
              <Grid container justify="flex-start" spacing={4} style={{ overflow: 'hidden', margin: '0.5rem -16px' }}>
                <NumberStat label="Moyenne LCP" value="345" />
                <NumberStat label="Moyenne FID" value="0.3432" />
                <NumberStat label="Moyenne CLS" value="23" />
              </Grid>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <TimeserieWidget
                    title="Temps de chargement: Largest contentful paint (LCP)"
                    labels={[162222127556, 1622221275456, 1622221275556, 1622221275656, 1622221275756, 1622221275856]}
                    datasets={[
                      {
                        name: 'Visiteurs',
                        data: [3, 10, 5, 2, 20, 30, 45],
                      },
                    ]}
                    aggregation="hour"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TimeserieWidget
                    title="Interactivité: First input delay (FID)"
                    labels={[162222127556, 1622221275456, 1622221275556, 1622221275656, 1622221275756, 1622221275856]}
                    datasets={[
                      {
                        name: 'Visiteurs',
                        data: [3, 10, 5, 2, 20, 30, 45],
                      },
                    ]}
                    aggregation="hour"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TimeserieWidget
                    title="Stabilité visuelle: Cumulative layout shift (CLS)"
                    labels={[162222127556, 1622221275456, 1622221275556, 1622221275656, 1622221275756, 1622221275856]}
                    datasets={[
                      {
                        name: 'Visiteurs',
                        data: [3, 10, 5, 2, 20, 30, 45],
                      },
                    ]}
                    aggregation="hour"
                  />
                </Grid>
                <Grid item xs={12} md={6}></Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Stats;
