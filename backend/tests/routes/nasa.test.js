const request = require('supertest');
const express = require('express');
const axios = require('axios');
const nasaRoutes = require('../../routes/nasa');

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Create test app
const app = express();
app.use(express.json());
app.use('/api/nasa', nasaRoutes);

describe('NASA Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/nasa/apod', () => {
    test('should return APOD data successfully', async () => {
      const mockAPODData = {
        date: '2025-06-17',
        title: 'Test Astronomy Picture',
        explanation: 'Test explanation',
        url: 'https://example.com/test.jpg',
        media_type: 'image'
      };

      mockedAxios.get.mockResolvedValue({ data: mockAPODData });

      const response = await request(app)
        .get('/api/nasa/apod')
        .expect(200);

      expect(response.body).toEqual(mockAPODData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('planetary/apod'),
        expect.objectContaining({
          params: expect.objectContaining({
            api_key: 'test-api-key'
          })
        })
      );
    });

    test('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValue(new Error('NASA API Error'));

      const response = await request(app)
        .get('/api/nasa/apod')
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    test('should accept query parameters', async () => {
      const mockData = { test: 'data' };
      mockedAxios.get.mockResolvedValue({ data: mockData });

      await request(app)
        .get('/api/nasa/apod?count=5&date=2025-06-17')
        .expect(200);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('planetary/apod'),
        expect.objectContaining({
          params: expect.objectContaining({
            count: 5,
            date: '2025-06-17',
            api_key: 'test-api-key'
          }),
          timeout: 10000
        })
      );
    });
  });

  describe('GET /api/nasa/neo/feed', () => {
    test('should return NEO feed data', async () => {
      const mockNEOData = {
        near_earth_objects: {
          '2025-06-17': [
            {
              id: '12345',
              name: '(2000 LF3)',
              is_potentially_hazardous_asteroid: false
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValue({ data: mockNEOData });

      const response = await request(app)
        .get('/api/nasa/neo/feed?start_date=2025-06-17&end_date=2025-06-17')
        .expect(200);

      expect(response.body).toEqual(mockNEOData);
    });
  });

  describe('GET /api/nasa/neo/image/:name', () => {
    test('should return asteroid image data for known asteroid', async () => {
      const response = await request(app)
        .get('/api/nasa/neo/image/Bennu')
        .expect(200);

      expect(response.body).toHaveProperty('url');
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('source');
      expect(response.body.title).toBe('Bennu');
    });

    test('should return fallback image for unknown asteroid', async () => {
      const response = await request(app)
        .get('/api/nasa/neo/image/(2025%20XY1)')
        .expect(200);

      expect(response.body).toHaveProperty('url');
      expect(response.body).toHaveProperty('source');
    });

    test('should handle errors gracefully', async () => {
      // Mock axios to throw error for NASA Image API
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .get('/api/nasa/neo/image/TestAsteroid')
        .expect(200); // Should still return fallback

      expect(response.body).toHaveProperty('url');
    });
  });

  describe('GET /api/nasa/mars-photos/:rover', () => {
    test('should return Mars rover photos', async () => {
      const mockMarsData = {
        photos: [
          {
            id: 12345,
            img_src: 'https://example.com/mars-photo.jpg',
            earth_date: '2025-06-17',
            rover: { name: 'Curiosity' },
            camera: { name: 'MAST' }
          }
        ]
      };

      mockedAxios.get.mockResolvedValue({ data: mockMarsData });

      const response = await request(app)
        .get('/api/nasa/mars-photos/curiosity?sol=1000')
        .expect(200);

      expect(response.body).toEqual(mockMarsData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('mars-photos/api/v1/rovers/curiosity/photos'),
        expect.objectContaining({
          params: expect.objectContaining({
            sol: '1000',
            api_key: 'test-api-key'
          })
        })
      );
    });
  });
});
