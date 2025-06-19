const request = require('supertest');
const express = require('express');
const axios = require('axios');
const issRoutes = require('../../routes/iss');

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Create test app
const app = express();
app.use(express.json());
app.use('/api/iss', issRoutes);

describe('ISS Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/iss/position', () => {
    test('should return ISS position', async () => {
      const mockPositionData = {
        iss_position: {
          latitude: '45.123',
          longitude: '-123.456'
        },
        timestamp: 1640995200,
        message: 'success'
      };

      mockedAxios.get.mockResolvedValue({ data: mockPositionData });

      const response = await request(app)
        .get('/api/iss/position')
        .expect(200);

      expect(response.body).toEqual(mockPositionData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://api.open-notify.org/iss-now.json',
        expect.objectContaining({
          params: {},
          timeout: 10000
        })
      );
    });

    test('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('ISS API Error'));

      const response = await request(app)
        .get('/api/iss/position')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/iss/astronauts', () => {
    test('should return astronauts in space', async () => {
      const mockAstronautData = {
        people: [
          {
            name: 'Test Astronaut 1',
            craft: 'ISS'
          },
          {
            name: 'Test Astronaut 2',
            craft: 'ISS'
          }
        ],
        number: 2,
        message: 'success'
      };

      mockedAxios.get.mockResolvedValue({ data: mockAstronautData });

      const response = await request(app)
        .get('/api/iss/astronauts')
        .expect(200);

      expect(response.body).toEqual(mockAstronautData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://api.open-notify.org/astros.json',
        expect.objectContaining({
          params: {},
          timeout: 10000
        })
      );
    });
  });

  describe('GET /api/iss/pass', () => {
    test('should return ISS pass times for coordinates', async () => {
      const mockPassData = {
        request: {
          altitude: 100,
          datetime: 1640995200,
          latitude: 40.7128,
          longitude: -74.0060,
          passes: 5
        },
        response: [
          {
            duration: 649,
            risetime: 1641000000
          },
          {
            duration: 542,
            risetime: 1641005000
          }
        ],
        message: 'success'
      };

      mockedAxios.get.mockResolvedValue({ data: mockPassData });

      const response = await request(app)
        .get('/api/iss/pass?lat=40.7128&lon=-74.0060')
        .expect(200);

      expect(response.body).toEqual(mockPassData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://api.open-notify.org/iss-pass.json',
        expect.objectContaining({
          params: {
            lat: '40.7128',
            lon: '-74.0060'
          }
        })
      );
    });

    test('should require lat and lon parameters', async () => {
      const response = await request(app)
        .get('/api/iss/pass')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Latitude and longitude');
    });
  });

  describe('GET /api/iss/location', () => {
    test('should return location name for coordinates', async () => {
      const mockLocationData = {
        display_name: 'New York, NY, USA'
      };

      mockedAxios.get.mockResolvedValue({ data: mockLocationData });

      const response = await request(app)
        .get('/api/iss/location?lat=40.7128&lon=-74.0060')
        .expect(200);

      expect(response.body).toEqual(mockLocationData);
    });

    test('should require lat and lon parameters', async () => {
      const response = await request(app)
        .get('/api/iss/location')
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should handle geocoding API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Geocoding API Error'));

      const response = await request(app)
        .get('/api/iss/location?lat=40.7128&lon=-74.0060')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });
});
