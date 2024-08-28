import type { Request } from 'express';

import {
  getClassroomsInfos,
  getConnectedClassroomsCount,
  getContributedClassroomsCount,
  getRegisteredClassroomsCount,
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
