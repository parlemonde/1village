import type { NextFunction, Request, Response } from 'express';

import { UserType } from '../entities/user';
import { Village } from '../entities/village';
import { AppDataSource } from '../utils/data-source';

export async function setVillage(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = req.user;
  let villageId = -1;
  if (user && user.villageId) {
    villageId = user.villageId;
  } else if (user && user.type !== UserType.TEACHER) {
    villageId = req.cookies?.['village-id'] || -1;
  }
  if (villageId !== -1 || (user && user.type !== UserType.TEACHER)) {
    const villages = await AppDataSource.getRepository(Village).find(villageId !== -1 ? { where: { id: villageId } } : { order: { id: 'ASC' } });
    req.village = villages[0];
  }
  if (villageId === -1 && req.village !== undefined) {
    res.cookie('village-id', req.village.id, { httpOnly: false, secure: true, sameSite: 'strict' });
  }
  next();
}
