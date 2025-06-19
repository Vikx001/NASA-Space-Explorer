const axios = require('axios');

const NASA_API_KEY = process.env.NASA_API_KEY || 'uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp';
const NASA_BASE_URL = 'https://api.nasa.gov';

const makeNASARequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${NASA_BASE_URL}${endpoint}`, {
      params: {
        api_key: NASA_API_KEY,
        ...params
      },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error(`NASA API Error for ${endpoint}:`, error.message);
    throw new Error(`Failed to fetch data from NASA API: ${error.message}`);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rover, sol, earth_date, camera, page } = req.query;
    
    if (!rover) {
      return res.status(400).json({ error: 'Rover parameter is required' });
    }
    
    const params = {};
    if (sol) params.sol = sol;
    if (earth_date) params.earth_date = earth_date;
    if (camera) params.camera = camera;
    if (page) params.page = page;

    const data = await makeNASARequest(`/mars-photos/api/v1/rovers/${rover}/photos`, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
