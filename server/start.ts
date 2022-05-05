import 'dotenv/config';

import { getStagingApp } from './app-staging';
import { getApp } from './app';
import { logger } from './utils/logger';
import { normalizePort, onError } from './utils/server';

async function start() {
  const app = process.env.NODE_USE_STAGING ? await getStagingApp() : await getApp();

  // --- Start server ---
  const port = normalizePort(process.env.PORT || '5000');
  const server = app.listen(port);
  server.on('error', onError);
  server.on('listening', () => {
    logger.info(`App listening on port ${port}!`);
  });
}

start().catch((e: Error) => {
  console.error(e);
  process.exit(0);
});
