import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import MaterialLink from '@mui/material/Link';
import { Paper, Grid } from '@mui/material';

import { BarWidget } from 'src/components/admin/analytics/BarWidget';
import { TimePicker, getToday } from 'src/components/admin/analytics/TimePicker';
import { TimeserieWidget } from 'src/components/admin/analytics/TimeserieWidget';
import { UserContext } from 'src/contexts/userContext';
import { serializeToQueryUrl } from 'src/utils';
import type { AnalyticData } from 'types/analytics.type';

const GREEN_COLOR = '#92e892';
const ORANGE_COLOR = '#f7b045';
const RED_COLOR = '#f26650';

const getBackgroundColor = (range: number[], value: number): string => {
  if (range.length === 0 || value < range[0]) {
    return GREEN_COLOR;
  }
  if (range.length === 1 || value < range[1]) {
    return ORANGE_COLOR;
  }
  return RED_COLOR;
};

const NumberStat = ({ label, value, color }: { label: string; value: string; color?: string }) => {
  return (
    <Grid item xs={6} md="auto" sx={{ position: 'relative', p: 2, m: 0 }}>
      <span>{label}</span>
      <div className="stat-number" style={{ backgroundColor: color }}>
        {value}
      </div>
      <div style={{ borderRight: '1px solid #bbbbbb', height: '60%', position: 'absolute', right: '-1px', top: '20%' }} />
    </Grid>
  );
};

const getValues = (data: Partial<Record<string, number>>): Array<{ key: string; value: number }> =>
  Object.keys(data).map((key) => ({ key, value: data[key] || 0 }));

const Stats = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const [period, setPeriod] = React.useState(getToday());
  const [data, setData] = React.useState<AnalyticData | null>(null);

  const getData = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      url: `/analytics${serializeToQueryUrl({
        from: period.startDate.getTime(),
        to: period.endDate.getTime(),
        aggregate: period.type === 'day' ? 'hour' : period.type === 'month' ? 'day' : 'month',
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
      <Link href="/admin/analytics" passHref>
        <MaterialLink href="/admin/analytics">
          <h1 style={{ marginBottom: '1rem' }}>Web Analytics</h1>
        </MaterialLink>
      </Link>
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        <Grid container spacing={3} sx={{ justifyContent: 'flex-start' }}>
          <Grid item xs={12} md={6} />
          <Grid item xs={12} md={6}>
            <TimePicker period={period} setPeriod={setPeriod} />
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper style={{ padding: '1rem' }}>
              <Grid container spacing={4} sx={{ overflow: 'hidden', justifyContent: 'flex-start', m: -2 }}>
                {data !== null && (
                  <>
                    <NumberStat label="Visiteurs uniques" value={`${data.sessions.uniqueVisitors.total}`} />
                    <NumberStat label="Visiteurs" value={`${data.sessions.visitors.total}`} />
                    <NumberStat label="Nombre de pages vues" value={`${data.sessions.pageCount}`} />
                    <NumberStat label="Durées moyennes des sessions" value={`${Math.round(data.sessions.meanDuration)}`} />
                  </>
                )}
              </Grid>
              {data !== null && (
                <TimeserieWidget
                  labels={data.labels}
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
              {data !== null && (
                <Grid container spacing={4} style={{ overflow: 'hidden', margin: '0.5rem -16px', justifyContent: 'flex-start' }}>
                  <NumberStat
                    label="Moyenne LCP"
                    value={`${Math.round(data.perf.lcp.avg) / 1000}s`}
                    color={getBackgroundColor([2.4, 4], Math.round(data.perf.lcp.avg) / 1000)}
                  />
                  <NumberStat
                    label="Moyenne FID"
                    value={`${Math.round(data.perf.fid.avg)}ms`}
                    color={getBackgroundColor([100, 300], Math.round(data.perf.fid.avg))}
                  />
                  <NumberStat
                    label="Moyenne CLS"
                    value={`${Math.round(data.perf.cls.avg * 10000) / 10000}`}
                    color={getBackgroundColor([0.1, 0.25], Math.round(data.perf.cls.avg * 10000) / 10000)}
                  />
                </Grid>
              )}
              <Grid container alignItems="center">
                {data !== null && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TimeserieWidget
                        title="Temps de chargement: Largest contentful paint (LCP)"
                        labels={data.labels}
                        datasets={[
                          {
                            name: 'LCP',
                            data: data.perf.lcp.data.map((d) => Math.round(d) / 1000),
                          },
                        ]}
                        aggregation={data.aggregation}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TimeserieWidget
                        title="Interactivité: First input delay (FID)"
                        labels={data.labels}
                        datasets={[
                          {
                            name: 'FID',
                            data: data.perf.fid.data.map((d) => Math.round(d)),
                          },
                        ]}
                        aggregation={data.aggregation}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TimeserieWidget
                        title="Stabilité visuelle: Cumulative layout shift (CLS)"
                        labels={data.labels}
                        datasets={[
                          {
                            name: 'CLS',
                            data: data.perf.cls.data.map((d) => Math.round(d * 10000) / 10000),
                          },
                        ]}
                        aggregation={data.aggregation}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <div style={{ display: 'flex', width: '100%', height: '160px', alignItems: 'center' }}>
                        <div style={{ flex: 1, width: '33.3333%', height: '100%', position: 'relative' }}>
                          <Image layout="fill" src="https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZZU8Z7TMKXmzZT2mCjJU.svg" />
                        </div>
                        <div style={{ flex: 1, width: '33.3333%', height: '100%', position: 'relative' }}>
                          <Image layout="fill" src="https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iHYrrXKe4QRcb2uu8eV8.svg" />
                        </div>
                        <div style={{ flex: 1, width: '33.3333%', height: '100%', position: 'relative' }}>
                          <Image layout="fill" src="https://web-dev.imgix.net/image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dgpDFckbHwwOKdIGDa3N.svg" />
                        </div>
                      </div>
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Stats;
