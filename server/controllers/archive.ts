import AWS from 'aws-sdk';
import type { Request, Response, NextFunction } from 'express';

import { UserType } from '../entities/user';
import { streamFile } from '../fileUpload/streamFile';
import { Controller } from './controller';

const archiveController = new Controller('/archives');

// get file
archiveController.get({ path: 'get-file/*', userType: UserType.ADMIN }, async (req: Request, res: Response, next: NextFunction) => {
  const url = decodeURI(req.url);
  const key = `archives${url}${url.split('/').length === 2 ? '/index.html' : url.indexOf('.') === -1 ? '.html' : ''}`;
  try {
    streamFile(key, req, res, next);
  } catch {
    next();
  }
});

/**
 * Liste les dossiers dans un préfixe S3 spécifié.
 * @param prefix - Le préfixe S3 à partir duquel lister les dossiers.
 * @returns Une promesse qui résout avec un tableau de noms de dossiers.
 */
async function listS3Folders(prefix: string): Promise<string[]> {
  // Configurer le client S3 avec les informations d'identification et la région
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: 'eu-west-3',
  });

  // Paramètres pour la requête S3
  const params: AWS.S3.ListObjectsV2Request = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: prefix,
    Delimiter: '/', // Utiliser le délimiteur '/' pour obtenir uniquement les dossiers
  };

  try {
    // Effectuer la requête pour lister les objets
    const data = await s3.listObjectsV2(params).promise();

    if (!data.CommonPrefixes) {
      return [];
    }

    // Extraire les noms de dossiers des préfixes communs
    // Nettoyer les noms de dossiers (supprimer le préfixe et le délimiteur final)
    return data.CommonPrefixes.map((prefixObj) => prefixObj.Prefix)
      .filter((prefix): prefix is string => prefix !== undefined)
      .map((folder) => folder.slice(prefix.length, -1));
  } catch (error) {
    console.error('Error while listing S3 folders:', error);
    throw error;
  }
}

archiveController.get({ path: '', userType: UserType.OBSERVATOR }, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const prefix = 'archives/';
    const archiveFolders = await listS3Folders(prefix);
    res.sendJSON(archiveFolders);
  } catch (error) {
    console.error('Error while listing archived S3 folders:', error);
    next(error);
    return;
  }
});

export { archiveController };
