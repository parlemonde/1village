import { h5pAjaxExpressRouter } from '@lumieducation/h5p-express';
import type { IContentMetadata, IEditorModel } from '@lumieducation/h5p-server';
import { H5pError } from '@lumieducation/h5p-server';
import type { RequestHandler, NextFunction, Request, Response } from 'express';
import express, { Router } from 'express';
import fs from 'fs-extra';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import { v4 } from 'uuid';

import { authenticate } from '../middlewares/authenticate';
import { AppError, handleErrors } from '../middlewares/handleErrors';
import { jsonify } from '../middlewares/jsonify';
import { getH5pEditor } from './get-h5p-editor';
import type { H5pAnyParams, H5pExpressRequest, H5pUser } from './h5p.types';

export const getH5pRouter = async () => {
  const h5pRouter = Router();

  const { h5pPlayer, h5pEditor } = await getH5pEditor();

  // Add logging.
  h5pRouter.use(morgan('dev') as RequestHandler);

  // Add static routes first. No need for authentication here.
  h5pRouter.use('/core', express.static(path.join(__dirname, '../../../public/h5p/core')));
  h5pRouter.use('/editor', express.static(path.join(__dirname, '../../../public/h5p/editor')));

  // Add file upload middleware.
  await fs.ensureDir(path.join(__dirname, '../fileUpload/h5p')).catch();
  const diskStorage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, path.join(__dirname, '../fileUpload/h5p/'));
    },
    filename: function (_req, file, cb) {
      const uuid = v4();
      cb(null, `${uuid}${path.extname(file.originalname)}`);
    },
  });
  h5pRouter.use(
    multer({
      storage: diskStorage,
      limits: {
        fileSize: h5pEditor.config.maxTotalSize,
      },
    }).any(),
  );
  h5pRouter.use(
    handleErrors((req, res, next) => {
      const files = req.files;
      if (files !== undefined && !Array.isArray(files)) {
        throw new AppError('Malformed request', 400);
      }

      const h5pFiles = files?.reduce<
        Record<
          string,
          {
            name: string;
            mimetype: string;
            tempFilePath: string;
            size: number;
          }
        >
      >((acc, file) => {
        acc[file.fieldname] = {
          name: file.filename,
          mimetype: file.mimetype,
          tempFilePath: file.path,
          size: file.size,
        };
        return acc;
      }, {});

      // Needed for h5p-editor to work.
      (req.files as unknown) = h5pFiles;

      // Cleanup files after request.
      if (files) {
        res.on('finish', () => {
          Promise.all(files.map((file) => fs.remove(file.path))).catch();
        });
      }
      next();
    }),
  );

  // Add authentication.
  h5pRouter.use(handleErrors(authenticate()), (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      res.status(403).send('unauthorized');
      return;
    }
    // convert 1village user type to h5p format
    (req as unknown as H5pExpressRequest).user = {
      id: `${user.id}`,
      name: user.pseudo || `${user.firstname} ${user.lastname}`,
      type: 'local',
      email: user.email,
      csrfToken: req.getCsrfToken(),
    };
    next();
  });

  // Add default Ajax routes.
  h5pRouter.use(
    h5pAjaxExpressRouter(
      h5pEditor, // an H5P.H5PEditor object
      path.join(__dirname, '../../../public/h5p/core'), // the path to the h5p core files (of the player)
      path.join(__dirname, '../../../public/h5p/editor'), // the path to the h5p core files (of the editor)
      {
        routeCoreFiles: false, // don't serve static files here
        routeEditorCoreFiles: false,
      },
    ),
  );

  // Add JSON middleware.
  h5pRouter.use(jsonify);

  // Add REST routes
  h5pRouter.get('/_healthcheck', (_req, res) => {
    res.status(200).send('OK');
  });

  h5pRouter.get(
    '/data/:contentId/play',
    handleErrors(async (req, res) => {
      const content = await h5pPlayer.render(req.params.contentId, req.user as unknown as H5pUser, 'fr', {
        // We pass through the contextId here to illustrate how
        // to work with it. Context ids allow you to have
        // multiple user states per content object. They are
        // purely optional. You should *NOT* pass the contextId
        // to the render method if you don't need contextIds!
        contextId: typeof req.query.contextId === 'string' ? req.query.contextId : undefined,
      });
      res.status(200).send(content);
    }),
  );

  h5pRouter.get(
    '/data/:contentId/edit',
    handleErrors(async (req, res, next) => {
      const contentId = req.params.contentId;
      const editorModel = (await h5pEditor.render(
        contentId === 'new' ? (undefined as unknown as string) : contentId,
        'fr',
        req.user as unknown as H5pUser,
      )) as IEditorModel;

      if (contentId === 'new') {
        res.status(200).send(editorModel);
        return;
      }

      let content: {
        h5p: IContentMetadata;
        library: string;
        params: {
          metadata: IContentMetadata;
          params: H5pAnyParams;
        };
      };
      try {
        content = await h5pEditor.getContent(req.params.contentId, req.user as unknown as H5pUser);
      } catch (_err) {
        next();
        return;
      }
      res.status(200).send({
        ...editorModel,
        library: content.library,
        metadata: content.params.metadata,
        params: content.params.params,
      });
    }),
  );

  h5pRouter.get(
    '/data',
    handleErrors(async (req, res) => {
      if (!req.user) {
        res.status(403).send('Unauthorized');
        return;
      }

      let contentObjects;
      try {
        const contentIds = await h5pEditor.contentManager.listContent(undefined);
        contentObjects = await Promise.all(
          contentIds.map(async (id) => ({
            content: await h5pEditor.contentManager.getContentMetadata(id, req.user as unknown as H5pUser),
            id,
          })),
        );
      } catch (error) {
        if (error instanceof H5pError) {
          return res.status(error.httpStatusCode).send(`${error.message}`);
        } else {
          throw error; // will be caught by handleErrors
        }
      }

      res.sendJSON(
        contentObjects.map((o) => ({
          contentId: o.id,
          title: o.content.title,
          mainLibrary: o.content.mainLibrary,
        })),
      );
    }),
  );

  h5pRouter.post(
    '/data',
    handleErrors(async (req, res) => {
      if (!req.body.params || !req.body.params.params || !req.body.params.metadata || !req.body.library || !req.user) {
        res.status(400).send('Malformed request');
        return;
      }
      const { id: contentId, metadata } = await h5pEditor.saveOrUpdateContentReturnMetaData(
        undefined as unknown as string,
        req.body.params.params,
        req.body.params.metadata,
        req.body.library,
        req.user as unknown as H5pUser,
      );
      res.status(200).json({ contentId, metadata });
    }),
  );

  h5pRouter.patch(
    '/data/:contentId',
    handleErrors(async (req, res) => {
      if (!req.body.params || !req.body.params.params || !req.body.params.metadata || !req.body.library || !req.user) {
        res.status(400).send('Malformed request');
        return;
      }
      const { id: contentId, metadata } = await h5pEditor.saveOrUpdateContentReturnMetaData(
        req.params.contentId,
        req.body.params.params,
        req.body.params.metadata,
        req.body.library,
        req.user as unknown as H5pUser,
      );
      res.status(200).sendJSON({ contentId, metadata });
    }),
  );

  h5pRouter.delete(
    '/data/:contentId',
    handleErrors(async (req, res) => {
      try {
        await h5pEditor.deleteContent(req.params.contentId, req.user as unknown as H5pUser);
      } catch (error) {
        console.error(error);
        return res.status(500).send(`Error deleting content with id ${req.params.contentId}`);
      }
      res.status(200).send(`Content ${req.params.contentId} successfully deleted.`);
    }),
  );

  // Add 404 route.
  h5pRouter.use((_req, res) => {
    return res.status(404).send('404, Not found.');
  });

  return h5pRouter;
};
