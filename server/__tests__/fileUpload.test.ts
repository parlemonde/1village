import type { Response, Request } from 'express';
import fs from 'fs';
import path from 'path';

import { uploadFiles } from '../controllers/filesController';
import type { User } from '../entities/user';
import { AwsS3 } from '../fileUpload/s3';
import { AppError } from '../middlewares/handleErrors';
import { appDataSource, fakeUser } from './mock';

beforeAll(() => {
  return appDataSource.initialize();
});
beforeEach(() => {});
afterAll(() => {
  return appDataSource.destroy();
});

const dummyPdf = fs.readFileSync(path.join(__dirname, 'files/dummy.pdf'));
describe('Upload files', () => {
  test('Should return an url array', async () => {
    jest.spyOn(AwsS3.prototype, 'uploadFile').mockImplementationOnce(() => {
      return Promise.resolve('url/test');
    });
    jest.spyOn(AwsS3.prototype, 'uploadS3File').mockImplementationOnce(() => {
      return Promise.resolve('url/test');
    });

    const mockRequest: Partial<Request> = {
      user: fakeUser as User,
      files: [
        {
          buffer: dummyPdf,
          fieldname: 'files',
          filename: 'dummy.pdf',
          mimetype: 'application/pdf',
          originalname: 'dummy.pdf',
          path: 'server/__tests__/files',
          size: 1000,
          destination: 'server/__tests__/files',
        } as Express.Multer.File,
      ],
    };

    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.status = jest.fn(() => res); // chained

    await uploadFiles(mockRequest as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(['url/test']);
  });
  test('Should throw - files are missing -', async () => {
    const mockRequest: Partial<Request> = {
      user: fakeUser as User,
      files: [],
    };

    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.status = jest.fn(() => res); // chained

    await uploadFiles(mockRequest as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith('Files are missing');
  });
  test('User forbiden', async () => {
    const mockRequest: Partial<Request> = {
      files: [],
    };

    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.status = jest.fn(() => res); // chained

    await uploadFiles(mockRequest as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith('Forbidden');
  });
  test('Should throw an app error', async () => {
    jest.spyOn(AwsS3.prototype, 'uploadFile').mockImplementationOnce(() => {
      throw new AppError('Yolo', 0);
    });

    const mockRequest: Partial<Request> = {
      user: fakeUser as User,
      files: [
        {
          buffer: dummyPdf,
          fieldname: 'files',
          filename: 'dummy.pdf',
          mimetype: 'application/pdf',
          originalname: 'dummy.pdf',
          path: 'server/__tests__/files',
          size: 1000,
          destination: 'server/__tests__/files',
        } as Express.Multer.File,
      ],
    };

    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.status = jest.fn(() => res); // chained

    await uploadFiles(mockRequest as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith('Yolo');
  });
  test('Should throw an unknown error', async () => {
    jest.spyOn(AwsS3.prototype, 'uploadFile').mockImplementationOnce(() => {
      throw new Error('Yolo');
    });

    const mockRequest: Partial<Request> = {
      user: fakeUser as User,
      files: [
        {
          buffer: dummyPdf,
          fieldname: 'files',
          filename: 'dummy.pdf',
          mimetype: 'application/pdf',
          originalname: 'dummy.pdf',
          path: 'server/__tests__/files',
          size: 1000,
          destination: 'server/__tests__/files',
        } as Express.Multer.File,
      ],
    };

    const res = {} as unknown as Response;
    res.json = jest.fn();
    res.status = jest.fn(() => res); // chained

    await uploadFiles(mockRequest as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith('Internal server error');
  });
});
