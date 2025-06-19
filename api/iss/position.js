const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await axios.get('http://api.open-notify.org/iss-now.json', {
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('ISS API Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
