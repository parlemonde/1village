import "nprogress/nprogress.css";

import "src/styles/base.scss";
import "src/styles/fonts.scss";
import "src/styles/globals.scss";
import "src/styles/login.scss";

import App from "next/app";
import type { AppProps, AppContext, AppInitialProps } from "next/app";
import Head from "next/head";
import NProgress from "nprogress";
import { ReactQueryDevtools } from "react-query-devtools";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import React from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import { UserServiceProvider } from "src/contexts/userContext";
import theme from "src/styles/theme";
import type { User } from "types/user.type";

interface MyAppOwnProps {
  csrfToken: string | null;
  user: User | null;
}
type MyAppProps = AppProps & MyAppOwnProps;

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      staleTime: 3600000, // 1 hour
    },
  },
});

NProgress.configure({ showSpinner: false });

const MyApp: React.FunctionComponent<MyAppProps> & {
  getInitialProps(appContext: AppContext): Promise<AppInitialProps>;
} = ({ Component, pageProps, router, user, csrfToken }: MyAppProps) => {
  const onRouterChangeStart = (): void => {
    NProgress.start();
  };
  const onRouterChangeComplete = (): void => {
    setTimeout(() => {
      NProgress.done();
    }, 200);
  };
  React.useEffect(() => {
    // get current route
    router.events.on("routeChangeStart", onRouterChangeStart);
    router.events.on("routeChangeComplete", onRouterChangeComplete);
    router.events.on("routeChangeError", onRouterChangeComplete);
    return () => {
      router.events.off("routeChangeStart", onRouterChangeStart);
      router.events.off("routeChangeComplete", onRouterChangeComplete);
      router.events.off("routeChangeError", onRouterChangeComplete);
    };
  }, [router.events]);

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>1Village</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReactQueryCacheProvider queryCache={queryCache}>
          <UserServiceProvider user={user} csrfToken={csrfToken}>
            <Component {...pageProps} />
          </UserServiceProvider>
          {/* Dev only, it won't appear after build for prod. */}
          <ReactQueryDevtools />
        </ReactQueryCacheProvider>
      </ThemeProvider>
    </>
  );
};

MyApp.getInitialProps = async (appContext: AppContext): Promise<AppInitialProps & MyAppOwnProps> => {
  const appProps = await App.getInitialProps(appContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctxRequest: any = appContext.ctx.req || null;
  const initialData: MyAppOwnProps = {
    user: null,
    csrfToken: "",
  };
  if (ctxRequest === null) {
    // client code
    const initialData = JSON.parse(window.document.getElementById("__NEXT_DATA__")?.innerText);
    initialData.csrfToken = initialData?.props?.csrfToken || null;
    initialData.user = initialData?.props?.user || null;
  } else {
    // server code
    initialData.csrfToken = ctxRequest?.csrfToken || null;
    initialData.user = ctxRequest?.user || null;
  }
  return { ...appProps, ...initialData };
};

export default MyApp;
