import { UserType } from '../entities/user';
import { getVideoLink } from '../fileUpload';
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

export { videoController };
