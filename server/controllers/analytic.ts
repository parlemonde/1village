import type { JSONSchemaType } from 'ajv';
import useragent from 'express-useragent';
import { Between } from 'typeorm';

import type { AnalyticData, NavigationPerf, BrowserPerf } from '../../types/analytics.type';
import { AnalyticSession, AnalyticPageView, AnalyticPerformance } from '../entities/analytic';
import { User, UserType } from '../entities/user';
import { AppError, ErrorCode, handleErrors } from '../middlewares/handleErrors';
import { generateTemporaryToken, getQueryString } from '../utils';
import { AppDataSource } from '../utils/data-source';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { logger } from '../utils/logger';
import { Controller } from './controller';

const analyticController = new Controller('/analytics');

const getAggregate = (agg: string = 'hour'): AnalyticData['aggregation'] => {
  if (agg === 'month') {
    return 'month';
  }
  if (agg === 'day') {
    return 'day';
  }
  return 'hour';
};

const countAttribute = <T extends string | number>(arr: Array<T | null>): Partial<Record<T, number>> => {
  const result: Partial<Record<T, number>> = {};
  for (const o of arr) {
    if (o === null) {
      continue;
    }
    if (result[o] !== undefined) {
      (result[o] as number) += 1;
    } else {
      result[o] = 1;
    }
  }
  return result;
};

const getPerfData = (aggPerfs: Record<number, AnalyticPerformance[]>, perf: keyof BrowserPerf | keyof NavigationPerf) => {
  let total = 0;
  let avg = 0;
  const data: number[] = [];
  for (const key of Object.keys(aggPerfs)) {
    const perfs = aggPerfs[Number(key)].filter((d) => perf in d.data);
    const aggSum = perfs.reduce<number>((sum, d) => sum + (d.data as Record<string, number>)[perf], 0);
    data.push(perfs.length === 0 ? 0 : aggSum / perfs.length);
    avg = total + perfs.length === 0 ? 0 : (avg * total + aggSum) / (total + perfs.length);
    total += perfs.length;
  }
  return {
    total,
    avg,
    data,
  };
};

const MONTH_MS = 2678400000;
const DAY_MS = 86400000;
const HOUR_MS = 3600000;

analyticController.get({ path: '', userType: UserType.ADMIN }, async (req, res) => {
  const aggregate = getAggregate(getQueryString(req.query.aggregate));
  const fromTimestamp = Number(getQueryString(req.query.from)) || 0;
  const toTimestamp = Number(getQueryString(req.query.to)) || 0;

  let from: Date, to: Date;
  if (fromTimestamp && toTimestamp) {
    from = new Date(fromTimestamp);
    to = new Date(toTimestamp);
  } else {
    from = new Date();
    from.setHours(0, 0, 0, 0);
    to = new Date(from);
    to.setDate(from.getDate() + 1);
  }

  // Check timerange
  const diff = to.getTime() - from.getTime();
  if (diff < 0) {
    throw new AppError('Invalid timerange', ErrorCode.UNKNOWN);
  }
  if (aggregate === 'month' && diff > 300 * MONTH_MS) {
    throw new AppError('Timerange too big, please select a narrower timerange', ErrorCode.UNKNOWN);
  }
  if (aggregate === 'day' && diff > 300 * DAY_MS) {
    throw new AppError('Timerange too big, please select a narrower timerange', ErrorCode.UNKNOWN);
  }
  if (aggregate === 'hour' && diff > 300 * HOUR_MS) {
    throw new AppError('Timerange too big, please select a narrower timerange', ErrorCode.UNKNOWN);
  }

  // [1] get pageview and sessions.
  const pageViews = await AppDataSource.getRepository(AnalyticPageView).find({ where: { date: Between(from, to) }, order: { date: 'ASC' } });
  const allSessions = await AppDataSource.getRepository(AnalyticSession).find({ where: { date: Between(from, to) }, order: { date: 'ASC' } });
  const allPerfs = await AppDataSource.getRepository(AnalyticPerformance).find({ where: { date: Between(from, to) }, order: { date: 'ASC' } });
  const allDurations = allSessions.filter((s) => s.duration !== null).map((s) => s.duration as number);
  const labels: number[] = [];

  // [2] aggregate sessions and performances per timestamps.
  const aggSessions: Record<number, AnalyticSession[]> = {};
  const aggPerfs: Record<number, AnalyticPerformance[]> = {};
  let currentDate = new Date(from);
  let sessionIndex = 0;
  let perfIndex = 0;
  while (currentDate.getTime() < to.getTime()) {
    const currentTimestamp = currentDate.getTime();
    const nextDate = new Date(currentDate);
    if (aggregate === 'hour') {
      nextDate.setHours(nextDate.getHours() + 1);
    } else if (aggregate === 'day') {
      nextDate.setDate(nextDate.getDate() + 1);
    } else {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    labels.push(currentTimestamp);

    aggSessions[currentTimestamp] = [];
    while (allSessions.length > sessionIndex && allSessions[sessionIndex].date.getTime() < nextDate.getTime()) {
      aggSessions[currentTimestamp] = aggSessions[currentTimestamp].concat(allSessions[sessionIndex]);
      sessionIndex += 1;
    }

    aggPerfs[currentTimestamp] = [];
    while (allPerfs.length > perfIndex && allPerfs[perfIndex].date.getTime() < nextDate.getTime()) {
      aggPerfs[currentTimestamp] = aggPerfs[currentTimestamp].concat(allPerfs[perfIndex]);
      perfIndex += 1;
    }
    currentDate = nextDate;
  }

  // [3] compute sessions
  const sessions: AnalyticData['sessions'] = {
    visitors: { total: allSessions.length, data: [] },
    uniqueVisitors: { total: new Set(allSessions.map((s) => s.uniqueId)).size, data: [] },
    meanDuration: allDurations.reduce<number>((a, b) => a + b, 0) / allDurations.length,
    pageCount: pageViews.length,
  };
  for (const key of Object.keys(aggSessions)) {
    const uIds = aggSessions[Number(key)].map((s) => s.uniqueId);
    sessions.visitors.data.push(uIds.length);
    sessions.uniqueVisitors.data.push(new Set(uIds).size);
  }

  // [4] compute pages
  const pages: AnalyticData['pages'] = {
    all: countAttribute(pageViews.map((p) => p.page)),
    referrers: countAttribute(pageViews.map((p) => p.referrer)),
    initial: countAttribute(allSessions.map((s) => s.initialPage)),
  };

  // [5] compute browsers
  const users: AnalyticData['users'] = {
    browsers: countAttribute(allSessions.map((s) => s.browserName)),
    versions: countAttribute(allSessions.map((s) => s.browserVersion)),
    os: countAttribute(allSessions.map((s) => s.os)),
    width: countAttribute(allSessions.map((s) => s.width)),
    type: countAttribute(allSessions.map((s) => s.type)),
  };

  const perf: AnalyticData['perf'] = {
    lcp: getPerfData(aggPerfs, 'lcp'),
    fid: getPerfData(aggPerfs, 'fid'),
    cls: getPerfData(aggPerfs, 'cls'),
  };

  const fullData: AnalyticData = {
    sessions,
    pages,
    users,
    perf,
    labels,
    aggregation: aggregate,
  };
  res.sendJSON(fullData);
});

type AddAnalytic = {
  sessionId: string;
  userId?: number;
  event: string;
  location: string;
  referrer?: string | null;
  width?: number | null;
  params?: {
    duration?: number;
    isInitial?: boolean;
    perf?: Record<string, unknown>;
  } | null;
};
const ADD_ANALYTIC_SCHEMA: JSONSchemaType<AddAnalytic> = {
  type: 'object',
  properties: {
    sessionId: {
      type: 'string',
      nullable: false,
    },
    userId: {
      type: 'number',
      nullable: true,
    },
    event: {
      type: 'string',
      nullable: false,
    },
    location: {
      type: 'string',
      nullable: false,
    },
    referrer: {
      type: 'string',
      nullable: true,
    },
    width: {
      type: 'number',
      nullable: true,
    },
    params: {
      type: 'object',
      nullable: true,
      properties: {
        duration: {
          type: 'number',
          nullable: true,
        },
        isInitial: {
          type: 'boolean',
          nullable: true,
        },
        perf: {
          type: 'object',
          nullable: true,
          properties: {},
          required: [],
          additionalProperties: true,
        },
      },
      required: [],
      additionalProperties: false,
    },
  },
  required: ['sessionId', 'event', 'location'],
  additionalProperties: false,
};
const addAnalyticValidator = ajv.compile(ADD_ANALYTIC_SCHEMA);
analyticController.router.post(
  '',
  useragent.express(),
  handleErrors(async (req, res) => {
    const data = req.body;

    if (!addAnalyticValidator(data)) {
      sendInvalidDataError(addAnalyticValidator);
      return;
    }

    try {
      // Track unique visitors.
      let uniqueSessionId = req.cookies['session-id'];
      if (!uniqueSessionId) {
        uniqueSessionId = generateTemporaryToken(20);
        res.cookie('session-id', uniqueSessionId, {
          maxAge: 10 * 365 * 24 * 60 * 60000,
          expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60000),
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        });
      }

      // Retrieve current user session or save the new one.
      let sessionCount = await AppDataSource.getRepository(AnalyticSession).count({ where: { id: data.sessionId } });
      const userPhase = await AppDataSource.getRepository(User)
        .createQueryBuilder('user')
        .select('user.firstlogin')
        .where({ id: data?.userId })
        .getRawOne();

      if (sessionCount === 0 && data.event === 'pageview' && data.params?.isInitial) {
        // phase ??
        const session = new AnalyticSession();
        session.id = data.sessionId;
        session.uniqueId = uniqueSessionId;
        session.date = new Date();
        session.browserName = req.useragent?.browser ?? '';
        session.browserVersion = req.useragent?.version ?? '';
        session.os = req.useragent?.os ?? '';
        session.type = req.useragent?.isDesktop ? 'desktop' : req.useragent?.isTablet ? 'tablet' : req.useragent?.isMobile ? 'mobile' : 'other';
        session.width = data.width || 0;
        session.duration = null;
        session.initialPage = data.location;
        session.userId = data?.userId ?? null;
        session.phase = userPhase ? parseInt(userPhase) : 0;

        // FIND PHASE OF USER VILLAGE session.phase = ;

        await AppDataSource.getRepository(AnalyticSession).save(session);
        sessionCount = 1;
      }

      // If no session, exit.
      if (sessionCount === 0) {
        res.status(204).send();
        return;
      }

      // Save data.
      if (data.event === 'pageview') {
        const pageView = new AnalyticPageView();
        pageView.sessionId = data.sessionId;
        pageView.date = new Date();
        pageView.page = data.location;
        pageView.referrer = data.referrer || null;
        AppDataSource.getRepository(AnalyticPageView).save(pageView).catch(); // no need to wait
      } else if (data.event === 'navigation-stats' && data.params && data.params.perf) {
        const pagePerf = new AnalyticPerformance();
        pagePerf.sessionId = data.sessionId;
        pagePerf.date = new Date();
        pagePerf.data = data.params.perf as unknown as NavigationPerf;
        AppDataSource.getRepository(AnalyticPerformance).save(pagePerf).catch(); // no need to wait
      } else if (data.event === 'perf-stats' && data.params && data.params.perf) {
        const pagePerf = new AnalyticPerformance();
        pagePerf.sessionId = data.sessionId;
        pagePerf.date = new Date();
        pagePerf.data = data.params.perf as BrowserPerf;
        AppDataSource.getRepository(AnalyticPerformance).save(pagePerf).catch(); // no need to wait
      } else if (data.event === 'session' && data.params?.duration) {
        AppDataSource.getRepository(AnalyticSession).update({ id: data.sessionId }, { duration: data.params?.duration }).catch(); // no need to wait
      }
    } catch (e) {
      logger.error(e);
    }

    res.status(204).send();
  }),
);

export { analyticController };
