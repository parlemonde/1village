/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', function () {
  if (H5P !== undefined && window.parent !== window) {
    H5P.externalDispatcher.on('xAPI', function (event) {
      window.parent.postMessage({ context: 'h5p', action: 'xapi', statement: event.data.statement }, '*');
    });
  }
});
