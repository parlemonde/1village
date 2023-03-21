import type { Request, Response, NextFunction } from 'express';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { UserType } from '../entities/user';
import { deleteFile, uploadFile } from '../fileUpload';
import { streamFile } from '../fileUpload/streamFile';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { Controller } from './controller';

const imageController = new Controller('/images');

// get image
imageController.get({ path: '/:id/:filename' }, async (req: Request, res: Response, next: NextFunction) => {
  const key = `images/${req.params.id}/${req.params.filename}`;
  streamFile(key, req, res, next);
});

// post image
imageController.upload(
  {
    path: '',
    userType: UserType.TEACHER,
    multerFieldName: 'image',
  },
  async (req: Request, res: Response) => {
    const userId = req.user?.id ?? 0;

    if (!req.file) {
      throw new AppError('Image file missing!', ErrorCode.UNKNOWN);
    }

    // 1- get directory name
    const dir = path.join(__dirname, '../fileUpload');
    await fs.ensureDir(`${dir}/images/${userId}`).catch();

    // 2- get file name
    const uuid = uuidv4();
    let extension = path.extname(req.file.originalname).substring(1);
    const needReFormat = !['jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension);
    if (needReFormat) {
      extension = 'jpeg';
    }
    const filename = `images/${userId}/${uuid}.${extension}`;

    // 3- resize image if needed to max width: 1000px.
    // Use `.rotate()` to keep original image orientation metadata.
    const imageProcess = sharp(req.file.buffer).rotate().resize(1000, null, {
      withoutEnlargement: true,
    });
    if (needReFormat) {
      imageProcess.toFormat('jpeg');
    }
    await imageProcess.toFile(path.join(dir, filename));
    const url = await uploadFile(filename, needReFormat ? 'image/jpeg' : req.file.mimetype);
    res.sendJSON({
      url,
    });
  },
);

// delete image
imageController.delete({ path: '/:id/:filename', userType: UserType.TEACHER }, async (req, res) => {
  if (req.user?.id !== parseInt(req.params.id, 10)) {
    res.status(204).send();
    return;
  }
  const key = `images/${req.params.id}/${req.params.filename}`;
  await deleteFile(key);
  res.status(204).send();
});

export { imageController };
