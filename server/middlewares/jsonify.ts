import type { NextFunction, Request, Response } from 'express';
import stringify from 'json-stable-stringify';

export function jsonify(_: Request, res: Response, next: NextFunction): void {
  res.sendJSON = (object: unknown | unknown[]): void => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(stringify(object));
  };
  next();
}
