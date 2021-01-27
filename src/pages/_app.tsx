import "nprogress/nprogress.css";

import "src/styles/admin.scss";
import "src/styles/base.scss";
import "src/styles/fonts.scss";
import "src/styles/globals.scss";
import "src/styles/login.scss";
import "src/styles/mon-compte.scss";

import App from "next/app";
import type { AppProps, AppContext, AppInitialProps } from "next/app";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import NProgress from "nprogress";
import { ReactQueryDevtools } from "react-query-devtools";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import React from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import { Header } from "src/components/Header";
import { Navigation } from "src/components/Navigation";
import { AdminHeader } from "src/components/admin/AdminHeader";
import { AdminNavigation } from "src/components/admin/AdminNavigation";
import { ActivityContextProvider } from "src/contexts/activityContext";
import { UserContextProvider } from "src/contexts/userContext";
import { VillageContextProvider } from "src/contexts/villageContext";
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
} = ({ Component, pageProps, router, user: initialUser, csrfToken }: MyAppProps) => {
  const [user, setUser] = React.useState<User | null>(initialUser);

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

  const isOnAdmin = router.pathname.slice(1, 6) === "admin";

  React.useEffect(() => {
    const $body = document.getElementsByTagName("body")[0];
    if (isOnAdmin && $body && !$body.classList.contains("admin")) {
      $body.classList.add("admin");
    }
    if (!isOnAdmin && $body && $body.classList.contains("admin")) {
      $body.classList.remove("admin");
    }
  }, [isOnAdmin]);

  return (
    <>
      <Head>
        <title key="app-title">1Village{isOnAdmin ? " - Admin" : ""}</title>
        <meta key="app-viewport" name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <ReactQueryCacheProvider queryCache={queryCache}>
            <UserContextProvider user={user} setUser={setUser} csrfToken={csrfToken}>
              {isOnAdmin ? (
                <div>
                  <AdminHeader />
                  <div style={{ display: "flex", width: "100%" }}>
                    <AdminNavigation />
                    <div style={{ flex: 1 }}>
                      <Component {...pageProps} />
                    </div>
                  </div>
                </div>
              ) : user !== null && router.pathname !== "/login" && router.pathname !== "/404" ? (
                <VillageContextProvider>
                  <ActivityContextProvider>
                    <div className="app-container">
                      <Header />
                      <Navigation />
                      <Component {...pageProps} />
                    </div>
                  </ActivityContextProvider>
                </VillageContextProvider>
              ) : (
                <Component {...pageProps} />
              )}
            </UserContextProvider>
            {/* Dev only, it won't appear after build for prod. */}
            <ReactQueryDevtools />
          </ReactQueryCacheProvider>
        </SnackbarProvider>
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
    const data = JSON.parse(window.document.getElementById("__NEXT_DATA__")?.innerText);
    initialData.csrfToken = data?.props?.csrfToken || null;
    initialData.user = data?.props?.user || null;
  } else {
    // server code
    initialData.csrfToken = ctxRequest?.csrfToken || null;
    initialData.user = ctxRequest?.user || null;
  }
  return { ...appProps, ...initialData };
};

export default MyApp;
