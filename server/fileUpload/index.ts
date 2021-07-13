import { Readable } from 'stream';

import { AwsS3 } from './s3';
import { VimeoClass } from './vimeo';

const s3 = new AwsS3();
const vimeo = new VimeoClass();

export function getFile(filename: string, range?: string): Readable {
  return s3.getFile(filename, range);
}

export function getFileData(filename: string): Promise<{ AcceptRanges: string; LastModified: Date; ContentLength: number; ContentType: string }> {
  return s3.getFileData(filename);
}

export function uploadFile(filename: string, contentType: string): Promise<string | null> {
  return s3.uploadFile(filename, contentType);
}

export async function deleteFile(key: string): Promise<void> {
  return s3.deleteFile(key);
}

export function getVideoLink(url: string, quality: 'hd' | 'sd'): Promise<string> {
  return vimeo.getDownloadLink(url, quality);
}

export function uploadVideo(filePath: string, name: string, userId: number): Promise<string> {
  return vimeo.uploadVideo(filePath, name, userId);
}

export function deleteVideo(videoId: number): Promise<boolean> {
  return vimeo.deleteVideo(videoId);
}

export function getPictureForVideo(videoId: number): Promise<string> {
  return vimeo.getPictureForVideo(videoId);
}
