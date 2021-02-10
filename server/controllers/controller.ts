import { Router, RequestHandler } from 'express';
import multer from 'multer';

import { UserType } from '../entities/user';
import { authenticate } from '../middlewares/authenticate';
import { handleErrors } from '../middlewares/handleErrors';

type RouteOptions = {
  path: string;
  userType?: UserType;
};

export class Controller {
  private uploadMiddleware = multer({ storage: multer.memoryStorage() });
  public router: Router;
  public name: string;

  constructor(name: string) {
    this.router = Router({ mergeParams: true });
    this.name = name;
  }

  public get(options: RouteOptions, handler: RequestHandler): void {
    this.router.get(options.path, handleErrors(authenticate(options.userType)), handleErrors(handler));
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

  public upload(options: RouteOptions & { multerFieldName: string }, handler: RequestHandler): void {
    this.router.post(
      options.path,
      this.uploadMiddleware.single(options.multerFieldName),
      handleErrors(authenticate(options.userType)),
      handleErrors(handler),
    );
  }
}
