import 'nprogress/nprogress.css';

import 'src/styles/activity-card.scss';
import 'src/styles/activity.scss';
import 'src/styles/admin.scss';
import 'src/styles/base.scss';
import 'src/styles/editor.scss';
import 'src/styles/fonts.scss';
import 'src/styles/globals.scss';
import 'src/styles/login.scss';
import 'src/styles/register.scss';
import 'src/styles/mon-compte.scss';
import 'src/styles/se-presenter.scss';
import 'src/styles/slot-machine.scss';

import type { EmotionCache } from '@emotion/react';
import { CacheProvider } from '@emotion/react';
import axios from 'axios';
import type { Request } from 'express';
import App from 'next/app';
import type { AppProps, AppContext, AppInitialProps } from 'next/app';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import NProgress from 'nprogress';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import { Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Analyser from './admin/villages/Analyser';
import Gerer from './admin/villages/Gerer';
import Mediatheque from './admin/villages/Mediatheque';
import Publier from './admin/villages/Publier';
import Creer from './admin/villages/create/Creer';
import { Header } from 'src/components/Header';
import { WelcomeModal } from 'src/components/WelcomeModal';
import { AdminHeader } from 'src/components/admin/AdminHeader';
import { AdminNavigation } from 'src/components/admin/AdminNavigation';
import { NewAdminHeader } from 'src/components/admin/NewAdminHeader';
import { NewAdminNavigation } from 'src/components/admin/NewAdminNavigation';
import { ActivityContextProvider } from 'src/contexts/activityContext';
import { ClassroomContextProvider } from 'src/contexts/classroomContext';
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
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [currentContent, setCurrentContent] = useState('Créer');

  const changeContent = (content: string) => {
    setCurrentContent(content);
  };

  const renderContent = () => {
    switch (currentContent) {
      case 'Créer':
        return <Creer />;
      case 'Publier':
        return <Publier />;
      case 'Gérer':
        return <Gerer />;
      case 'Analyser':
        return <Analyser />;
      case 'Médiathèque':
        return <Mediatheque />;
      default:
        return <Creer />;
    }
  };

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
  React.useEffect(() => initH5p(csrfToken), [csrfToken]);

  React.useEffect(() => {
    axios.defaults.headers.common['csrf-token'] = csrfToken || '';
  }, [csrfToken]);

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
            <UserContextProvider user={user} setUser={setUser}>
              <VillageContextProvider initialVillage={initialVillage}>
                <ClassroomContextProvider>
                  <ActivityContextProvider>
                    {isOnAdmin ? (
                      router.pathname.startsWith('/admin/villages/new') ? (
                        <div className="container-admin-portal">
                          <NewAdminHeader />
                          <div className="content" style={{ display: 'flex', width: '100%', marginTop: '70px' }}>
                            <NewAdminNavigation changeContent={changeContent} />
                            <Container
                              className="container-admin-nav child-container"
                              sx={{ background: 'white', margin: '0 0 0 50px !important', padding: '50px !important', borderRadius: '10px' }}
                            >
                              {renderContent()}
                            </Container>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <AdminHeader />
                          <div style={{ display: 'flex', width: '100%' }}>
                            <AdminNavigation />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Component {...pageProps} />
                            </div>
                          </div>
                        </div>
                      )
                    ) : user !== null &&
                      router.pathname !== '/inscription' &&
                      router.pathname !== '/connexion' &&
                      router.pathname !== '/login' &&
                      router.pathname !== '/user-verified' &&
                      router.pathname !== '/reset-password' &&
                      router.pathname !== '/update-password' &&
                      router.pathname !== '/404' ? (
                      <div className="app-container">
                        <Header />
                        <Component {...pageProps} />
                        <WelcomeModal />
                      </div>
                    ) : (
                      <Component {...pageProps} />
                    )}
                  </ActivityContextProvider>
                </ClassroomContextProvider>
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
