import type { Request, Response, NextFunction } from 'express';

import { UserType } from '../entities/user';
import { streamFile } from '../fileUpload/streamFile';
import { Controller } from './controller';

const archiveController = new Controller('/archives');

// get file
archiveController.get({ path: '/*', userType: UserType.ADMIN }, async (req: Request, res: Response, next: NextFunction) => {
  const url = decodeURI(req.url);
  const key = `archives${url}${url.split('/').length === 2 ? '/index.html' : url.indexOf('.') === -1 ? '.html' : ''}`;
  try {
    streamFile(key, req, res, next);
  } catch {
    next();
  }
});

export { archiveController };
