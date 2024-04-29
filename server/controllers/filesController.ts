import type { Request, Response } from 'express';
// import { v4 as uuidv4 } from 'uuid';

// import { uploadFile } from '../fileUpload';
import { AppError, ErrorCode } from '../middlewares/handleErrors';

export async function uploadFiles(req: Request, res: Response) {
  // const user = req.user;
  // if (!user) {
  //   throw new AppError('Forbidden', ErrorCode.UNKNOWN);
  // }
  const { files } = req;
  if (!files || !files.length) {
    throw new AppError('Files are missing', ErrorCode.UNKNOWN);
  }
  // console.log(files);
  // const promises: Promise<string | null>[] = [];
  // for (const file of files as Express.Multer.File[]) {
  //   const promise = uploadFile(file.filename, file.mimetype);
  //   promises.push(promise);
  // }
  // const results = await Promise.all(promises);
  // res.status(200).json(results);
  res.status(200).json('results');
}
