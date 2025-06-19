const axios = require('axios');

const SPACEX_BASE_URL = 'https://api.spacexdata.com/v4';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type } = req.query; // upcoming, past, latest, next
    
    let endpoint = '/launches';
    
    switch (type) {
      case 'upcoming':
        endpoint = '/launches/upcoming';
        break;
      case 'past':
        endpoint = '/launches/past';
        break;
      case 'latest':
        endpoint = '/launches/latest';
        break;
      case 'next':
        endpoint = '/launches/next';
        break;
      default:
        endpoint = '/launches';
    }

    const response = await axios.get(`${SPACEX_BASE_URL}${endpoint}`, {
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('SpaceX API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
