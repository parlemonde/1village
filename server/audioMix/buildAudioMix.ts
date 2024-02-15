import { mixAudio } from 'ffmpeg-audio-mixer';
import fs from 'fs-extra';
import path from 'path';
import { v4 } from 'uuid';

import { getFile, uploadFile } from '../fileUpload';

export type SimpleTrack = {
  filename?: string;
  sampleUrl: string;
  sampleStartTime: number;
  sampleVolume?: number;
};

export async function buildAudioMix(userId: number, tracks: SimpleTrack[]): Promise<string> {
  const dir = path.join(__dirname, '..', '..', '..', '/medias');
  await fs.ensureDir(dir);

  const downloadTracks: SimpleTrack[] = [];

  // [1] download all tracks
  for (const track of tracks) {
    if (!track.sampleUrl) {
      continue;
    }
    const fileStream = getFile(track.sampleUrl.slice(5)); // remove /api/ prefix
    const filename = path.join(dir, track.sampleUrl.split('/').pop() || '');
    const writeStream = fs.createWriteStream(filename);
    fileStream.pipe(writeStream);
    await new Promise((resolve) => {
      writeStream.on('finish', resolve);
    });
    downloadTracks.push({
      ...track,
      filename,
    });
  }

  const outputDir = path.join(__dirname, '..', 'fileUpload', 'audios', `${userId}`);
  await fs.ensureDir(outputDir);
  const outputFilename = `${v4()}.mp3`;

  // [2] mix the tracks
  await mixAudio(
    downloadTracks.map((track) => ({
      inputFile: track.filename || '',
      weight: track.sampleVolume || 1,
      delay: Math.floor((track.sampleStartTime || 0) * 1000), // in ms
    })),
  ).toFile(path.join(outputDir, outputFilename));

  // [3] send the mix to the storage server
  const mixUrl = await uploadFile(`audios/${userId}/${outputFilename}`, 'audio/mpeg');

  // [4] clean up
  // await fs.remove(dir);
  // await fs.remove(outputDir);

  return mixUrl || '';
}
