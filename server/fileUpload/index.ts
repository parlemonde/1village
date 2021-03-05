import { Readable } from 'stream';

import { AwsS3 } from './s3';
import { VimeoClass } from './vimeo';

const s3 = new AwsS3();
const vimeo = new VimeoClass();

export function getImage(filename: string): Readable {
  return s3.getImage(filename);
}

export function uploadImage(filename: string): Promise<string | null> {
  return s3.uploadImage(filename);
}

export async function deleteImage(key: string): Promise<void> {
  return s3.deleteImage(key);
}

export function getVideoLink(url: string, quality: 'hd' | 'sd'): Promise<string> {
  return vimeo.getDownloadLink(url, quality);
}
