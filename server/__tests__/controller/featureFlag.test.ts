import type { Request, Response } from 'express';
import express from 'express';
import request from 'supertest';

import { Controller } from '../../controllers/controller';
import { FeatureFlag } from '../../entities/featureFlag';
import { UserType } from '../../entities/user';
import { AppDataSource } from '../../utils/data-source';

// Mock the AppDataSource and its getRepository method

jest.mock('../../utils/data-source', () => {
    const mockFeatureFlagFind = jest.fn();

    // This is the mock class
    class MockAppDataSource {
        // Mock instance method
        getRepository() {
            return {
                find: mockFeatureFlagFind,
            };
        }

        // Mock static methods
        static async initialize() { }
        static async destroy() { }
        static isInitialized = true;
    }

    return MockAppDataSource;
});

const mockFeatureFlagFind = jest.fn();
jest.mock('../../entities/featureFlag', () => {
    return jest.fn(() => ({
        find: mockFeatureFlagFind,
    }));
});

describe('GET /featureFlags', () => {
    let server: express.Express;

    beforeAll(async () => {
        server = express();
        server.use(express.json());

        const featureFlagController = new Controller('/featureFlags');
        featureFlagController.get({ path: '', userType: UserType.ADMIN }, async (_req: Request, res: Response) => {
            const featureFlags = await AppDataSource.getRepository(FeatureFlag).find({ relations: ['users'] });
            res.json(featureFlags);
        });

        server.use(featureFlagController.router);

        await AppDataSource.initialize();
    });

    afterAll(async () => {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
    });

    it('should return all feature flags for an admin', async () => {
        const mockFeatureFlags = [{ id: 1, name: 'Test Flag' }];

        // Mock the find method to return the mockFeatureFlags
        mockFeatureFlagFind.mockResolvedValue(mockFeatureFlags);

        // The "query" function is used to set query parameters.
        const res = await request(server).get('/featureFlags').query({ userType: UserType.ADMIN });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockFeatureFlags);
    });

    it('should return 403 forbidden for non-admin users', async () => {
        // The "query" function is used to set query parameters.
        const res = await request(server).get('/featureFlags').query({ userType: UserType.FAMILY });

        expect(res.status).toBe(403);
    });
});
