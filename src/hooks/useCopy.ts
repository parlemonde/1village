import { useSnackbar } from 'notistack';
import React from 'react';

export const useCopy = (): { copyText: (text: string) => void } => {
  const { enqueueSnackbar } = useSnackbar();

  const fallbackCopyTextToClipboard = React.useCallback(
    (text: string): void => {
      const textArea = document.createElement('textarea');
      textArea.value = text;

      // Avoid scrolling to bottom
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'Copié dans le presse papier !' : 'Oups, impossible de copier dans le presse papier...';
        enqueueSnackbar(msg, {
          variant: successful ? 'success' : 'error',
        });
      } catch (err) {
        enqueueSnackbar('Oups, impossible de copier dans le presse papier...', {
          variant: 'error',
        });
      }

      document.body.removeChild(textArea);
    },
    [enqueueSnackbar],
  );

  const copyTextToClipboard = React.useCallback(
    (text: string): void => {
      if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(
        () => {
          enqueueSnackbar('Copié dans le presse papier !', {
            variant: 'success',
          });
        },
        () => {
          enqueueSnackbar('Oups, impossible de copier dans le presse papier...', {
            variant: 'error',
          });
        },
      );
    },
    [fallbackCopyTextToClipboard, enqueueSnackbar],
  );

  return { copyText: copyTextToClipboard };
};
