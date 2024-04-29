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
