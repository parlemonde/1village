import stringify from 'json-stable-stringify';

import type { NextFunction, Request, Response } from 'express';

export function jsonify(_: Request, res: Response, next: NextFunction): void {
  res.sendJSON = (object: unknown | unknown[]): void => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(stringify(object));
  };
  next();
}
