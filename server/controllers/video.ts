import { UserType } from '../entities/user';
import { getVideoLink, uploadVideo } from '../fileUpload';
import { getQueryString } from '../utils';

import { Controller } from './controller';

const videoController = new Controller('/videos');

videoController.get({ path: '/download', userType: UserType.TEACHER }, async (req, res, next) => {
  const videoUrl = getQueryString(req.query.videoUrl) || '';
  let quality = getQueryString(req.query.quality);
  if (quality !== 'sd' && quality !== 'hd') {
    quality = 'hd';
  }
  if (!videoUrl) {
    next();
    return;
  }
  const downloadLink = await getVideoLink(videoUrl, quality as 'sd' | 'hd');
  if (downloadLink) {
    res.sendJSON({ link: downloadLink });
  } else {
    next();
  }
});

// post video
videoController.upload(
  {
    path: '',
    userType: UserType.TEACHER,
    multerFieldName: 'video',
    saveOnDisk: true,
  },
  async (req, res) => {
    const url = await uploadVideo(req.file.path, req.body.name, req.user?.id ?? 0);
    res.sendJSON({
      url,
    });
  },
);

export { videoController };
