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
      try {
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
      } catch (error) {
        console.error('NEO API Error:', error);
        // Return mock data if API fails
        const today = new Date().toISOString().split("T")[0];
        return {
          near_earth_objects: {
            [today]: [
              {
                id: "54016354",
                name: "(2020 SO)",
                is_potentially_hazardous_asteroid: false,
                close_approach_data: [{
                  close_approach_date_full: "2024-Dec-19 12:30",
                  miss_distance: { kilometers: "1234567" },
                  relative_velocity: { kilometers_per_hour: "12345" }
                }],
                estimated_diameter: {
                  kilometers: {
                    estimated_diameter_min: 0.008,
                    estimated_diameter_max: 0.018
                  }
                }
              }
            ]
          }
        };
      }
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
          timestamp: data.timestamp || Math.floor(Date.now() / 1000),
          message: "success"
        };
      }

      return apiClient.get(API_ENDPOINTS.ISS.POSITION);
    },

    async getAstronauts() {
      try {
        if (isProduction) {
          const response = await apiClient.get(DIRECT_API_ENDPOINTS.ISS.ASTRONAUTS);
          return JSON.parse(response.contents);
        }

        return apiClient.get(API_ENDPOINTS.ISS.ASTRONAUTS);
      } catch (error) {
        console.error('Astronauts API Error:', error);
        // Fallback to mock data
        return {
          people: [
            { name: "Expedition 70 Commander", craft: "ISS" },
            { name: "Flight Engineer 1", craft: "ISS" },
            { name: "Flight Engineer 2", craft: "ISS" }
          ],
          number: 3,
          message: "success"
        };
      }
    }
  }
};

export default apiClient;
