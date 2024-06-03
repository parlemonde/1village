import { mixAudio } from 'ffmpeg-audio-mixer';
import fs from 'fs-extra';
import path from 'path';
import { v4 } from 'uuid';

import type { Track } from '../../types/anthem.type';
import { getFile, uploadFile } from '../fileUpload';

type TrackWithFilename = Track & { filename: string };
type JobData = {
  userId: number;
  mixUrlId: string;
  tracks: Track[];
};
const JOBS_QUEUE: JobData[] = [];
let isRunning = false;
const startJob = () => {
  const job = JOBS_QUEUE.shift();
  if (job) {
    buildMix(job.userId, job.mixUrlId, job.tracks).catch(console.error);
  }
};

async function buildMix(userId: number, mixUrlId: string, tracks: Track[]): Promise<void> {
  isRunning = true;
  const dir = path.join(__dirname, '..', '..', '..', '/medias');
  await fs.ensureDir(dir);

  const downloadTracks: TrackWithFilename[] = [];

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
  const outputFilename = `${mixUrlId}.mp3`;

  // [2] mix the tracks
  await mixAudio(
    downloadTracks.map((track) => ({
      inputFile: track.filename || '',
      weight: track.sampleVolume ?? 1,
      delay: Math.floor((track.sampleStartTime || 0) * 1000), // in ms
      trim: track.sampleTrim,
    })),
  ).toFile(path.join(outputDir, outputFilename));

  // [3] send the mix to the storage server
  await uploadFile(`audios/${userId}/${outputFilename}`, 'audio/mpeg');

  // [4] clean up
  for (const track of downloadTracks) {
    if (track.filename) {
      await fs.remove(track.filename);
    }
  }
  fs.remove(path.join(outputDir, outputFilename));

  startJob(); // start the next job
  isRunning = false;
}

export function buildAudioMix(userId: number, tracks: Track[]): string {
  // Generate a unique id for the mix
  const mixUrlId = v4();

  // Build the mix in the background
  JOBS_QUEUE.push({ userId, mixUrlId, tracks });
  if (!isRunning) {
    startJob();
  }

  // Return the url to the mix (will be available once the mix is built)
  return `/api/audios/${userId}/${mixUrlId}.mp3`;
}
