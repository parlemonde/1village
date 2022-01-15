/* eslint-disable react/display-name */
import createEmotionServer from '@emotion/server/create-instance';
import type { DocumentInitialProps, DocumentContext } from 'next/document';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import * as React from 'react';

import createEmotionCache from 'src/styles/createEmotionCache';
import { primaryColor } from 'src/styles/variables.const';

const APP_URL = process.env.NEXT_PUBLIC_HOST_URL || 'https://1village.parlemonde.org';
const APP_NAME = '1Village';
const APP_DESCRIPTION =
  '1Village est un programme éducatif qui s’adresse aux enfants de classes de primaire et à leurs enseignants ou éducateurs (vous !) partout dans le monde, proposant une expérience numérique de rencontres, d’échanges et de création.';
const PRIMARY_COLOR = primaryColor;

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const originalRenderPage = ctx.renderPage;
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
      });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
    };
  }

  render(): JSX.Element {
    return (
      <Html lang="fr">
        <Head>
          <meta name="application-name" content={APP_NAME} />
          <meta name="description" content={APP_DESCRIPTION} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="msapplication-TileColor" content={PRIMARY_COLOR} />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content={PRIMARY_COLOR} />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color={PRIMARY_COLOR} />
          <link rel="shortcut icon" href="/favicon.ico" />

          <meta name="twitter:card" content={APP_DESCRIPTION} />
          <meta name="twitter:url" content={APP_URL} />
          <meta name="twitter:title" content={APP_NAME} />
          <meta name="twitter:description" content={APP_DESCRIPTION} />
          <meta name="twitter:image" content={`${APP_URL}/1village.png`} />
          <meta name="twitter:creator" content="Par Le Monde" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={APP_NAME} />
          <meta property="og:description" content={APP_DESCRIPTION} />
          <meta property="og:site_name" content={APP_NAME} />
          <meta property="og:url" content={APP_URL} />
          <meta property="og:image" content={`${APP_URL}/1village.png`} />
        </Head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
