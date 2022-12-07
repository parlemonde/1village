import type { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { UserType } from '../entities/user';
import { Village } from '../entities/village';

export async function setVillage(req: Request, res: Response, next: NextFunction): Promise<void> {
  const user = req.user;
  let villageId = -1;
  if (user && user.villageId) {
    villageId = user.villageId;
  } else if (user && user.type !== UserType.TEACHER) {
    villageId = req.cookies?.['village-id'] || -1;
  }
  req.village =
    villageId === -1 && (!user || user.type === UserType.TEACHER)
      ? undefined
      : await getRepository(Village).findOne(villageId !== -1 ? { where: { id: villageId } } : { order: { id: 'ASC' } });
  if (villageId === -1 && req.village !== undefined) {
    res.cookie('village-id', req.village.id, { httpOnly: false, secure: true, sameSite: 'strict' });
  }
  next();
}
