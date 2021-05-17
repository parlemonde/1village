import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { UserType } from '../entities/user';
import { Mimique } from '../entities/mimique';
import { MimiqueResponse } from '../entities/mimiqueResponse';
import { Controller } from './controller';

const mimiqueController = new Controller('/mimiques');

mimiqueController.get({ path: '/:id', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const id = parseInt(req.params.id, 10) || 0;
  const mimique = await getRepository(Mimique).findOne({ where: { id } });
  if (!mimique || (req.user.type === UserType.TEACHER && req.user.villageId !== mimique.villageId)) {
    next();
    return;
  }
  res.sendJSON(mimique);
});

mimiqueController.get({ path: '/play', userType: UserType.TEACHER }, async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next();
    return;
  }
  const userId = req.user.id;
  const villageId = req.user.villageId;
  const mimique = await getRepository(Mimique)
    .createQueryBuilder('mimique')
    .leftJoinAndSelect('mimique.responses', 'responses')
    .where('`mimique`.`userId` <> :userId', { userId: userId })
    .andWhere('`mimique`.`villageId` = :villageId', { villageId: villageId })
    .andWhere(
      (qb) => {
        const subQuery = qb
          .subQuery()
          .select()
          .from(MimiqueResponse, 'response')
          .where(`response.userId = :userId`, { userId: userId })
          .andWhere(`response.mimiqueId = mimique.id`)
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      },
      { userId: req.user.id },
    )
    .orderBy('`mimique`.`createDate`', 'DESC')
    .limit(1)
    .getOne();

  res.sendJSON(mimique || []);
});

export { mimiqueController };
