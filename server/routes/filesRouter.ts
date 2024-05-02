import { Router } from 'express';

import { UserType } from '../../types/user.type';
import { uploadFiles } from '../controllers/filesController';
import { authenticate } from '../middlewares/authenticate';
import { handleErrors } from '../middlewares/handleErrors';
import { fileUplad } from '../middlewares/multer';

export const filesRouter = Router();

filesRouter.post('/', fileUplad.array('files'), handleErrors(authenticate(UserType.ADMIN)), uploadFiles);
