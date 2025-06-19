const axios = require('axios');

const SPACEX_BASE_URL = 'https://api.spacexdata.com/v4';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await axios.get(`${SPACEX_BASE_URL}/rockets`, {
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('SpaceX API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
