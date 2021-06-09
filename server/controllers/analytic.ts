import { JSONSchemaType } from 'ajv';
import useragent from 'express-useragent';
import { getRepository } from 'typeorm';

import type { NavigationPerf, BrowserPerf } from 'types/analytics.type';

import { AnalyticSession, AnalyticPageView, AnalyticPerformance } from '../entities/analytic';
import { handleErrors } from '../middlewares/handleErrors';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { logger } from '../utils/logger';
import { generateTemporaryToken } from '../utils';

import { Controller } from './controller';

const analyticController = new Controller('/analytics');

type AddAnalytic = {
  sessionId: string;
  event: string;
  location: string;
  referrer?: string | null;
  width?: number;
  params?: {
    duration?: number;
    isInitial?: boolean;
    perf?: unknown;
  } | null;
};
const ADD_ANALYTIC_SCHEMA: JSONSchemaType<AddAnalytic> = {
  type: 'object',
  properties: {
    sessionId: {
      type: 'string',
      nullable: false,
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
          nullable: false,
        },
        isInitial: {
          type: 'boolean',
          nullable: false,
        },
        perf: {
          type: 'object',
          nullable: false,
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
        });
      }

      // Retrieve current user session or save the new one.
      let sessionCount = await getRepository(AnalyticSession).count({ where: { id: data.sessionId } });
      if (sessionCount === 0 && data.event === 'pageview' && data.params?.isInitial) {
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
        await getRepository(AnalyticSession).save(session);
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
        getRepository(AnalyticPageView).save(pageView).catch(); // no need to wait
      } else if (data.event === 'navigation-stats' && data.params && data.params.perf) {
        const pagePerf = new AnalyticPerformance();
        pagePerf.sessionId = data.sessionId;
        pagePerf.date = new Date();
        pagePerf.data = data.params.perf as NavigationPerf;
        getRepository(AnalyticPerformance).save(pagePerf).catch(); // no need to wait
      } else if (data.event === 'perf-stats' && data.params && data.params.perf) {
        const pagePerf = new AnalyticPerformance();
        pagePerf.sessionId = data.sessionId;
        pagePerf.date = new Date();
        pagePerf.data = data.params.perf as BrowserPerf;
        getRepository(AnalyticPerformance).save(pagePerf).catch(); // no need to wait
      } else if (data.event === 'session' && data.params?.duration) {
        getRepository(AnalyticSession).update({ id: data.sessionId }, { duration: data.params?.duration }).catch(); // no need to wait
      }
    } catch (e) {
      logger.error(e);
    }

    res.status(204).send();
  }),
);

export { analyticController };
