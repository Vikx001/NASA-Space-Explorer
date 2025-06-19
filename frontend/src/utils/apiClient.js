import { API_ENDPOINTS, DIRECT_API_ENDPOINTS } from '../config/api';

const isProduction = process.env.NODE_ENV === 'production';

export const apiClient = {
  async get(url, options = {}) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  // NASA API methods
  nasa: {
    async getAPOD(params = {}) {
      if (isProduction) {
        const url = new URL(DIRECT_API_ENDPOINTS.NASA.APOD);
        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value);
        });
        return apiClient.get(url.toString());
      }
      
      const url = new URL(API_ENDPOINTS.NASA.APOD, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
      return apiClient.get(url.toString());
    },

    async getMarsPhotos(rover, params = {}) {
      if (isProduction) {
        const sol = params.sol || 1000;
        return apiClient.get(DIRECT_API_ENDPOINTS.NASA.MARS_PHOTOS(rover, sol));
      }
      
      const url = new URL(API_ENDPOINTS.NASA.MARS_PHOTOS, window.location.origin);
      url.searchParams.append('rover', rover);
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
      return apiClient.get(url.toString());
    },

    async getNEOFeed(params = {}) {
      if (isProduction) {
        const url = new URL(DIRECT_API_ENDPOINTS.NASA.NEO_FEED);
        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value);
        });
        return apiClient.get(url.toString());
      }
      
      const url = new URL(API_ENDPOINTS.NASA.NEO_FEED, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
      return apiClient.get(url.toString());
    },

    async getEPIC(collection = 'natural', params = {}) {
      if (isProduction) {
        const url = new URL(DIRECT_API_ENDPOINTS.NASA.EPIC(collection));
        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value);
        });
        return apiClient.get(url.toString());
      }
      
      const url = new URL(API_ENDPOINTS.NASA.EPIC(collection), window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
      return apiClient.get(url.toString());
    }
  },

  // SpaceX API methods
  spacex: {
    async getLaunches(type = '') {
      if (isProduction) {
        switch (type) {
          case 'upcoming':
            return apiClient.get(DIRECT_API_ENDPOINTS.SPACEX.LAUNCHES_UPCOMING);
          case 'past':
            return apiClient.get(DIRECT_API_ENDPOINTS.SPACEX.LAUNCHES_PAST);
          case 'latest':
            return apiClient.get(DIRECT_API_ENDPOINTS.SPACEX.LAUNCHES_LATEST);
          case 'next':
            return apiClient.get(DIRECT_API_ENDPOINTS.SPACEX.LAUNCHES_NEXT);
          default:
            return apiClient.get(DIRECT_API_ENDPOINTS.SPACEX.LAUNCHES);
        }
      }
      
      const url = new URL(API_ENDPOINTS.SPACEX.LAUNCHES, window.location.origin);
      if (type) url.searchParams.append('type', type);
      return apiClient.get(url.toString());
    },

    async getRockets() {
      if (isProduction) {
        return apiClient.get(DIRECT_API_ENDPOINTS.SPACEX.ROCKETS);
      }
      
      return apiClient.get(API_ENDPOINTS.SPACEX.ROCKETS);
    }
  },

  // ISS API methods
  iss: {
    async getPosition() {
      if (isProduction) {
        const data = await apiClient.get(DIRECT_API_ENDPOINTS.ISS.POSITION);
        // Convert wheretheiss.at format to open-notify format
        return {
          iss_position: {
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString()
          },
          timestamp: Math.floor(Date.now() / 1000),
          message: "success"
        };
      }

      return apiClient.get(API_ENDPOINTS.ISS.POSITION);
    },

    async getAstronauts() {
      try {
        if (isProduction) {
          // Use a CORS proxy for the astronauts API
          const proxyUrl = 'https://api.allorigins.win/get?url=';
          const targetUrl = encodeURIComponent('http://api.open-notify.org/astros.json');
          const response = await apiClient.get(proxyUrl + targetUrl);
          return JSON.parse(response.contents);
        }

        return apiClient.get(API_ENDPOINTS.ISS.ASTRONAUTS);
      } catch (error) {
        // Fallback to mock data
        return {
          people: [
            { name: "Expedition Crew Member 1", craft: "ISS" },
            { name: "Expedition Crew Member 2", craft: "ISS" },
            { name: "Expedition Crew Member 3", craft: "ISS" }
          ],
          number: 3,
          message: "success"
        };
      }
    }
  }
};

export default apiClient;
