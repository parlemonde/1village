import { logger } from './logger';

/**
 * Return a valid port number.
 * @param val
 */
function normalizePort(val: number | string): boolean | number {
  if (typeof val === 'number') {
    return Number(val) || false;
  }
  const parsedPort = parseInt(val, 10);
  if (Number.isNaN(parsedPort)) {
    return false;
  }
  if (parsedPort >= 0) {
    return parsedPort;
  }
  return false;
}

/**
 * Display the error message if the server can't start and stop the program.
 * @param error
 */
function onError(error: Error & { syscall: string; code: string }): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error('Elevated privileges required.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error('Port is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

export function getDefaultDirectives(): { [directiveName: string]: Iterable<string> } {
  return {
    'default-src': ["'self'"],
    'base-uri': ["'self'"],
    'block-all-mixed-content': [],
    'font-src': ["'self'", 'https:'],
    'frame-ancestors': ["'self'"],
    'frame-src': ['https:'],
    'connect-src': ["'self'", 'http:', 'https:', 'data:', 'blob:'],
    'img-src': ["'self'", 'http:', 'https:', 'data:', 'blob:'],
    'object-src': ["'none'"],
    'script-src': ["'self'", 'https:', 'blob:', "'unsafe-inline'"],
    'script-src-attr': ["'none'"],
    'style-src': ["'self'", "'unsafe-inline'", 'https:'],
    'media-src': ['*', 'data:', 'https:', 'blob:'],
    'upgrade-insecure-requests': [],
  };
}

export { normalizePort, onError };
