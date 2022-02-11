import Tokens from 'csrf';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { getHeader } from '../utils';

export function crsfProtection(): RequestHandler {
  // token repo
  const tokens = new Tokens();

  return (req: Request, res: Response, next: NextFunction) => {
    // get secret from cookie or create it.
    let secret: string | null = req.cookies ? req.cookies['csrf-secret'] || null : null;
    if (secret === null) {
      secret = tokens.secretSync();
      // save new secret in cookie for 4 hours.
      res.cookie('csrf-secret', secret, { expires: new Date(Date.now() + 4 * 60 * 60000), httpOnly: true, secure: true, sameSite: 'strict' });
    }

    // get token from header ['csrf-token'] or set it to null;
    const token: string | null = getHeader(req, 'csrf-token') || null;

    // return either the not null token or a new token based on the secret.
    req.getCsrfToken = () => {
      return token !== null ? token : tokens.create(secret as string);
    };

    // check csrf
    req.isCsrfValid = token !== null && tokens.verify(secret, token);

    // always go next. Invalid csrf are checked at authenticate method.
    next();
  };
}
