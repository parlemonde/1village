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
    minDuration: await getMinDuration(phase),
    maxDuration: await getMaxDuration(phase),
    averageDuration: await getAverageDuration(phase),
    medianDuration: await getMedianDuration(phase),
    minConnections: await getMinConnections(phase),
    maxConnections: await getMaxConnections(phase),
    averageConnections: await getAverageConnections(phase),
    medianConnections: await getMedianConnections(phase),
    registeredClassroomsCount: await getRegisteredClassroomsCount(),
    connectedClassroomsCount: await getConnectedClassroomsCount(phase),
    contributedClassroomsCount: await getContributedClassroomsCount(phase),
  });
});

statisticsController.get({ path: '/classrooms' }, async (_req, res) => {
  res.sendJSON({
    classrooms: await getClassroomsInfos(),
  });
});
