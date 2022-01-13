import 'nprogress/nprogress.css';

import 'src/styles/activity-card.scss';
import 'src/styles/activity.scss';
import 'src/styles/admin.scss';
import 'src/styles/base.scss';
import 'src/styles/editor.scss';
import 'src/styles/fonts.scss';
import 'src/styles/globals.scss';
import 'src/styles/login.scss';
import 'src/styles/mon-compte.scss';
import 'src/styles/se-presenter.scss';

import type { EmotionCache } from '@emotion/react';
import { CacheProvider } from '@emotion/react';
import type { Request } from 'express';
import App from 'next/app';
import type { AppProps, AppContext, AppInitialProps } from 'next/app';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import NProgress from 'nprogress';
import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { Header } from 'src/components/Header';
import { WelcomeModal } from 'src/components/WelcomeModal/WelcomeModal';
import { AdminHeader } from 'src/components/admin/AdminHeader';
import { AdminNavigation } from 'src/components/admin/AdminNavigation';
import { ActivityContextProvider } from 'src/contexts/activityContext';
import { UserContextProvider } from 'src/contexts/userContext';
import { VillageContextProvider } from 'src/contexts/villageContext';
import { useAnalytics } from 'src/hooks/useAnalytics';
import createEmotionCache from 'src/styles/createEmotionCache';
import theme from 'src/styles/theme';
import { initH5p } from 'src/utils/initH5p';
import type { User } from 'types/user.type';
import type { Village } from 'types/village.type';

interface MyAppOwnProps {
  csrfToken: string | null;
  user: User | null;
  village: Village | null;
}
type MyAppProps = AppProps &
  MyAppOwnProps & {
    emotionCache: EmotionCache;
  };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3600000, // 1 hour
    },
  },
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

NProgress.configure({ showSpinner: false });

const MyApp: React.FunctionComponent<MyAppProps> & {
  getInitialProps(appContext: AppContext): Promise<AppInitialProps>;
} = ({ Component, pageProps, router, user: initialUser, csrfToken, village: initialVillage, emotionCache = clientSideEmotionCache }: MyAppProps) => {
  const [user, setUser] = React.useState<User | null>(initialUser || null);

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
    router.events.on('routeChangeStart', onRouterChangeStart);
    router.events.on('routeChangeComplete', onRouterChangeComplete);
    router.events.on('routeChangeError', onRouterChangeComplete);
    return () => {
      router.events.off('routeChangeStart', onRouterChangeStart);
      router.events.off('routeChangeComplete', onRouterChangeComplete);
      router.events.off('routeChangeError', onRouterChangeComplete);
    };
  }, [router.events]);

  // Let all h5p iframe to automatically resize.
  React.useEffect(initH5p, []);

  const isOnAdmin = router.pathname.slice(1, 6) === 'admin';

  React.useEffect(() => {
    const $body = document.getElementsByTagName('body')[0];
    if (isOnAdmin && $body && !$body.classList.contains('admin')) {
      $body.classList.add('admin');
    }
    if (!isOnAdmin && $body && $body.classList.contains('admin')) {
      $body.classList.remove('admin');
    }
  }, [isOnAdmin]);

  useAnalytics();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title key="app-title">1Village{isOnAdmin ? ' - Admin' : ''}</title>
        <meta key="app-viewport" name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <QueryClientProvider client={queryClient}>
            <UserContextProvider user={user} setUser={setUser} csrfToken={csrfToken || ''}>
              <VillageContextProvider initialVillage={initialVillage}>
                <ActivityContextProvider>
                  {isOnAdmin ? (
                    <div>
                      <AdminHeader />
                      <div style={{ display: 'flex', width: '100%' }}>
                        <AdminNavigation />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Component {...pageProps} />
                        </div>
                      </div>
                    </div>
                  ) : user !== null && router.pathname !== '/login' && router.pathname !== '/404' ? (
                    <div className="app-container">
                      <Header />
                      <Component {...pageProps} />
                      <WelcomeModal />
                    </div>
                  ) : (
                    <Component {...pageProps} />
                  )}
                </ActivityContextProvider>
              </VillageContextProvider>
            </UserContextProvider>
          </QueryClientProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext): Promise<AppInitialProps> => {
  const appProps = await App.getInitialProps(appContext);
  const ctxRequest = (appContext.ctx.req || null) as Request | null;
  const initialData: MyAppOwnProps = {
    user: null,
    csrfToken: '',
    village: null,
  };
  if (ctxRequest === null) {
    // client code
    const data = JSON.parse(window.document.getElementById('__NEXT_DATA__')?.innerText || 'null');
    initialData.csrfToken = data?.props?.csrfToken || null;
    initialData.user = data?.props?.user || null;
    initialData.village = data?.props?.village || null;
  } else {
    // server code
    initialData.csrfToken = ctxRequest.csrfToken || null;
    initialData.user = ctxRequest.user || null;
    initialData.village = ctxRequest.village || null;
  }
  return { ...appProps, ...initialData };
};

export default MyApp;
