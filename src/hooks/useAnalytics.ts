import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getLCP, getFID, getCLS } from 'web-vitals';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { NavigationPerf, BrowserPerf, EventName } from 'types/analytics.type';

interface EventOptions {
  isInitial?: boolean;
  duration?: number;
  perf?: NavigationPerf | BrowserPerf;
}

const sessionId = uuidv4();
const startTime = new Date().getTime();

export const useAnalytics = (): void => {
  const router = useRouter();
  const [location, setLocation] = React.useState<Location | null>(null);
  const [document, setDocument] = React.useState<Document | null>(null);
  const lastPage = React.useRef<string>('');
  const clsIsSent = React.useRef(false); // only send cls one time per page.

  // Get location and document object in effect only to avoid server side errors, effects will run only in the browser.
  React.useEffect(() => {
    setLocation(window.location);
    setDocument(window.document);
  }, []);

  const trigger = React.useCallback(
    (eventName: EventName, options?: EventOptions): void => {
      if (location === null || document === null) {
        return;
      }
      // if (/^localhost$|^127(?:\.[0-9]+){0,2}\.[0-9]+$|^(?:0*:)*?:?0*1$/.test(location.hostname) || location.protocol === 'file:') {
      //   return;
      // }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (window.phantom || window._phantom || window.__nightmare || window.navigator.webdriver || window.Cypress) {
        return;
      }

      let referrer = null;
      if (document.referrer) {
        try {
          const refUrl = new URL(document.referrer);
          if (refUrl.hostname !== location.hostname) {
            referrer = document.referrer;
          }
        } catch (e) {
          // nothing
        }
      }

      const data = {
        event: eventName,
        sessionId,
        location: location.pathname,
        referrer,
        width: window.innerWidth,
        params: options && Object.keys(options).length > 0 ? options : null,
      };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json; charset=UTF-8' }); // the blob
      try {
        navigator.sendBeacon(`${process.env.NEXT_PUBLIC_BASE_APP}/analytics`, blob);
      } catch (err) {
        console.error(err);
        axiosRequest({
          method: 'POST',
          url: '/analytics',
          data,
        }).catch(console.error);
      }
    },
    [location, document],
  );

  const page = React.useCallback(() => {
    if (location === null) {
      return;
    }
    trigger('pageview', { isInitial: lastPage.current.length === 0 });
    lastPage.current = location.pathname;
    clsIsSent.current = false;
  }, [trigger, location]);

  const handleUnload = React.useCallback(() => {
    if (document && document.visibilityState === 'hidden') {
      const duration = Math.round((new Date().getTime() - startTime) / 1000); // duration in seconds.
      trigger('session', {
        isInitial: false,
        duration,
      });
    }
  }, [trigger, document]);

  const handlePerformance = React.useCallback(() => {
    try {
      const navigationEntries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      let perf: NavigationPerf;
      if (navigationEntries !== undefined) {
        perf = {
          totalTime: navigationEntries.responseEnd - navigationEntries.requestStart,
          fetchTime: navigationEntries.responseEnd - navigationEntries.fetchStart,
          latency: navigationEntries.responseStart - navigationEntries.fetchStart,
          timeToFirstByte: navigationEntries.responseStart - navigationEntries.requestStart,
          redirectTime: navigationEntries.redirectEnd - navigationEntries.redirectStart,
          dnsTime: navigationEntries.domainLookupEnd - navigationEntries.domainLookupStart,
          pageLoadTime: navigationEntries.loadEventStart - navigationEntries.startTime,
          domInteractiveTime: navigationEntries.domInteractive - navigationEntries.startTime,
          domInteractiveToComplete: navigationEntries.domComplete - navigationEntries.domInteractive,
          onload: navigationEntries.domContentLoadedEventEnd - navigationEntries.domContentLoadedEventStart,
          firstPaint: 0,
          firstContentfulPaint: 0,
        };
      } else {
        const timing = performance.timing;
        perf = {
          totalTime: timing.responseEnd - timing.requestStart,
          fetchTime: timing.responseEnd - timing.fetchStart,
          latency: timing.responseStart - timing.fetchStart,
          timeToFirstByte: timing.responseStart - timing.requestStart,
          redirectTime: timing.redirectEnd - timing.redirectStart,
          dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
          pageLoadTime: timing.loadEventStart - timing.navigationStart,
          domInteractiveTime: timing.domInteractive - timing.navigationStart,
          domInteractiveToComplete: timing.domComplete - timing.domInteractive,
          onload: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
          firstPaint: 0,
          firstContentfulPaint: 0,
        };
      }
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((paintMetric) => {
        if (paintMetric.name === 'first-paint') {
          perf.firstPaint = paintMetric.startTime;
        } else if (paintMetric.name === 'first-contentful-paint') {
          perf.firstContentfulPaint = paintMetric.startTime;
        }
      });
      trigger('navigation-stats', { perf });
      getLCP((metric) => {
        trigger('perf-stats', { perf: { lcp: metric.value } });
      });
      getFID((metric) => {
        trigger('perf-stats', { perf: { fid: metric.value } });
      });
      getCLS((metric) => {
        if (clsIsSent.current) {
          return;
        }
        clsIsSent.current = true;
        trigger('perf-stats', { perf: { cls: metric.value } });
      });
    } catch (e) {
      console.error(e);
    }
  }, [trigger]);

  // send session duration before exiting.
  React.useEffect(() => {
    if (document) {
      document.addEventListener('visibilitychange', handleUnload);
      return () => {
        document.removeEventListener('visibilitychange', handleUnload);
      };
    } else {
      return () => {};
    }
  }, [handleUnload, document]);

  // send page events when route change.
  React.useEffect(() => {
    router.events.on('routeChangeComplete', page);
    return () => {
      router.events.off('routeChangeComplete', page);
    };
  }, [router.events, page]);

  // page on render and send load performance.
  const perfTimeout = React.useRef<number | undefined>(undefined);
  React.useEffect(() => {
    if (document !== null && location !== null) {
      page();
      if (perfTimeout.current) {
        window.clearTimeout(perfTimeout.current);
      }
      perfTimeout.current = window.setTimeout(() => {
        handlePerformance();
      }, 5000);
    }
  }, [document, location, page, handlePerformance]);
};
