import type { JSONSchemaType } from 'ajv';
import type { Request, Response, NextFunction } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import type { Track } from '../../types/anthem.type';
import { buildAudioMix } from '../audioMix/buildAudioMix';
import { UserType } from '../entities/user';
import { deleteFile, uploadFile } from '../fileUpload';
import { streamFile } from '../fileUpload/streamFile';
import { AppError, ErrorCode } from '../middlewares/handleErrors';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { logger } from '../utils/logger';
import { Controller } from './controller';

const audioController = new Controller('/audios');

// get audio
audioController.get({ path: '/:id/:filename', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const key = `audios/${req.params.id}/${req.params.filename}`;
  streamFile(key, req, res, next);
});

audioController.head({ path: '/:id/:filename', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  const key = `audios/${req.params.id}/${req.params.filename}`;
  streamFile(key, req, res, next);
});

// post audio
audioController.upload(
  {
    path: '',
    userType: UserType.TEACHER,
    multerFieldName: 'audio',
  },
  async (req: Request, res: Response) => {
    const userId = req.user?.id ?? 0;

    if (!req.file) {
      throw new AppError('Audio file missing!', ErrorCode.UNKNOWN);
    }

    // 1- get directory name
    const dir = path.join(__dirname, '../fileUpload');
    await fs.ensureDir(`${dir}/audios/${userId}`).catch();

    // 2- get file name
    const uuid = uuidv4();

    const extension = path.extname(req.file.originalname).substring(1);
    // todo: check extension or return.
    logger.info(`Extension: ${extension}`);
    logger.info(`content type: ${req.file.mimetype}`);

    const filename = `audios/${userId}/${uuid}.${extension}`;
    await fs.writeFile(path.join(dir, filename), req.file.buffer);
    const url = await uploadFile(filename, req.file.mimetype);
    res.sendJSON({
      url,
    });
  },
);

// delete audio
audioController.delete({ path: '/:id/:filename', userType: UserType.TEACHER }, async (req, res) => {
  if (req.user?.id !== parseInt(req.params.id, 10)) {
    res.status(204).send();
    return;
  }
  const key = `audios/${req.params.id}/${req.params.filename}`;
  await deleteFile(key);
  res.status(204).send();
});

type NewAudioMix = {
  tracks: Track[];
};
const NEW_AUDIO_SCHEMA: JSONSchemaType<NewAudioMix> = {
  type: 'object',
  properties: {
    tracks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'number',
          },
          label: { type: 'string' },
          sampleUrl: { type: 'string' },
          sampleDuration: { type: 'number' },
          sampleStartTime: { type: 'number' },
          sampleVolume: { type: 'number', nullable: true },
          sampleTrim: {
            type: 'object',
            properties: {
              start: { type: 'number', nullable: true },
              end: { type: 'number', nullable: true },
            },
            nullable: true,
          },
          iconUrl: { type: 'string' },
        },
        required: ['type', 'label', 'sampleUrl', 'sampleDuration', 'sampleStartTime', 'iconUrl'],
      },
    },
  },
  required: ['tracks'],
  additionalProperties: false,
};

const updateActivityValidator = ajv.compile(NEW_AUDIO_SCHEMA);
audioController.post({ path: '/mix', userType: UserType.TEACHER }, async (req, res) => {
  const data: unknown = req.body;
  if (!updateActivityValidator(data)) {
    sendInvalidDataError(updateActivityValidator);
    return;
  }
  res.sendJSON({
    url: buildAudioMix(req.user?.id || 0, data.tracks) || '', // do not wait for the build.
  });
});

export { audioController };
