import { Request, Response, NextFunction } from 'express';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { UserType } from '../entities/user';
import { getImage, uploadImage } from '../fileUpload';

import { Controller } from './controller';

const imageController = new Controller('/images');

// get image
imageController.get({ path: '/:id/:filename', userType: UserType.TEACHER }, (req: Request, res: Response, next: NextFunction) => {
  const key = `${req.params.id}/${req.params.filename}`;
  getImage(key)
    .on('error', () => {
      next();
    })
    .pipe(res);
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

    // 1- get directory name
    const dir = path.join(__dirname, '../fileUpload/images/');
    await fs.ensureDir(`${dir}/${userId}`).catch();

    // 2- get file name
    const uuid = uuidv4();
    let extension = path.extname(req.file.originalname).substring(1);
    const needReFormat = !['jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension);
    if (needReFormat) {
      extension = 'jpeg';
    }
    const filename = `${userId}/${uuid}.${extension}`;

    // 3- resize image if needed to max width: 1000px.
    const imageProcess = sharp(req.file.buffer).resize(2000, null, {
      withoutEnlargement: true,
    });
    if (needReFormat) {
      imageProcess.toFormat('jpeg');
    }
    await imageProcess.toFile(path.join(dir, filename));
    const url = await uploadImage(filename);
    res.sendJSON({
      url,
    });
  },
);

export { imageController };
