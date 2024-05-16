import type { Request, Response, NextFunction } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { UserType } from '../../types/user.type';
import { deleteFile, uploadFile } from '../fileUpload';
import { streamFile } from '../fileUpload/streamFile';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { logger } from '../utils/logger';
import { Controller } from './controller';

const audioController = new Controller('/audios');

// get audio
audioController.get({ path: '/:id/:filename', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const key = `audios/${req.params.id}/${req.params.filename}`;
  streamFile(key, req, res, next);
});

// post audio
audioController.upload(
  {
    path: '',
    userType: UserType.TEACHER,
    multerFieldName: 'audio',
  },
  async (req: Request, res: Response) => {
    const userId = req.user?.id ?? 0;

    if (!req.file) {
      throw new AppError('Audio file missing!', ErrorCode.UNKNOWN);
    }

    // 1- get directory name
    const dir = path.join(__dirname, '../fileUpload');
    await fs.ensureDir(`${dir}/audios/${userId}`).catch();

    // 2- get file name
    const uuid = uuidv4();

    const extension = path.extname(req.file.originalname).substring(1);
    // todo: check extension or return.
    logger.info(`Extension: ${extension}`);
    logger.info(`content type: ${req.file.mimetype}`);

    const filename = `audios/${userId}/${uuid}.${extension}`;
    await fs.writeFile(path.join(dir, filename), req.file.buffer);
    const url = await uploadFile(filename, req.file.mimetype);
    res.sendJSON({
      url,
    });
  },
);

// delete audio
audioController.delete({ path: '/:id/:filename', userType: UserType.TEACHER }, async (req, res) => {
  if (req.user?.id !== parseInt(req.params.id, 10)) {
    res.status(204).send();
    return;
  }
  const key = `audios/${req.params.id}/${req.params.filename}`;
  await deleteFile(key);
  res.status(204).send();
});

export { audioController };
