import { buildQueryString, apiRequest, API_ENDPOINTS } from '../api';

describe('API Configuration', () => {
  describe('buildQueryString', () => {
    test('builds query string from object', () => {
      const params = {
        start_date: '2025-06-17',
        end_date: '2025-06-18',
        count: 5
      };
      
      const result = buildQueryString(params);
      expect(result).toBe('start_date=2025-06-17&end_date=2025-06-18&count=5');
    });

    test('handles empty object', () => {
      const result = buildQueryString({});
      expect(result).toBe('');
    });

    test('filters out null and undefined values', () => {
      const params = {
        valid: 'value',
        nullValue: null,
        undefinedValue: undefined,
        emptyString: ''
      };
      
      const result = buildQueryString(params);
      expect(result).toBe('valid=value&emptyString=');
    });

    test('handles special characters', () => {
      const params = {
        query: 'asteroid belt',
        special: 'test@example.com'
      };
      
      const result = buildQueryString(params);
      expect(result).toContain('query=asteroid+belt');
    });
  });

  describe('apiRequest', () => {
    beforeEach(() => {
      fetch.mockClear();
    });

    test('makes successful API request', async () => {
      const mockData = { test: 'data' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiRequest('http://test.com/api');
      
      expect(fetch).toHaveBeenCalledWith('http://test.com/api', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockData);
    });

    test('handles HTTP errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(apiRequest('http://test.com/api')).rejects.toThrow('HTTP error! status: 404');
    });

    test('handles network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiRequest('http://test.com/api')).rejects.toThrow('Network error');
    });

    test('includes custom headers', async () => {
      const mockData = { test: 'data' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      await apiRequest('http://test.com/api', {
        headers: {
          'Authorization': 'Bearer token',
        },
      });

      expect(fetch).toHaveBeenCalledWith('http://test.com/api', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token',
        },
      });
    });
  });

  describe('API_ENDPOINTS', () => {
    test('has correct NASA endpoints', () => {
      expect(API_ENDPOINTS.NASA.APOD).toBeDefined();
      expect(API_ENDPOINTS.NASA.NEO_FEED).toBeDefined();
      expect(API_ENDPOINTS.NASA.MARS_PHOTOS).toBeDefined();
    });

    test('has correct SpaceX endpoints', () => {
      expect(API_ENDPOINTS.SPACEX.LAUNCHES).toBeDefined();
      expect(API_ENDPOINTS.SPACEX.LAUNCHES_UPCOMING).toBeDefined();
    });

    test('has correct ISS endpoints', () => {
      expect(API_ENDPOINTS.ISS.POSITION).toBeDefined();
      expect(API_ENDPOINTS.ISS.ASTRONAUTS).toBeDefined();
    });

    test('function endpoints work correctly', () => {
      const marsPhotosUrl = API_ENDPOINTS.NASA.MARS_PHOTOS('curiosity');
      expect(marsPhotosUrl).toContain('curiosity');
      
      const neoLookupUrl = API_ENDPOINTS.NASA.NEO_LOOKUP('12345');
      expect(neoLookupUrl).toContain('12345');
    });
  });
});
