const express = require('express');
const axios = require('axios');
const router = express.Router();

const SPACEX_BASE_URL = 'https://api.spacexdata.com/v4';

// Helper function to handle SpaceX API requests
const makeSpaceXRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${SPACEX_BASE_URL}${endpoint}`, {
      params,
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error(`SpaceX API Error for ${endpoint}:`, error.message);
    throw new Error(`Failed to fetch data from SpaceX API: ${error.message}`);
  }
};

// Get all launches
router.get('/launches', async (req, res) => {
  try {
    const { limit, offset, sort, order } = req.query;
    const params = {};
    
    if (limit) params.limit = parseInt(limit);
    if (offset) params.offset = parseInt(offset);
    if (sort) params.sort = sort;
    if (order) params.order = order;

    const data = await makeSpaceXRequest('/launches', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get upcoming launches
router.get('/launches/upcoming', async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const params = {};
    
    if (limit) params.limit = parseInt(limit);
    if (offset) params.offset = parseInt(offset);

    const data = await makeSpaceXRequest('/launches/upcoming', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get past launches
router.get('/launches/past', async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const params = {};
    
    if (limit) params.limit = parseInt(limit);
    if (offset) params.offset = parseInt(offset);

    const data = await makeSpaceXRequest('/launches/past', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest launch
router.get('/launches/latest', async (req, res) => {
  try {
    const data = await makeSpaceXRequest('/launches/latest');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get next launch
router.get('/launches/next', async (req, res) => {
  try {
    const data = await makeSpaceXRequest('/launches/next');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get launch by ID
router.get('/launches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await makeSpaceXRequest(`/launches/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rockets
router.get('/rockets', async (req, res) => {
  try {
    const data = await makeSpaceXRequest('/rockets');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get rocket by ID
router.get('/rockets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await makeSpaceXRequest(`/rockets/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get capsules
router.get('/capsules', async (req, res) => {
  try {
    const data = await makeSpaceXRequest('/capsules');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get company info
router.get('/company', async (req, res) => {
  try {
    const data = await makeSpaceXRequest('/company');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get crew
router.get('/crew', async (req, res) => {
  try {
    const data = await makeSpaceXRequest('/crew');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dragons
router.get('/dragons', async (req, res) => {
  try {
    const data = await makeSpaceXRequest('/dragons');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get landpads
router.get('/landpads', async (req, res) => {
  try {
    const data = await makeSpaceXRequest('/landpads');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get launchpads
router.get('/launchpads', async (req, res) => {
  try {
    const data = await makeSpaceXRequest('/launchpads');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
