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

export const statisticsController = new Controller('api/statistics');

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: API pour les statistiques
 */

/**
 * @swagger
 * /statistics/sessions/{phase}:
 *   get:
 *     summary: Récupère les statistiques des sessions pour une phase spécifique
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: phase
 *         schema:
 *           type: integer
 *         required: true
 *         description: Phase pour laquelle récupérer les statistiques
 *     responses:
 *       200:
 *         description: Statistiques des sessions pour la phase spécifiée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 minDuration:
 *                   type: number
 *                 maxDuration:
 *                   type: number
 *                 averageDuration:
 *                   type: number
 *                 medianDuration:
 *                   type: number
 *                 minConnections:
 *                   type: number
 *                 maxConnections:
 *                   type: number
 *                 averageConnections:
 *                   type: number
 *                 medianConnections:
 *                   type: number
 *                 registeredClassroomsCount:
 *                   type: number
 *                 connectedClassroomsCount:
 *                   type: number
 *                 contributedClassroomsCount:
 *                   type: number
 *       400:
 *         description: Paramètre de phase invalide
 *       500:
 *         description: Erreur du serveur
 */
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

/**
 * @swagger
 * /statistics/classrooms:
 *   get:
 *     summary: Récupère les informations des salles de classe
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Informations sur les salles de classe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 classrooms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       village:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *       500:
 *         description: Erreur du serveur
 */
statisticsController.get({ path: '/classrooms' }, async (_req, res) => {
  res.sendJSON({
    classrooms: await getClassroomsInfos(),
  });
});
