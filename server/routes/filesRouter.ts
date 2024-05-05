import { Router } from 'express';

import { UserType } from '../../types/user.type';
import { uploadFiles } from '../controllers/filesController';
import { fileUplad } from '../controllers/multer';
import { authenticate } from '../middlewares/authenticate';
import { handleErrors } from '../middlewares/handleErrors';

export const filesRouter = Router();

filesRouter.post('/', fileUplad.array('files'), handleErrors(authenticate(UserType.ADMIN)), uploadFiles);
