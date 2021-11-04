/* eslint-disable no-console */
import { getRepository } from 'typeorm';
import { Vimeo } from 'vimeo';

import { Video } from '../entities/video';
import { logger } from '../utils/logger';

type VimeoVideoLink = {
  quality: 'sd' | 'hd' | 'source';
  width: number;
  link: string;
};

export class VimeoClass {
  private initialized: boolean = false;
  private client: Vimeo;

  constructor() {
    const VIMEO_CLIENT_ID = process.env.VIMEO_CLIENT_ID;
    const VIMEO_SECRET_ID = process.env.VIMEO_SECRET_ID;
    const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN;

    if (!VIMEO_CLIENT_ID || !VIMEO_SECRET_ID || !VIMEO_ACCESS_TOKEN) {
      return;
    }

    this.client = new Vimeo(VIMEO_CLIENT_ID, VIMEO_SECRET_ID, VIMEO_ACCESS_TOKEN);
    this.initialized = true;
  }

  public async getDownloadLink(videoUrl: string, quality: 'sd' | 'hd'): Promise<string> {
    if (!this.initialized) {
      return '';
    }

    const urlSplits = videoUrl.split(/[?#]/)[0].split('/');
    const videoId = parseInt(urlSplits[urlSplits.length - 1], 10);
    if (isNaN(videoId)) {
      return '';
    }

    const url = await new Promise<string>((resolve) => {
      this.client.request(
        {
          method: 'GET',
          path: `/me/videos/${videoId}`,
        },
        (error, body: { download: VimeoVideoLink[] }) => {
          if (error) {
            logger.error(error);
            resolve('');
          } else {
            try {
              let urls = (body.download || []).filter((link) => link.quality === quality);
              if (urls.length === 0) {
                urls = (body.download || []).filter((link) => link.quality === 'source');
              }
              const url = urls.sort((a, b) => a.width - b.width)[0].link;
              resolve(url);
            } catch (_e) {
              resolve('');
            }
          }
        },
      );
    });

    return url;
  }

  public async uploadVideo(path: string, name: string, userId: number): Promise<string> {
    if (!this.initialized) {
      return '';
    }
    // upload video
    const uri = await new Promise<string>((resolve) => {
      this.client.upload(
        path,
        {
          // eslint-disable-next-line camelcase
          content_rating: ['unrated'],
          name,
          privacy: {
            view: 'disable',
            embed: 'whitelist',
            download: true,
            add: true,
            comments: 'nobody',
          },
        },
        (uri) => {
          resolve(uri);
        },
        () => {},
        (error) => {
          logger.error(error);
          resolve('');
        },
      );
    });
    if (!uri) {
      return '';
    }

    // get video id and create video DB entry.
    const splits = uri.split('/');
    const videoID = parseInt(splits[splits.length - 1]);
    if (!isNaN(videoID)) {
      const video = new Video();
      video.id = videoID;
      video.userId = userId;
      video.name = name.slice(0, 64);
      await getRepository(Video).save(video);
    }

    // Put video in 1village folder.
    if (process.env.VIMEO_FOLDER && !isNaN(videoID)) {
      this.client.request(
        {
          method: 'PUT',
          path: `/me/projects/${process.env.VIMEO_FOLDER}/videos/${videoID}`,
        },
        () => {},
      );
    }

    return `https://player.vimeo.com/video/${videoID}`;
  }

  public async deleteVideo(videoId: number): Promise<boolean> {
    if (!this.initialized) {
      return false;
    }
    const success = await new Promise<boolean>((resolve) => {
      this.client.request(
        {
          method: 'DELETE',
          path: `/videos/${videoId}`,
        },
        (error) => {
          if (error) {
            logger.error(error);
            resolve(false);
          } else {
            resolve(true);
          }
        },
      );
    });

    if (success) {
      await getRepository(Video).delete({ id: videoId });
    }

    return success;
  }

  public async getPictureForVideo(videoId: number): Promise<string> {
    if (!this.initialized) {
      return '';
    }
    const picturesRes = await new Promise<string>((resolve) => {
      this.client.request(
        {
          method: 'GET',
          path: '/videos/' + videoId,
        },
        (error, body) => {
          if (error) {
            // eslint-disable-next-line no-console
            console.log('error');
            // eslint-disable-next-line no-console
            console.log(error);
          } else {
            resolve(body.pictures.uri);
          }
        },
      );
    });

    const picture = await new Promise<string>((resolve) => {
      this.client.request(
        {
          method: 'GET',
          path: picturesRes,
        },
        (error, body) => {
          if (error) {
            console.log('error');
            console.log(error);
          } else {
            resolve(body.sizes[2].link);
          }
        },
      );
    });
    return picture;
  }
}
