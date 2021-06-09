// ----- Row analytics -----
export interface NavigationPerf {
  totalTime: number;
  fetchTime: number;
  latency: number;
  timeToFirstByte: number;
  redirectTime: number;
  dnsTime: number;
  pageLoadTime: number;
  domInteractiveTime: number;
  domInteractiveToComplete: number;
  onload: number;
  firstPaint: number;
  firstContentfulPaint: number;
}

export interface BrowserPerf {
  lcp?: number;
  fid?: number;
  cls?: number;
}

export type EventName = 'pageview' | 'navigation-stats' | 'perf-stats' | 'session';

// ----- Saved analytics -----
export interface AnalyticSession {
  id: string;
  uniqueId: string;
  type: string; // 'desktop' | 'tablet' | 'mobile' | 'other'
  os: string;
  browserName: string;
  browserVersion: string;
  width: number;
  initialPage: string;
  duration: number | null;
}

export interface AnalyticPageView {
  id: number;
  sessionId: string;
  date: Date;
  page: string;
  referrer: string | null;
}

export interface AnalyticPerformance {
  id: number;
  sessionId: string;
  date: Date;
  data: NavigationPerf | BrowserPerf;
}

// ----- Computed analytics -----
export type AnalyticData = {
  sessions: {
    labels: number[];
    visitors: {
      total: number;
      data: number[];
    };
    uniqueVisitors: {
      total: number;
      data: number[];
    };
    meanDuration: number;
    pageCount: number;
  };
  pages: {
    all: Partial<Record<string, number>>;
    referrers: Partial<Record<string, number>>;
    initial: Partial<Record<string, number>>;
  };
  users: {
    browsers: Partial<Record<string, number>>;
    versions: Partial<Record<string, number>>;
    os: Partial<Record<string, number>>;
    width: Partial<Record<string, number>>;
    type: Partial<Record<string, number>>;
  };
  aggregation: 'day' | 'hour' | 'month';
};
