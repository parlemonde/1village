import Document, { Html, Head, Main, NextScript } from "next/document";
import React from "react";

const APP_URL = process.env.NEXT_PUBLIC_HOST_URL || "https://1village.parlemonde.org";
const APP_NAME = "1 Village";
const APP_DESCRIPTION = "1 Village, desc...";
const PRIMARY_COLOR = "#4c3ed9";

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="fr">
        <Head>
          <meta name="application-name" content={APP_NAME} />
          {/* <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content={APP_NAME} /> */}
          <meta name="description" content={APP_DESCRIPTION} />
          <meta name="format-detection" content="telephone=no" />
          {/* <meta name="mobile-web-app-capable" content="yes" /> */}
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="msapplication-TileColor" content={PRIMARY_COLOR} />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content={PRIMARY_COLOR} />

          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          {/* <link rel="manifest" href="/manifest.json" /> */}
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color={PRIMARY_COLOR} />
          <link rel="shortcut icon" href="/favicon.ico" />

          <meta name="twitter:card" content={APP_DESCRIPTION} />
          <meta name="twitter:url" content={APP_URL} />
          <meta name="twitter:title" content={APP_NAME} />
          <meta name="twitter:description" content={APP_DESCRIPTION} />
          <meta name="twitter:image" content={`${APP_URL}/android-chrome-192x192.png`} />
          <meta name="twitter:creator" content="Par Le Monde" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={APP_NAME} />
          <meta property="og:description" content={APP_DESCRIPTION} />
          <meta property="og:site_name" content={APP_NAME} />
          <meta property="og:url" content={APP_URL} />
          <meta property="og:image" content={`${APP_URL}/apple-touch-icon.png`} />
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
