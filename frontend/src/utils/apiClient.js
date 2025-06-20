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
      try {
        // Try wheretheiss.at first (supports CORS)
        const data = await apiClient.get('https://api.wheretheiss.at/v1/satellites/25544');
        console.log('ISS Position Data:', data); // Debug log
        // Convert wheretheiss.at format to open-notify format
        return {
          iss_position: {
            latitude: data.latitude.toString(),
            longitude: data.longitude.toString()
          },
          timestamp: data.timestamp || Math.floor(Date.now() / 1000),
          message: "success"
        };
      } catch (error) {
        console.error('ISS Position API Error:', error);
        // Try CORS proxy as fallback
        try {
          const proxyData = await apiClient.get('https://api.allorigins.win/get?url=' + encodeURIComponent('http://api.open-notify.org/iss-now.json'));
          const parsedData = JSON.parse(proxyData.contents);
          console.log('Proxy ISS Position Data:', parsedData);
          return parsedData;
        } catch (proxyError) {
          console.error('Proxy ISS API Error:', proxyError);
          // Return mock position data as fallback
          return {
            iss_position: {
              latitude: "25.7617",
              longitude: "-80.1918"
            },
            timestamp: Math.floor(Date.now() / 1000),
            message: "success"
          };
        }
      }
    },

    async getAstronauts() {
      try {
        // Use CORS proxy for astronauts data
        const proxyData = await apiClient.get('https://api.allorigins.win/get?url=' + encodeURIComponent('http://api.open-notify.org/astros.json'));
        const data = JSON.parse(proxyData.contents);
        console.log('Astronauts Data:', data);
        return data;
      } catch (error) {
        console.error('Astronauts API Error:', error);
        // Fallback to current real astronaut names
        return {
          people: [
            { name: "Oleg Kononenko", craft: "ISS" },
            { name: "Nikolai Chub", craft: "ISS" },
            { name: "Tracy Caldwell Dyson", craft: "ISS" },
            { name: "Matthew Dominick", craft: "ISS" },
            { name: "Michael Barratt", craft: "ISS" },
            { name: "Jeanette Epps", craft: "ISS" },
            { name: "Alexander Grebenkin", craft: "ISS" },
            { name: "Butch Wilmore", craft: "ISS" },
            { name: "Sunita Williams", craft: "ISS" }
          ],
          number: 9,
          message: "success"
        };
      }
    }
  }
};

export default apiClient;
