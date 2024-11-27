import type { Request } from 'express';

import {
  getClassroomsInfos,
  getConnectedClassroomsCount,
  getContributedClassroomsCount,
  getRegisteredClassroomsCount,
  getChildrenCodesCount as getChildrenCodesCountForClassroom,
  getConnectedFamiliesCount as getConnectedFamiliesCountForClassroom,
  getFamiliesWithoutAccount as getFamiliesWithoutAccountForClassroom,
} from '../stats/classroomStats';
import {
  getAverageConnections,
  getAverageDuration,
  getMaxConnections,
  getMaxDuration,
  getMedianConnections,
  getMedianDuration,
  getMinConnections,
  getMinDuration,
} from '../stats/sessionStats';
import {
  getChildrenCodesCount,
  getFamilyAccountsCount,
  getConnectedFamiliesCount,
  getFamiliesWithoutAccount,
  getFloatingAccounts,
} from '../stats/villageStats';
import { Controller } from './controller';

export const statisticsController = new Controller('/statistics');

statisticsController.get({ path: '/sessions/:phase' }, async (req: Request, res) => {
  const phase = req.params.phase ? parseInt(req.params.phase) : null;

  res.sendJSON({
    minDuration: await getMinDuration(), // TODO - add phase
    maxDuration: await getMaxDuration(), // TODO - add phase
    averageDuration: await getAverageDuration(), // TODO - add phase
    medianDuration: await getMedianDuration(), // TODO - add phase
    minConnections: await getMinConnections(), // TODO - add phase
    maxConnections: await getMaxConnections(), // TODO - add phase
    averageConnections: await getAverageConnections(), // TODO - add phase
    medianConnections: await getMedianConnections(), // TODO - add phase
    registeredClassroomsCount: await getRegisteredClassroomsCount(),
    connectedClassroomsCount: await getConnectedClassroomsCount(), // TODO - add phase
    contributedClassroomsCount: await getContributedClassroomsCount(phase),
  });
});

statisticsController.get({ path: '/classrooms' }, async (_req, res) => {
  res.sendJSON({
    classrooms: await getClassroomsInfos(),
  });
});

statisticsController.get({ path: '/onevillage' }, async (_req, res) => {
  res.sendJSON({
    familyAccountsCount: await getFamilyAccountsCount(),
    childrenCodesCount: await getChildrenCodesCount(),
    connectedFamiliesCount: await getConnectedFamiliesCount(),
    familiesWithoutAccount: await getFamiliesWithoutAccount(),
    floatingAccounts: await getFloatingAccounts(),
  });
});

statisticsController.get({ path: '/villages/:villageId' }, async (_req, res) => {
  const villageId = parseInt(_req.params.villageId);
  const phase = _req.query.phase as unknown as number;
  res.sendJSON({
    familyAccountsCount: await getFamilyAccountsCount(villageId, phase),
    childrenCodesCount: await getChildrenCodesCount(villageId, phase),
    connectedFamiliesCount: await getConnectedFamiliesCount(villageId, phase),
    familiesWithoutAccount: await getFamiliesWithoutAccount(villageId),
    floatingAccounts: await getFloatingAccounts(villageId),
  });
});

statisticsController.get({ path: '/classrooms/:classroomId' }, async (_req, res) => {
  const classroomId = parseInt(_req.params.classroomId);
  const phase = _req.query.phase as unknown as number;
  res.sendJSON({
    childrenCodesCount: await getChildrenCodesCountForClassroom(classroomId, phase),
    connectedFamiliesCount: await getConnectedFamiliesCountForClassroom(classroomId, phase),
    familiesWithoutAccount: await getFamiliesWithoutAccountForClassroom(classroomId),
  });
});
