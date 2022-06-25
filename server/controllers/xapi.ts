import axios from 'axios';

import { logger } from '../utils/logger';
import { Controller } from './controller';

const XAPI_SERVER_URL = process.env.XAPI_URL || '';
const XAPI_AUTH = process.env.XAPI_AUTH || '';

type Statement = {
  actor: {
    account: {
      name: string;
      homePage: string;
    };
  } & Record<string, unknown>;
} & Record<string, unknown>;

const xapiController = new Controller('/xAPI');

xapiController.post({ path: '' }, async (req, res) => {
  if (!XAPI_SERVER_URL || !XAPI_AUTH) {
    res.status(204).send();
    return;
  }

  const statement = req.body as Statement;
  if (req.user) {
    statement.actor.account.name = req.user.pseudo;
  }
  statement.actor.account.homePage = 'https://1v.parlemonde.org';
  axios({
    url: XAPI_SERVER_URL,
    method: 'POST',
    headers: {
      'X-Experience-API-Version': '1.0.3',
      Authorization: XAPI_AUTH,
    },
    data: [statement],
  }).catch((e) => {
    logger.error(e);
  });
  res.status(204).send();
});

export { xapiController };
