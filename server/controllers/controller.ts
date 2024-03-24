import type { RequestHandler } from 'express';
import { Router } from 'express';
import fs from 'fs-extra';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import type { UserType } from '../entities/user';
import { authenticate } from '../middlewares/authenticate';
import { handleErrors } from '../middlewares/handleErrors';

type RouteOptions = {
  path: string;
  userType?: UserType;
};

fs.ensureDir(path.join(__dirname, '../fileUpload/videos')).catch();
const diskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '../fileUpload/videos/'));
  },
  filename: function (_req, file, cb) {
    const uuid = uuidv4();
    cb(null, `${uuid}${path.extname(file.originalname)}`);
  },
});

export class Controller {
  private uploadMiddleware = multer({ storage: multer.memoryStorage() });
  private uploadVideoMiddleware = multer({ storage: diskStorage });
  public router: Router;
  public name: string;

  constructor(name: string) {
    this.router = Router({ mergeParams: true });
    this.name = name;
  }

  public get(options: RouteOptions, handler: RequestHandler): void {
    this.router.get(options.path, handleErrors(authenticate(options.userType)), handleErrors(handler));
  }

  public head(options: RouteOptions, handler: RequestHandler): void {
    this.router.head(options.path, handleErrors(authenticate(options.userType)), handleErrors(handler));
  }

  public post(options: RouteOptions, handler: RequestHandler): void {
    this.router.post(options.path, handleErrors(authenticate(options.userType)), handleErrors(handler));
  }

  public put(options: RouteOptions, handler: RequestHandler): void {
    this.router.put(options.path, handleErrors(authenticate(options.userType)), handleErrors(handler));
  }

  public delete(options: RouteOptions, handler: RequestHandler): void {
    this.router.delete(options.path, handleErrors(authenticate(options.userType)), handleErrors(handler));
  }

  public upload(options: RouteOptions & { multerFieldName: string; saveOnDisk?: boolean }, handler: RequestHandler): void {
    if (options.saveOnDisk) {
      this.router.post(
        options.path,
        this.uploadVideoMiddleware.single(options.multerFieldName),
        handleErrors(authenticate(options.userType)),
        handleErrors(handler),
      );
    } else {
      this.router.post(
        options.path,
        this.uploadMiddleware.single(options.multerFieldName),
        handleErrors(authenticate(options.userType)),
        handleErrors(handler),
      );
    }
  }
}
