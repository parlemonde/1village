import * as H5P from '@lumieducation/h5p-server';
import InMemoryStorage from '@lumieducation/h5p-server/build/src/implementation/InMemoryStorage';
import DirectoryTemporaryFileStorage from '@lumieducation/h5p-server/build/src/implementation/fs/DirectoryTemporaryFileStorage';
import FileContentStorage from '@lumieducation/h5p-server/build/src/implementation/fs/FileContentStorage';
import * as fs from 'fs-extra';
import path from 'path';

import type { H5pUser } from './h5p.types';
import { AwsLibraryStorage } from './lib/AwsLibraryStorage';

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

  const libraryStorage = new AwsLibraryStorage();
  await libraryStorage.init();
  const h5pEditor = new H5P.H5PEditor(
    new InMemoryStorage(), // TODO
    config,
    libraryStorage,
    new FileContentStorage(path.join(__dirname, '/content')), // TODO // the path on the local disc where content is stored,
    new DirectoryTemporaryFileStorage(path.join(__dirname, '/temporary-storage')), // TODO // the path on the local disc where temporary files (uploads) should be stored
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
