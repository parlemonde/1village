/* eslint-disable camelcase */
import axios from 'axios';

import { User } from '../entities/user';
import { AppDataSource } from '../utils/data-source';
import { logger } from '../utils/logger';
import type { PlmClassroom } from './classroom';
import { createClassroom } from './classroom';
import type { PLM_User } from './user';
import { createPLMUserToDB } from './user';
import { createVillages } from './village';
import type { PLM_Village } from './village';

const plmSsoUrl = process.env.PLM_HOST || '';
const client_id = process.env.CLIENT_ID || '';
const client_secret = process.env.CLIENT_SECRET || '';

export async function getUserFromPLM(code: string): Promise<User | null> {
  try {
    const ssoResponse = await axios({
      method: 'POST',
      url: `${plmSsoUrl}/oauth/token`,
      data: {
        grant_type: 'authorization_code',
        client_id,
        client_secret,
        redirect_uri: `${process.env.HOST_URL}/login`,
        code,
      },
    });
    const { access_token } = ssoResponse.data as { access_token: string };
    const userResponse = await axios({
      method: 'GET',
      url: `${plmSsoUrl}/oauth/me/?access_token=${access_token}`,
    });
    const plmUser = userResponse.data as PLM_User;
    let user = await AppDataSource.getRepository(User).findOne({
      where: { email: plmUser.email },
    });
    if (user === null) {
      user = await createPLMUserToDB(plmUser);
    }
    return user;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export async function createVillagesFromPLM(): Promise<number | null> {
  try {
    const villageRequest = await axios({
      method: 'GET',
      url: `${plmSsoUrl}/wp-json/api/v1/villages?client_id=${client_id}&client_secret=${client_secret}`,
    });
    const villages = villageRequest.data as PLM_Village[];
    return await createVillages(villages);
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export async function createClassroomsFromPLM(): Promise<number | null> {
  try {
    const result = await axios({
      method: 'GET',
      url: `${plmSsoUrl}/wp-json/api/v1/registered-classrooms?client_id=${client_id}&client_secret=${client_secret}`,
    });

    const registeredClassrooms: PlmClassroom[] = result.data;

    return await createClassroom(registeredClassrooms);
  } catch (error) {
    logger.error(error);
    return null;
  }
}
