import cookieParser from 'cookie-parser';
import type { Response } from 'express';
import express from 'express';
import morgan from 'morgan';
import next from 'next';
import path from 'path';

import { UserType } from './entities/user';
import { handleErrors } from './middlewares/handleErrors';
import { removeTrailingSlash } from './middlewares/trailingSlash';

const frontendHandler = next({ dev: true });
const handle = frontendHandler.getRequestHandler();

export async function getStagingApp() {
  // Prepare frontend routes
  await frontendHandler.prepare();

  // [1] --- Init express ---
  const app = express();
  app.enable('strict routing');
  app.use(removeTrailingSlash);
  app.use(cookieParser());

  // [5] --- Add frontend ---
  app.get('/country-flags/*', express.static(path.join(__dirname, '../../public/country-flags')));
  app.use(express.static(path.join(__dirname, '../../public'))); // app.js is located at ./dist/server and public at ./public

  // Send 404 for static files not found by express static.
  app.get('/static-js/*', (_, res: Response) => {
    res.status(404).send('Error 404 - Not found.');
  });
  app.get('/static-images/*', (_, res: Response) => {
    res.status(404).send('Error 404 - Not found.');
  });

  // NextJS and all pages
  app.get('/_next/*', (req, res) => {
    handle(req, res).catch((e) => console.error(e));
  });
  app.get(
    '*',
    morgan('dev'),
    handleErrors(async (req, res) => {
      const response = await fetch('https://1v-staging.parlemonde.org/', {
        headers: {
          cookie: req.headers['cookie'] || '',
        },
      });
      try {
        const text = await response.text();
        let dataStr = text.slice(text.indexOf('<script id="__NEXT_DATA__" type="application/json">') + 51);
        dataStr = dataStr.slice(0, dataStr.indexOf('</script>'));
        const data = JSON.parse(dataStr);
        if (data.props && data.props.user) {
          req.user = data.props.user;
        }
        if (data.props && data.props.village) {
          req.village = data.props.village;
        }
        if (data.props && data.props.csrfToken) {
          req.csrfToken = data.props.csrfToken;
        }
      } catch (e) {
        console.error(e);
      }
      for (const [header, value] of response.headers.entries()) {
        if (header === 'set-cookie') {
          const [cookieName, cookieValue] = value.split(';')[0].split('=');
          if (cookieName === 'csrf-secret') {
            res.cookie('csrf-secret', cookieValue, {
              expires: new Date(Date.now() + 4 * 60 * 60000),
              httpOnly: true,
              secure: true,
              sameSite: 'strict',
            });
          }
        }
      }

      if (
        req.user === undefined &&
        req.path !== '/' &&
        req.path !== '/inscription' &&
        req.path !== '/connexion' &&
        req.path !== '/login' &&
        req.path !== '/user-verified' &&
        req.path !== '/reset-password' &&
        req.path !== '/update-password'
      ) {
        res.redirect('/');
        return;
      }

      if (
        req.user &&
        (req.path === '/inscription' ||
          req.path === '/connexion' ||
          req.path === '/login' ||
          req.path === '/reset-password' ||
          req.path === '/update-password')
      ) {
        res.redirect('/');
        return;
      }

      if (req.path.slice(1, 6) === 'admin' && (!req.user || req.user.type > UserType.ADMIN)) {
        res.redirect('/');
        return;
      }

      if (req.path.includes('familles') && (!req.user || req.user.type !== UserType.TEACHER)) {
        res.redirect('/');
        return;
      }
      await handle(req, res);
    }),
  );

  // [6] --- Last fallback ---
  app.use(morgan('dev'), (_, res: Response) => {
    res.status(404).send('Error 404 - Not found.');
  });

  return app;
}
