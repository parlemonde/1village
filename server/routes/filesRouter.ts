import { Router } from 'express';
import multer from 'multer';

import { UserType } from '../../types/user.type';
import { uploadFiles } from '../controllers/filesController';
import { diskStorageToImages } from '../controllers/multer';
import { authenticate } from '../middlewares/authenticate';
import { handleErrors } from '../middlewares/handleErrors';

export const filesRouter = Router();

filesRouter.post('/', multer({ storage: diskStorageToImages }).array('files'), handleErrors(authenticate(UserType.ADMIN)), uploadFiles);
