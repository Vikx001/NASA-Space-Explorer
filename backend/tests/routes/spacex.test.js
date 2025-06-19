const request = require('supertest');
const express = require('express');
const axios = require('axios');
const spacexRoutes = require('../../routes/spacex');

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Create test app
const app = express();
app.use(express.json());
app.use('/api/spacex', spacexRoutes);

describe('SpaceX Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/spacex/launches/upcoming', () => {
    test('should return upcoming launches', async () => {
      const mockLaunchData = [
        {
          id: '12345',
          name: 'Test Launch',
          date_utc: '2025-07-01T12:00:00.000Z',
          rocket: 'falcon9',
          success: null,
          upcoming: true
        }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockLaunchData });

      const response = await request(app)
        .get('/api/spacex/launches/upcoming')
        .expect(200);

      expect(response.body).toEqual(mockLaunchData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.spacexdata.com/v4/launches/upcoming',
        expect.objectContaining({
          params: {},
          timeout: 10000
        })
      );
    });

    test('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('SpaceX API Error'));

      const response = await request(app)
        .get('/api/spacex/launches/upcoming')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/spacex/launches/past', () => {
    test('should return past launches', async () => {
      const mockLaunchData = [
        {
          id: '67890',
          name: 'Past Launch',
          date_utc: '2025-01-01T12:00:00.000Z',
          rocket: 'falcon9',
          success: true,
          upcoming: false
        }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockLaunchData });

      const response = await request(app)
        .get('/api/spacex/launches/past')
        .expect(200);

      expect(response.body).toEqual(mockLaunchData);
    });
  });

  describe('GET /api/spacex/launches/latest', () => {
    test('should return latest launch', async () => {
      const mockLaunchData = {
        id: '11111',
        name: 'Latest Launch',
        date_utc: '2025-06-15T12:00:00.000Z',
        rocket: 'falcon9',
        success: true
      };

      mockedAxios.get.mockResolvedValue({ data: mockLaunchData });

      const response = await request(app)
        .get('/api/spacex/launches/latest')
        .expect(200);

      expect(response.body).toEqual(mockLaunchData);
    });
  });

  describe('GET /api/spacex/launches/next', () => {
    test('should return next launch', async () => {
      const mockLaunchData = {
        id: '22222',
        name: 'Next Launch',
        date_utc: '2025-07-01T12:00:00.000Z',
        rocket: 'falcon9',
        upcoming: true
      };

      mockedAxios.get.mockResolvedValue({ data: mockLaunchData });

      const response = await request(app)
        .get('/api/spacex/launches/next')
        .expect(200);

      expect(response.body).toEqual(mockLaunchData);
    });
  });

  describe('GET /api/spacex/rockets', () => {
    test('should return rockets data', async () => {
      const mockRocketData = [
        {
          id: 'falcon9',
          name: 'Falcon 9',
          type: 'rocket',
          active: true,
          stages: 2
        }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockRocketData });

      const response = await request(app)
        .get('/api/spacex/rockets')
        .expect(200);

      expect(response.body).toEqual(mockRocketData);
    });
  });

  describe('GET /api/spacex/company', () => {
    test('should return company information', async () => {
      const mockCompanyData = {
        name: 'SpaceX',
        founder: 'Elon Musk',
        founded: 2002,
        employees: 12000,
        headquarters: {
          address: 'Rocket Road',
          city: 'Hawthorne',
          state: 'California'
        }
      };

      mockedAxios.get.mockResolvedValue({ data: mockCompanyData });

      const response = await request(app)
        .get('/api/spacex/company')
        .expect(200);

      expect(response.body).toEqual(mockCompanyData);
    });
  });
});
