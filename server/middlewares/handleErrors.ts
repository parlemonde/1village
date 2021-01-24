import { NextFunction, Request, RequestHandler, Response } from "express";
import stringify from "json-stable-stringify";

import { logger } from "../utils/logger";

export enum ErrorCode {
  UNKNOWN = 0,
  INVALID_USERNAME = 1,
  INVALID_PASSWORD = 2,
  ACCOUNT_BLOCKED = 3,
  PASSWORD_NOT_STRONG = 4,
  USE_SSO = 5,
  DONT_USO_SSO = 6,
  INVALID_DATA = 10,
}

export class AppError extends Error {
  public errorCode: ErrorCode;

  constructor(message: string, errorCode: ErrorCode) {
    super(message);
    this.errorCode = errorCode;
  }
}

interface PromiseRequestHandler extends RequestHandler {
  (req: Request, res: Response, next: NextFunction): Promise<void> | void;
}

export function handleErrors(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const sendError = (err: Error | AppError): void => {
      logger.error(err.message);
      if (!(err instanceof AppError)) {
        logger.error(JSON.stringify(err.stack));
      }
      const errorCode = err instanceof AppError ? err.errorCode : ErrorCode.UNKNOWN;
      const errorResponseStatus = errorCode === 0 ? 500 : errorCode <= 4 ? 401 : 400;
      res.setHeader("Content-Type", "application/json");
      res.status(errorResponseStatus).send(
        stringify({
          errorCode,
          message: err.message,
        }),
      );
    };

    try {
      Promise.resolve((fn as PromiseRequestHandler)(req, res, next)).catch(sendError);
    } catch (err) {
      sendError(err);
    }
  };
}
