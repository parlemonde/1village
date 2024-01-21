import * as H5P from '@lumieducation/h5p-server';
import * as fs from 'fs-extra';
import path from 'path';

import type { H5pUser } from './h5p.types';

export const getH5pEditor = async () => {
  await fs.ensureDir(path.join(__dirname, '/libraries'));
  await fs.ensureDir(path.join(__dirname, '/temporary-storage'));
  await fs.ensureDir(path.join(__dirname, '/content'));

  const config = await new H5P.H5PConfig(
    new H5P.fsImplementations.JsonStorage(
      path.join(__dirname, '../../../h5p-config.json'), // the path on the local disc
      // where the configuration file is stored
    ),
  ).load();

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

  // TODO
  // const permissionSystem = new ExamplePermissionSystem();

  const h5pEditor = H5P.fs(
    config,
    path.join(__dirname, '/libraries'), // the path on the local disc where libraries should be stored
    path.join(__dirname, '/temporary-storage'), // the path on the local disc where temporary files (uploads) should be stored
    path.join(__dirname, '/content'), // the path on the local disc where content is stored,
    undefined,
    undefined,
    undefined,
    urlGenerator,
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
