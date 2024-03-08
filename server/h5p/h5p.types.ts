import type { IUser } from '@lumieducation/h5p-server';
import type { Request } from 'express';

export type H5pUser = IUser & { csrfToken?: string };

export type H5pExpressRequest = Omit<Request, 'user'> & { user: H5pUser };

export type H5pAnyParams = Record<string, unknown>;
