import { Router } from 'express';

import { UserType } from '../../types/user.type';
import { uploadFiles } from '../controllers/filesController';
import { authenticate } from '../middlewares/authenticate';
import { handleErrors } from '../middlewares/handleErrors';
import { fileUpladInMemory } from '../middlewares/multer';

export const filesRouter = Router();
filesRouter.post('/', fileUpladInMemory.array('files'), handleErrors(authenticate(UserType.OBSERVATOR)), uploadFiles);
