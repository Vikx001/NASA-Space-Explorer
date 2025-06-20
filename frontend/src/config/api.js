const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const NASA_API_KEY = 'uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp';
const USE_DIRECT_APIS = true; // Use direct API calls for deployment

// Direct API endpoints for production deployment
export const DIRECT_API_ENDPOINTS = {
  NASA: {
    APOD: `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
    MARS_PHOTOS: (rover, sol = 1000) => `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${NASA_API_KEY}`,
    NEO_FEED: `https://api.nasa.gov/neo/rest/v1/feed?api_key=${NASA_API_KEY}`,
    NEO_LOOKUP: (id) => `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${NASA_API_KEY}`,
    EPIC: (collection = 'natural') => `https://api.nasa.gov/EPIC/api/${collection}?api_key=${NASA_API_KEY}`,
    IMAGES_SEARCH: 'https://images-api.nasa.gov/search'
  },
  SPACEX: {
    LAUNCHES: 'https://api.spacexdata.com/v4/launches',
    LAUNCHES_UPCOMING: 'https://api.spacexdata.com/v4/launches/upcoming',
    LAUNCHES_PAST: 'https://api.spacexdata.com/v4/launches/past',
    LAUNCHES_LATEST: 'https://api.spacexdata.com/v4/launches/latest',
    LAUNCHES_NEXT: 'https://api.spacexdata.com/v4/launches/next',
    ROCKETS: 'https://api.spacexdata.com/v4/rockets'
  },
  ISS: {
    POSITION: 'https://api.wheretheiss.at/v1/satellites/25544',
    ASTRONAUTS: 'https://corsproxy.io/?http://api.open-notify.org/astros.json'
  }
};

export const API_ENDPOINTS = {
  NASA: {
    APOD: `${API_BASE_URL}/nasa/apod`,
    MARS_PHOTOS: `${API_BASE_URL}/nasa/mars-photos`,
    NEO_FEED: `${API_BASE_URL}/nasa/neo-feed`,
    NEO_LOOKUP: (id) => `${API_BASE_URL}/nasa/neo/${id}`,
    NEO_IMAGE: (name) => `${API_BASE_URL}/nasa/neo/image/${encodeURIComponent(name)}`,
    EPIC: (collection) => `${API_BASE_URL}/nasa/epic/${collection}`,
    IMAGES_SEARCH: `${API_BASE_URL}/nasa/images/search`,
    EXOPLANETS: `${API_BASE_URL}/nasa/exoplanets`
  },

  SPACEX: {
    LAUNCHES: `${API_BASE_URL}/spacex/launches`,
    LAUNCHES_UPCOMING: `${API_BASE_URL}/spacex/launches?type=upcoming`,
    LAUNCHES_PAST: `${API_BASE_URL}/spacex/launches?type=past`,
    LAUNCHES_LATEST: `${API_BASE_URL}/spacex/launches?type=latest`,
    LAUNCHES_NEXT: `${API_BASE_URL}/spacex/launches?type=next`,
    LAUNCH_BY_ID: (id) => `${API_BASE_URL}/spacex/launches/${id}`,
    ROCKETS: `${API_BASE_URL}/spacex/rockets`,
    ROCKET_BY_ID: (id) => `${API_BASE_URL}/spacex/rockets/${id}`,
    CAPSULES: `${API_BASE_URL}/spacex/capsules`,
    COMPANY: `${API_BASE_URL}/spacex/company`,
    CREW: `${API_BASE_URL}/spacex/crew`,
    DRAGONS: `${API_BASE_URL}/spacex/dragons`,
    LANDPADS: `${API_BASE_URL}/spacex/landpads`,
    LAUNCHPADS: `${API_BASE_URL}/spacex/launchpads`
  },

  SPACENEWS: {
    ARTICLES: `${API_BASE_URL}/spacenews/articles`,
    ARTICLE_BY_ID: (id) => `${API_BASE_URL}/spacenews/articles/${id}`,
    BLOGS: `${API_BASE_URL}/spacenews/blogs`,
    BLOG_BY_ID: (id) => `${API_BASE_URL}/spacenews/blogs/${id}`,
    REPORTS: `${API_BASE_URL}/spacenews/reports`,
    REPORT_BY_ID: (id) => `${API_BASE_URL}/spacenews/reports/${id}`,
    INFO: `${API_BASE_URL}/spacenews/info`
  },

  ISS: {
    POSITION: `${API_BASE_URL}/iss/position`,
    ASTRONAUTS: `${API_BASE_URL}/iss/astronauts`,
    PASS: `${API_BASE_URL}/iss/pass`,
    LOCATION: `${API_BASE_URL}/iss/location`
  },

  EXTERNAL: {
    OBSERVATORIES: `${API_BASE_URL}/external/observatories`,
    TIMELINE: `${API_BASE_URL}/external/timeline`,
    IMAGES: (type) => `${API_BASE_URL}/external/images/${type}`,
    ASTEROID_IMAGES: `${API_BASE_URL}/external/asteroid-images`,
    GLOBE_TEXTURES: `${API_BASE_URL}/external/globe-textures`,
    LINKS: `${API_BASE_URL}/external/links`
  },

  AI: {
    ANALYZE_ASTEROID: `${API_BASE_URL}/ai/analyze-asteroid`,
    ANALYZE_SPACE_WEATHER: `${API_BASE_URL}/ai/analyze-space-weather`,
    ANALYZE_MARS_MISSION: `${API_BASE_URL}/ai/analyze-mars-mission`,
    MISSION_INSIGHTS: `${API_BASE_URL}/ai/mission-insights`,
    SUMMARIZE_NEWS: `${API_BASE_URL}/ai/summarize-news`,
    CLASSIFY_SPACE_OBJECT: `${API_BASE_URL}/ai/classify-space-object`
  },

  HEALTH: `${API_BASE_URL}/health`
};

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      searchParams.append(key, params[key]);
    }
  });
  return searchParams.toString();
};

export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
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
    console.error('API Request Error:', error);
    throw error;
  }
};

export default API_ENDPOINTS;
