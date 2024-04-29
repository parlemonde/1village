import { Router } from 'express';

import { UserType } from '../../types/user.type';
import { uploadFiles } from '../controllers/filesController';
import { upload } from '../controllers/multer';
import { authenticate } from '../middlewares/authenticate';
import { handleErrors } from '../middlewares/handleErrors';

export const filesRouter = Router();

filesRouter.post(
  '/',
  upload.array('files'),
  // handleErrors(authenticate(UserType.ADMIN)),
  uploadFiles,
);
