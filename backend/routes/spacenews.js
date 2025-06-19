const express = require('express');
const axios = require('axios');
const router = express.Router();

const SPACENEWS_BASE_URL = 'https://api.spaceflightnewsapi.net/v4';

// Helper function to handle Space News API requests
const makeSpaceNewsRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${SPACENEWS_BASE_URL}${endpoint}`, {
      params,
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error(`Space News API Error for ${endpoint}:`, error.message);
    throw new Error(`Failed to fetch data from Space News API: ${error.message}`);
  }
};

// Get articles
router.get('/articles', async (req, res) => {
  try {
    const { limit, offset, search, news_site, published_at_gte, published_at_lte } = req.query;
    const params = {};
    
    if (limit) params.limit = parseInt(limit);
    if (offset) params.offset = parseInt(offset);
    if (search) params.search = search;
    if (news_site) params.news_site = news_site;
    if (published_at_gte) params.published_at_gte = published_at_gte;
    if (published_at_lte) params.published_at_lte = published_at_lte;

    const data = await makeSpaceNewsRequest('/articles', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get article by ID
router.get('/articles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await makeSpaceNewsRequest(`/articles/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get blogs
router.get('/blogs', async (req, res) => {
  try {
    const { limit, offset, search, news_site, published_at_gte, published_at_lte } = req.query;
    const params = {};
    
    if (limit) params.limit = parseInt(limit);
    if (offset) params.offset = parseInt(offset);
    if (search) params.search = search;
    if (news_site) params.news_site = news_site;
    if (published_at_gte) params.published_at_gte = published_at_gte;
    if (published_at_lte) params.published_at_lte = published_at_lte;

    const data = await makeSpaceNewsRequest('/blogs', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get blog by ID
router.get('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await makeSpaceNewsRequest(`/blogs/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reports
router.get('/reports', async (req, res) => {
  try {
    const { limit, offset, search, news_site, published_at_gte, published_at_lte } = req.query;
    const params = {};
    
    if (limit) params.limit = parseInt(limit);
    if (offset) params.offset = parseInt(offset);
    if (search) params.search = search;
    if (news_site) params.news_site = news_site;
    if (published_at_gte) params.published_at_gte = published_at_gte;
    if (published_at_lte) params.published_at_lte = published_at_lte;

    const data = await makeSpaceNewsRequest('/reports', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get report by ID
router.get('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await makeSpaceNewsRequest(`/reports/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get info about the API
router.get('/info', async (req, res) => {
  try {
    const data = await makeSpaceNewsRequest('/info');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
