import { axiosRequest } from './axiosRequest';

type EventData = {
  scrollHeight?: number;
  clientHeight?: number;
  statement?: unknown;
};

function hello(iframe: HTMLIFrameElement, _data: EventData, respond: (value: string) => void): void {
  iframe.style.width = '100%';
  iframe.getBoundingClientRect();
  const resize = () => {
    if (iframe.contentWindow) {
      respond('resize');
    } else {
      window.removeEventListener('resize', resize);
    }
  };
  window.addEventListener('resize', resize, false);
  respond('hello');
}
function prepareResize(iframe: HTMLIFrameElement, data: EventData, respond: (value: string) => void): void {
  if (iframe.clientHeight !== data.scrollHeight || data.scrollHeight !== data.clientHeight) {
    iframe.style.height = (data.clientHeight || 0) - 25 + 'px';
    respond('resizePrepared');
  }
}
function resize(iframe: HTMLIFrameElement, data: EventData): void {
  iframe.style.height = (data.scrollHeight || 0) - 25 + 'px';
}

function xapi(data: EventData, csrfToken: string | null): void {
  axiosRequest({
    headers: {
      'csrf-token': csrfToken || '',
    },
    method: 'POST',
    url: '/xAPI',
    data: data.statement,
  });
}

const actionHandlers = {
  hello,
  prepareResize,
  resize,
};

const isKeyOfAction = (actionName: unknown): actionName is keyof typeof actionHandlers =>
  typeof actionName === 'string' && Object.prototype.hasOwnProperty.call(actionHandlers, actionName);

const getReceiveMessageFn = (csrfToken: string | null) => (event: MessageEvent) => {
  if (event.data.context !== 'h5p') {
    return;
  }
  let iframe, // eslint-disable-next-line prefer-const
    iframes = document.getElementsByTagName('iframe');
  for (let i = 0; i < iframes.length; i++) {
    if (iframes[i].contentWindow === event.source) {
      iframe = iframes[i];
      break;
    }
  }
  if (!iframe) {
    return;
  }
  const actionName = event.data.action;
  if (actionName === 'xapi') {
    xapi(event.data, csrfToken);
    return;
  }
  if (isKeyOfAction(actionName)) {
    actionHandlers[actionName](iframe, event.data, (action: string) => {
      const data = {
        action,
        context: 'h5p',
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      event.source.postMessage(data, event.origin);
    });
  }
};

export function initH5p(csrfToken: string | null): () => void {
  const receiveMessage = getReceiveMessageFn(csrfToken);
  window.addEventListener('message', receiveMessage, false);
  const iframes = document.getElementsByTagName('iframe');
  const ready = { context: 'h5p', action: 'ready' };
  for (let i = 0; i < iframes.length; i++) {
    if (iframes[i].src.indexOf('h5p') !== -1) {
      iframes[i].contentWindow?.postMessage(ready, '*');
    }
  }

  // remove event listener
  return () => {
    window.removeEventListener('message', receiveMessage, false);
  };
}
