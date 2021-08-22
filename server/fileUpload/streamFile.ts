import type { Request, Response, NextFunction } from 'express';
import path from 'path';

import { getFileData, getFile } from './index';

function getContentTypeFromFileName(filename: string): string | null {
  const extension = path.extname(filename).substring(1);
  if (extension === 'svg') {
    return 'image/svg+xml';
  }
  if (['jpeg', 'png', 'gif', 'webp'].includes(extension)) {
    return `image/${extension}`;
  }
  return null;
}

export async function streamFile(file: string, req: Request, res: Response, next: NextFunction): Promise<void> {
  const data = await getFileData(file);
  const size = data.ContentLength;
  const range = req.headers.range;
  const contentType =
    data.ContentType.length === 0 || data.ContentType === 'application/octet-stream'
      ? getContentTypeFromFileName(req.params.filename) ?? 'application/octet-stream'
      : data.ContentType ?? 'application/octet-stream';

  // file does not exists
  if (size === 0) {
    next();
    return;
  }

  // Inform the frontend that we accept HTTP range requests.
  if (req.method === 'HEAD') {
    res.status(200);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', data.ContentLength);
    res.setHeader('Last-Modified', data.LastModified.toISOString());
    res.setHeader('Content-Type', contentType);
    res.end();
    return;
  }

  const readable = getFile(file, range).on('error', () => {
    next();
  });
  res.setHeader('Last-Modified', data.LastModified.toISOString());
  res.setHeader('Content-Type', contentType);

  /** Check for Range header */
  if (range) {
    /** Extracting Start and End value from Range Header */
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    let start = parseInt(startStr, 10);
    let end = endStr ? parseInt(endStr, 10) : size - 1;

    if (!isNaN(start) && isNaN(end)) {
      end = size - 1;
    }
    if (isNaN(start) && !isNaN(end)) {
      start = size - end;
      end = size - 1;
    }

    // Handle unavailable range request
    if (start >= size || end >= size) {
      // Return the 416 Range Not Satisfiable.
      res.writeHead(416, {
        'Content-Range': `bytes */${size}`,
      });
      return res.end();
    }

    /** Sending Partial Content With HTTP Code 206 */
    res.status(206);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
    res.setHeader('Content-Length', end - start + 1);
    readable.pipe(res);
  } else {
    res.status(200);
    res.setHeader('Content-Length', data.ContentLength);
    readable.pipe(res);
  }
}
