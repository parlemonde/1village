import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

import { uploadFile } from '../fileUpload';
import { AppError, ErrorCode } from '../middlewares/handleErrors';

export async function uploadFiles(req: Request, res: Response) {
  try {
    // const user = req.user;
    // if (!user) {
    //   throw new AppError('Forbidden', ErrorCode.UNKNOWN);
    // }
    const { files } = req;
    if (!files || !files.length) {
      throw new AppError('Files are missing', ErrorCode.UNKNOWN);
    }
    const userId = 1;
    const promises: Promise<string | null>[] = [];
    for (const file of files as Express.Multer.File[]) {
      // making the filename being the path here is a trick to use
      // upload function...
      const filename = `images/${userId}/${file.filename}`;
      const promise = uploadFile(filename, file.mimetype);
      promises.push(promise);
    }
    const results = await Promise.all(promises);
    res.status(200).json(results);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.errorCode).json(error.message);
    } else {
      res.status(500).json('Internal server error');
    }
  }
}
