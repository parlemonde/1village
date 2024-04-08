import type { JSONSchemaType } from 'ajv';
import Ajv from 'ajv';

import type { ActivityContent, AnyData } from '../../types/activity.type';

const ajv = new Ajv();
// --- Create an activity ---
type CreateActivityData = {
  type: number;
  subType?: number | null;
  status?: number;
  data: AnyData;
  phase?: number;
  content: ActivityContent[];
  villagesId?: number[];
  responseActivityId?: number;
  responseType?: number;
  isPinned?: boolean;
  displayAsUser?: boolean;
};

// --- create activity's schema ---
const CREATE_SCHEMA: JSONSchemaType<CreateActivityData> = {
  type: 'object',
  properties: {
    type: {
      type: 'number',
    },
    subType: {
      type: 'number',
      nullable: true,
    },
    status: {
      type: 'number',
      nullable: true,
    },
    phase: {
      type: 'number',
      nullable: true,
    },
    data: {
      type: 'object',
      additionalProperties: true,
      nullable: false,
    },
    content: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', nullable: false },
          type: { type: 'string', nullable: false, enum: ['text', 'video', 'image', 'h5p', 'sound'] },
          value: { type: 'string', nullable: false },
        },
        required: ['type', 'value'],
      },
      nullable: false,
    },
    villagesId: { type: 'array', items: { type: 'number' }, nullable: true },
    responseActivityId: { type: 'number', nullable: true },
    responseType: {
      type: 'number',
      nullable: true,
    },
    isPinned: { type: 'boolean', nullable: true },
    displayAsUser: { type: 'boolean', nullable: true },
  },
  required: ['type', 'data', 'content'],
  additionalProperties: false,
};

// --- validate activity's schema ---
export const createActivityValidator = ajv.compile(CREATE_SCHEMA);
