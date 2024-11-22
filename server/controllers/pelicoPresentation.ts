import type { JSONSchemaType } from 'ajv';
import type { NextFunction, Request, Response } from 'express';

import type { ActivityContent } from '../../types/activity.type';
import { PelicoPresentation } from '../entities/pelicoPresentation';
import { UserType } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { ajv, sendInvalidDataError } from '../utils/jsonSchemaValidator';
import { Controller } from './controller';

const pelicoController = new Controller('/pelico-presentation'); // Défini le préfixe de route

// --- Récupérer toutes les présentations Pelico ---
pelicoController.get({ path: '', userType: UserType.OBSERVATOR }, async (_req: Request, res: Response) => {
  const presentations = await AppDataSource.getRepository(PelicoPresentation).find();
  res.sendJSON(presentations);
});

// --- Récupérer une présentation Pelico ---
pelicoController.get({ path: '/:id', userType: UserType.OBSERVATOR }, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10) || 1;
  const presentation = await AppDataSource.getRepository(PelicoPresentation).findOne({ where: { id } });
  res.sendJSON(presentation);
});

// --- Créer une présentation Pelico ---
type CreatePelicoData = {
  content: ActivityContent[];
};
const CREATE_SCHEMA: JSONSchemaType<CreatePelicoData> = {
  type: 'object',
  properties: {
    content: {
      type: 'array',
      game: null,
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', nullable: false },
          type: { type: 'string', nullable: false, enum: ['text', 'video', 'image', 'h5p', 'sound', 'document'] },
          value: { type: 'string', nullable: false },
        },
        required: ['type', 'value'],
      },
      nullable: false,
    },
  },
  required: ['content'],
  additionalProperties: false,
};
const createValidator = ajv.compile(CREATE_SCHEMA);
pelicoController.post({ path: '', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const data = req.body;
  if (!createValidator(data)) {
    sendInvalidDataError(createValidator);
    return;
  }
  const presentation = new PelicoPresentation();
  presentation.content = data.content;
  await AppDataSource.getRepository(PelicoPresentation).save(presentation);
  res.sendJSON(presentation);
});

// --- Mettre à jour une présentation Pelico ---
type UpdatePelicoData = {
  content?: ActivityContent[];
};
const UPDATE_SCHEMA: JSONSchemaType<UpdatePelicoData> = {
  type: 'object',
  properties: {
    content: {
      type: 'array',
      game: null,
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', nullable: false },
          type: { type: 'string', nullable: false, enum: ['text', 'video', 'image', 'h5p', 'sound', 'document'] },
          value: { type: 'string', nullable: false },
        },
        required: ['type', 'value'],
      },
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
};
const updateValidator = ajv.compile(UPDATE_SCHEMA);
pelicoController.put({ path: '/:id', userType: UserType.ADMIN }, async (req: Request, res: Response, next: NextFunction) => {
  const data = req.body;
  if (!updateValidator(data)) {
    sendInvalidDataError(updateValidator);
    return;
  }
  const id = parseInt(req.params.id, 10) || 0;
  const presentation = await AppDataSource.getRepository(PelicoPresentation).findOne({ where: { id } });
  if (!presentation) {
    next();
    return;
  }

  presentation.content = data.content || presentation.content;

  await AppDataSource.getRepository(PelicoPresentation).save(presentation);
  res.sendJSON(presentation);
});

// --- Supprimer une présentation Pelico ---
pelicoController.delete({ path: '/:id', userType: UserType.ADMIN }, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10) || 0;
  await AppDataSource.getRepository(PelicoPresentation).delete({ id });
  res.status(204).send();
});

export { pelicoController };
