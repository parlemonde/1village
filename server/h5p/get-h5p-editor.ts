import * as H5P from '@lumieducation/h5p-server';
import { v4 } from 'uuid';

import { logger } from '../utils/logger';
import type { H5pUser } from './h5p.types';
import { AwsContentStorage } from './lib/AwsContentStorage';
import { AwsContentUserDataStorage } from './lib/AwsContentUserDataStorage';
import { AwsKeyValueStorage } from './lib/AwsKeyValueStorage';
import { AwsLibraryStorage } from './lib/AwsLibraryStorage';
import { AwsTemporaryStorage } from './lib/AwsTemporaryStorage';

const DEFAULT_CONFIG: Partial<H5P.IH5PConfig> = {
  disableFullscreen: false,
  fetchingDisabled: 0,
  uuid: v4(),
  siteType: 'local',
  sendUsageStatistics: false,
  contentHubEnabled: true,
  hubRegistrationEndpoint: 'https://api.h5p.org/v1/sites',
  hubContentTypesEndpoint: 'https://api.h5p.org/v1/content-types/',
  contentUserDataUrl: '/contentUserData',
  contentTypeCacheRefreshInterval: 86400000,
  enableLrsContentTypes: true,
  maxFileSize: 1048576000,
  contentUserStateSaveInterval: 5000,
  maxTotalSize: 1048576000,
  editorAddons: {
    'H5P.CoursePresentation': ['H5P.MathDisplay'],
    'H5P.InteractiveVideo': ['H5P.MathDisplay'],
    'H5P.DragQuestion': ['H5P.MathDisplay'],
  },
};

export const getH5pEditor = async () => {
  const keyValueStorage = new AwsKeyValueStorage();
  await keyValueStorage.init();

  const savedConfigId = await keyValueStorage.load('uuid');
  const config = await new H5P.H5PConfig(keyValueStorage, savedConfigId ? undefined : DEFAULT_CONFIG).load();
  if (savedConfigId === undefined) {
    logger.info('Save H5p config');
    await config.save();
  }

  const urlGenerator = new H5P.UrlGenerator(config, {
    queryParamGenerator: (user: H5pUser) => {
      if (user.csrfToken) {
        return {
          name: '_csrf',
          value: user.csrfToken,
        };
      }
      return {
        name: '',
        value: '',
      };
    },
    protectAjax: true,
    protectContentUserData: true,
    protectSetFinished: true,
  });

  const libraryStorage = new AwsLibraryStorage();
  await libraryStorage.init();

  const contentStorage = new AwsContentStorage();
  await contentStorage.init();

  const temporaryFileStorage = new AwsTemporaryStorage();

  const contentUserDataStorage = new AwsContentUserDataStorage();
  await contentUserDataStorage.init();

  const h5pEditor = new H5P.H5PEditor(
    keyValueStorage,
    config,
    libraryStorage,
    contentStorage,
    temporaryFileStorage,
    undefined,
    urlGenerator,
    {},
    contentUserDataStorage,
  );
  h5pEditor.setRenderer((model) => model);

  const h5pPlayer = new H5P.H5PPlayer(
    h5pEditor.libraryStorage,
    h5pEditor.contentStorage,
    config,
    undefined,
    urlGenerator,
    undefined,
    undefined,
    h5pEditor.contentUserDataStorage,
  );
  h5pPlayer.setRenderer((model) => model);

  return { h5pPlayer, h5pEditor };
};
