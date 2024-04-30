import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v4 } from 'uuid';

export const diskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '../fileUpload/videos/'));
  },
  filename: function (_req, file, cb) {
    const uuid = v4();
    cb(null, `${uuid}${path.extname(file.originalname)}`);
  },
});
export const upload = multer({ storage: diskStorage });

export const diskStorageToImages = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dirPath = path.join(__dirname, '../fileUpload/images/');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    cb(null, dirPath);
  },
  filename: function (_req, file, cb) {
    const uuid = v4();
    cb(null, `${uuid}${path.extname(file.originalname)}`);
  },
});

const whitelist = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const fileUplad = multer({
  storage: diskStorageToImages,
  fileFilter: (_req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'));
    }
    cb(null, true);
  },
});
