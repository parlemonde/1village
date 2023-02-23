import { generateTemporaryToken } from '.';

export const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || '';
export const SSO_HOST = process.env.NEXT_PUBLIC_PLM_HOST || '';
export const SSO_HOSTNAME = SSO_HOST.replace(/(^\w+:|^)\/\//, '');

export function onLoginSSO() {
  if (!CLIENT_ID || !SSO_HOST) {
    return;
  }
  const state = generateTemporaryToken();
  window.sessionStorage.setItem('oauth-state', state);
  const url = `${encodeURI(SSO_HOST)}/oauth/authorize?response_type=code&client_id=${encodeURI(CLIENT_ID)}&redirect_uri=${encodeURI(
    window.location.origin + '/professeur',
  )}&state=${encodeURI(state)}`;
  window.location.replace(url);
}
