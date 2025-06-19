const express = require('express');
const router = express.Router();
const aiAnalyzer = require('../utils/aiAnalyzer');
const axios = require('axios');

router.post('/analyze-asteroid', async (req, res) => {
  try {
    const { asteroid } = req.body;
    
    if (!asteroid) {
      return res.status(400).json({ error: 'Asteroid data is required' });
    }
    
    const analysis = aiAnalyzer.analyzeAsteroidRisk(asteroid);
    
    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
      aiModel: 'SpaceAI Rule-Based Analyzer v1.0'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/analyze-space-weather', async (req, res) => {
  try {
    const { issPosition } = req.body;
    
    if (!issPosition) {
      return res.status(400).json({ error: 'ISS position data is required' });
    }
    
    const analysis = aiAnalyzer.analyzeSpaceWeather(issPosition);
    
    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
      aiModel: 'SpaceAI Weather Analyzer v1.0'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/analyze-mars-mission', async (req, res) => {
  try {
    const { marsPhotos } = req.body;
    
    const analysis = aiAnalyzer.analyzeMarsConditions(marsPhotos);
    
    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
      aiModel: 'SpaceAI Mars Analyzer v1.0'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/mission-insights', async (req, res) => {
  try {
    const { launchData } = req.body;
    
    const insights = aiAnalyzer.generateMissionInsights(launchData);
    
    res.json({
      success: true,
      insights,
      timestamp: new Date().toISOString(),
      aiModel: 'SpaceAI Mission Analyzer v1.0'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/summarize-news', async (req, res) => {
  try {
    const { articles } = req.body;
    
    if (!articles || articles.length === 0) {
      return res.status(400).json({ error: 'News articles are required' });
    }

    const keyWords = ['Mars', 'SpaceX', 'NASA', 'ISS', 'asteroid', 'launch', 'mission', 'space', 'rocket', 'satellite'];
    const wordCounts = {};
    let totalWords = 0;
    
    articles.forEach(article => {
      const text = (article.title + ' ' + (article.description || '')).toLowerCase();
      keyWords.forEach(word => {
        const count = (text.match(new RegExp(word, 'g')) || []).length;
        wordCounts[word] = (wordCounts[word] || 0) + count;
        totalWords += count;
      });
    });

    const trendingTopics = Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word, count]) => ({ topic: word, mentions: count }));

    const topTopic = trendingTopics[0]?.topic || 'space';
    const summary = `Recent space news highlights ${trendingTopics.length} key topics. ${topTopic.charAt(0).toUpperCase() + topTopic.slice(1)} appears to be trending with ${trendingTopics[0]?.mentions || 0} mentions across ${articles.length} articles.`;
    
    res.json({
      success: true,
      summary: {
        text: summary,
        trendingTopics,
        articlesAnalyzed: articles.length,
        keyInsights: [
          `${topTopic} is the most discussed topic`,
          `${articles.length} articles analyzed`,
          `${trendingTopics.length} trending topics identified`
        ]
      },
      timestamp: new Date().toISOString(),
      aiModel: 'SpaceAI News Analyzer v1.0'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/classify-space-object', async (req, res) => {
  try {
    const { objectData } = req.body;
    
    if (!objectData) {
      return res.status(400).json({ error: 'Space object data is required' });
    }
    
    let classification = 'Unknown';
    let confidence = 0.5;
    let characteristics = [];

    if (objectData.name && objectData.name.toLowerCase().includes('asteroid')) {
      classification = 'Asteroid';
      confidence = 0.9;
      characteristics = ['Rocky composition', 'Irregular shape', 'Orbits Sun'];
    } else if (objectData.estimated_diameter) {
      const diameter = objectData.estimated_diameter.kilometers?.estimated_diameter_max || 0;
      if (diameter > 100) {
        classification = 'Large Asteroid';
        confidence = 0.85;
        characteristics = ['Significant size', 'Potential impact risk', 'Trackable orbit'];
      } else if (diameter > 1) {
        classification = 'Medium Asteroid';
        confidence = 0.8;
        characteristics = ['Moderate size', 'Regular monitoring', 'Stable orbit'];
      } else {
        classification = 'Small Asteroid';
        confidence = 0.75;
        characteristics = ['Small size', 'Low impact risk', 'Frequent occurrence'];
      }
    }
    
    res.json({
      success: true,
      classification: {
        type: classification,
        confidence,
        characteristics,
        analysis: `Based on available data, this object is classified as a ${classification} with ${(confidence * 100).toFixed(0)}% confidence.`
      },
      timestamp: new Date().toISOString(),
      aiModel: 'SpaceAI Object Classifier v1.0'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
