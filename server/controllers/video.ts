import { getRepository } from 'typeorm';

import { UserType } from '../entities/user';
import { Video } from '../entities/video';
import { deleteVideo, getVideoLink, uploadVideo, getPictureForVideo } from '../fileUpload';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { getQueryString } from '../utils';

import { Controller } from './controller';

const videoController = new Controller('/videos');

videoController.get({ path: '', userType: UserType.TEACHER }, async (req, res) => {
  const videos = await getRepository(Video).find({ where: { userId: req.user?.id ?? 0 } });
  res.sendJSON(videos);
});

videoController.get({ path: '/:videoId/picture', userType: UserType.TEACHER }, async (req, res) => {
  const videoId = parseInt(req.params.videoId, 10) ?? 0;
  const pictures = await getPictureForVideo(videoId);
  res.sendJSON(pictures);
});

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
    if (!req.file) {
      throw new AppError('Video file missing!', ErrorCode.UNKNOWN);
    }
    const url = await uploadVideo(req.file.path, req.body.name, req.user?.id ?? 0);
    res.sendJSON({
      url,
    });
  },
);

// --- Delete a video ---
videoController.delete({ path: '/:videoId', userType: UserType.TEACHER }, async (req, res) => {
  const videoId = parseInt(req.params.videoId, 10) ?? 0;
  const video = await getRepository(Video).findOne({ where: { id: videoId, userId: req.user?.id ?? 0 } });
  if (video !== undefined) {
    const success = await deleteVideo(video.id);
    if (!success) {
      throw new AppError('Erreur', ErrorCode.UNKNOWN);
    }
  }
  res.status(204).send();
});

export { videoController };