const express = require('express');
const axios = require('axios');
const router = express.Router();

// Helper function to handle external API requests
const makeExternalRequest = async (url, params = {}) => {
  try {
    const response = await axios.get(url, {
      params,
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error(`External API Error for ${url}:`, error.message);
    throw new Error(`Failed to fetch data from external API: ${error.message}`);
  }
};

// Get current ISS position
router.get('/position', async (req, res) => {
  try {
    const data = await makeExternalRequest('http://api.open-notify.org/iss-now.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get astronauts currently in space
router.get('/astronauts', async (req, res) => {
  try {
    const data = await makeExternalRequest('http://api.open-notify.org/astros.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ISS pass times for a location
router.get('/pass', async (req, res) => {
  try {
    const { lat, lon, alt, n } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Latitude and longitude are required parameters' 
      });
    }

    const params = { lat, lon };
    if (alt) params.alt = alt;
    if (n) params.n = n;

    const data = await makeExternalRequest('http://api.open-notify.org/iss-pass.json', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reverse geocoding for ISS position
router.get('/location', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ 
        error: 'Latitude and longitude are required parameters' 
      });
    }

    const data = await makeExternalRequest(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        format: 'json',
        lat,
        lon
      }
    );
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
