import { Vimeo } from 'vimeo';

import { logger } from '../utils/logger';

type VimeoVideoLink = {
  quality: 'sd' | 'hd';
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
              const url = (body.download || []).filter((link) => link.quality === quality).sort((a, b) => a.width - b.width)[0].link;
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
}
