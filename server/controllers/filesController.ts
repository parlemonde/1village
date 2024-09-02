import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';

import { uploadFile } from '../fileUpload';
import { AppError, ErrorCode } from '../middlewares/handleErrors';

export async function uploadFiles(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError('Forbidden', ErrorCode.UNKNOWN);
    }
    const { files } = req;
    if (!files || !files.length) {
      throw new AppError('Files are missing', ErrorCode.UNKNOWN);
    }
    const promises: Promise<string | null>[] = [];

    const folderPath = path.join(__dirname, `../fileUpload/images/${user.id}`);
    fs.mkdirSync(folderPath, { recursive: true });
    for (const file of files as Express.Multer.File[]) {
      // making the filename being the path here is a trick to use
      // upload function...
      const ext = file.originalname.split('.').pop();
      const filename = `${v4()}.${ext}`;
      fs.writeFileSync(`${folderPath}/${filename}`, file.buffer);
      const promise = uploadFile(`images/${user.id}/${filename}`, file.mimetype);
      promises.push(promise);
    }
    const results = await Promise.all(promises);
    fs.rmSync(folderPath, { recursive: true, force: true });
    res.status(200).json(results);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(400).json(error.message);
    } else {
      res.status(500).json('Internal server error');
    }
  }
}
