const express = require('express');
const axios = require('axios');
const router = express.Router();

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

router.get('/apod', async (req, res) => {
  try {
    const { date, count, start_date, end_date } = req.query;
    const params = {};
    
    if (date) params.date = date;
    if (count) params.count = parseInt(count);
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;

    const data = await makeNASARequest('/planetary/apod', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/mars-photos/:rover', async (req, res) => {
  try {
    const { rover } = req.params;
    const { sol, earth_date, camera, page } = req.query;
    
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
});

router.get('/neo/feed', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const params = {};
    
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;

    const data = await makeNASARequest('/neo/rest/v1/feed', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NEO Lookup by ID
router.get('/neo/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await makeNASARequest(`/neo/rest/v1/neo/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get asteroid image by name
router.get('/neo/image/:name', async (req, res) => {
  try {
    const { name } = req.params;

    // Clean the asteroid name (remove parentheses and numbers)
    const cleanName = name.replace(/^\(\d+\)\s*/, '').replace(/\s*\(\d+.*?\)/, '').trim();
    const asteroidNumber = name.match(/^\((\d+)\)/)?.[1];

    // Comprehensive database of real asteroid images
    const asteroidDatabase = {
      // Famous asteroids with actual spacecraft images
      'Ceres': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29_%28cropped%29.jpg',
        description: 'Dwarf planet Ceres photographed by NASA\'s Dawn spacecraft',
        source: 'NASA/JPL-Caltech/UCLA/MPS/DLR/IDA'
      },
      'Vesta': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Vesta_in_natural_color.jpg',
        description: 'Asteroid Vesta in natural color, imaged by Dawn spacecraft',
        source: 'NASA/JPL-Caltech/UCLA/MPS/DLR/IDA'
      },
      'Bennu': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Bennu_mosaic_OSIRIS-REx.jpg',
        description: 'Near-Earth asteroid Bennu photographed by OSIRIS-REx spacecraft',
        source: 'NASA/Goddard/University of Arizona'
      },
      'Ryugu': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Ryugu_true_color.jpg',
        description: 'Asteroid Ryugu in true color, photographed by Hayabusa2',
        source: 'JAXA, University of Tokyo, Kochi University, Rikkyo University, Nagoya University, Chiba Institute of Technology, Meiji University, University of Aizu, AIST'
      },
      'Itokawa': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Itokawa8_hayabusa_1210.jpg',
        description: 'Near-Earth asteroid Itokawa photographed by Hayabusa spacecraft',
        source: 'JAXA'
      },
      'Eros': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/433eros.jpg',
        description: 'Near-Earth asteroid 433 Eros photographed by NEAR Shoemaker',
        source: 'NASA/Johns Hopkins University Applied Physics Laboratory'
      },
      'Gaspra': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/951_Gaspra.jpg',
        description: 'Asteroid 951 Gaspra photographed by Galileo spacecraft',
        source: 'NASA/JPL'
      },
      'Ida': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/243_ida.jpg',
        description: 'Asteroid 243 Ida and its moon Dactyl, photographed by Galileo',
        source: 'NASA/JPL'
      },
      'Mathilde': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/a/af/253_mathilde_%28crop%29.jpg',
        description: 'Asteroid 253 Mathilde photographed by NEAR Shoemaker',
        source: 'NASA/Johns Hopkins University Applied Physics Laboratory'
      },
      'Steins': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Asteroid_2867_Steins.jpg',
        description: 'Asteroid 2867 Steins photographed by Rosetta spacecraft',
        source: 'ESA ©2008 MPS for OSIRIS Team'
      },
      'Lutetia': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/21_Lutetia_from_Rosetta.jpg',
        description: 'Asteroid 21 Lutetia photographed by Rosetta spacecraft',
        source: 'ESA ©2010 MPS for OSIRIS Team'
      },
      'Pallas': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/2_Pallas_Hubble.jpg',
        description: 'Asteroid 2 Pallas imaged by Hubble Space Telescope',
        source: 'NASA/ESA/STScI'
      },
      'Hygiea': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/10_Hygiea_VLT.jpg',
        description: 'Asteroid 10 Hygiea imaged by Very Large Telescope',
        source: 'ESO/P. Vernazza et al./MISTRAL algorithm (ONERA/CNRS)'
      },
      'Apophis': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/99942_Apophis_radar_2012-2013.jpg',
        description: 'Near-Earth asteroid 99942 Apophis radar image',
        source: 'NASA/JPL-Caltech'
      },
      'Toutatis': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/4179_Toutatis.jpg',
        description: 'Near-Earth asteroid 4179 Toutatis radar image',
        source: 'NASA/JPL'
      },
      'Kleopatra': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/216_Kleopatra_VLT.jpg',
        description: 'Asteroid 216 Kleopatra imaged by Very Large Telescope',
        source: 'ESO/Vernazza, Marchis et al./MISTRAL algorithm (ONERA/CNRS)'
      }
    };

    // Check for exact name match first
    let asteroidData = asteroidDatabase[cleanName];

    // If not found, try searching by asteroid number
    if (!asteroidData && asteroidNumber) {
      for (const [key, value] of Object.entries(asteroidDatabase)) {
        if (key.includes(asteroidNumber) || value.description.includes(asteroidNumber)) {
          asteroidData = value;
          break;
        }
      }
    }

    // If we found a specific asteroid image, return it
    if (asteroidData) {
      return res.json({
        url: asteroidData.url,
        title: cleanName,
        description: asteroidData.description,
        source: asteroidData.source
      });
    }

    // Try a more targeted NASA search with better keywords
    try {
      const searchTerms = [
        `asteroid ${cleanName}`,
        `${cleanName} asteroid`,
        `near earth object ${cleanName}`,
        `NEO ${cleanName}`
      ];

      for (const searchTerm of searchTerms) {
        const nasaImageUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(searchTerm)}&media_type=image`;
        const nasaResponse = await axios.get(nasaImageUrl);
        const items = nasaResponse.data.collection.items;

        if (items && items.length > 0) {
          // Filter for actual asteroid-related images
          const asteroidImages = items.filter(item => {
            const title = item.data[0].title?.toLowerCase() || '';
            const description = item.data[0].description?.toLowerCase() || '';

            return (
              (title.includes('asteroid') || description.includes('asteroid') ||
               title.includes('neo') || description.includes('neo') ||
               title.includes('near earth') || description.includes('near earth')) &&
              !title.includes('truck') && !title.includes('vehicle') &&
              !title.includes('building') && !title.includes('facility') &&
              !title.includes('launch') && !title.includes('rocket') &&
              !description.includes('truck') && !description.includes('vehicle')
            );
          });

          if (asteroidImages.length > 0) {
            const bestMatch = asteroidImages[0];
            return res.json({
              url: bestMatch.links[0].href,
              title: bestMatch.data[0].title,
              description: bestMatch.data[0].description,
              source: 'NASA Image Library'
            });
          }
        }
      }
    } catch (nasaError) {
      console.log('NASA Image API search failed, using fallback');
    }

    // Generate realistic asteroid image based on characteristics
    const asteroidType = getAsteroidType(cleanName, asteroidNumber);
    const typeBasedImages = {
      'C-type': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Bennu_mosaic_OSIRIS-REx.jpg',
        description: 'Representative C-type (carbonaceous) asteroid - dark and carbon-rich',
        source: 'NASA/Goddard/University of Arizona (Representative)'
      },
      'S-type': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/433eros.jpg',
        description: 'Representative S-type (silicaceous) asteroid - stony composition',
        source: 'NASA/Johns Hopkins APL (Representative)'
      },
      'M-type': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/2_Pallas_Hubble.jpg',
        description: 'Representative M-type (metallic) asteroid - metal-rich composition',
        source: 'NASA/ESA/STScI (Representative)'
      },
      'V-type': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Vesta_in_natural_color.jpg',
        description: 'Representative V-type (basaltic) asteroid - volcanic composition',
        source: 'NASA/JPL-Caltech/UCLA/MPS/DLR/IDA (Representative)'
      },
      'X-type': {
        url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Itokawa8_hayabusa_1210.jpg',
        description: 'Representative X-type asteroid - mixed composition',
        source: 'JAXA (Representative)'
      }
    };

    const selectedType = typeBasedImages[asteroidType] || typeBasedImages['S-type'];

    res.json({
      url: selectedType.url,
      title: cleanName,
      description: selectedType.description,
      source: selectedType.source
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to determine asteroid type based on name patterns and characteristics
function getAsteroidType(name, asteroidNumber) {
  const nameUpper = name.toUpperCase();
  const num = parseInt(asteroidNumber) || 0;

  // Known asteroid classifications based on actual data
  const knownTypes = {
    // C-type (carbonaceous) - dark, carbon-rich
    'BENNU': 'C-type', 'RYUGU': 'C-type', 'CERES': 'C-type', 'MATHILDE': 'C-type',

    // S-type (silicaceous) - stony, most common
    'EROS': 'S-type', 'GASPRA': 'S-type', 'IDA': 'S-type', 'ITOKAWA': 'S-type',
    'TOUTATIS': 'S-type',

    // M-type (metallic) - metal-rich
    'PSYCHE': 'M-type', 'PALLAS': 'M-type', 'KLEOPATRA': 'M-type',

    // V-type (basaltic) - volcanic origin
    'VESTA': 'V-type',

    // X-type (mixed/unknown)
    'STEINS': 'X-type', 'LUTETIA': 'X-type'
  };

  // Check for exact name match
  for (const [asteroidName, type] of Object.entries(knownTypes)) {
    if (nameUpper.includes(asteroidName)) {
      return type;
    }
  }

  // Statistical classification based on asteroid number ranges
  // This is a rough approximation based on known asteroid belt distributions
  if (num > 0) {
    if (num < 100) {
      // Early discovered asteroids, often larger main belt objects
      return Math.random() < 0.4 ? 'C-type' : 'S-type';
    } else if (num < 1000) {
      // Mix of types, S-type more common
      return Math.random() < 0.6 ? 'S-type' : 'C-type';
    } else if (num > 100000) {
      // Many modern discoveries are NEOs, often S-type
      return Math.random() < 0.7 ? 'S-type' : 'C-type';
    }
  }

  // Default to S-type (most common for NEOs)
  return 'S-type';
}

// Earth Polychromatic Imaging Camera (EPIC)
router.get('/epic/:collection', async (req, res) => {
  try {
    const { collection } = req.params; // natural or enhanced
    const { date } = req.query;
    
    let endpoint = `/EPIC/api/${collection}`;
    if (date) {
      endpoint += `/date/${date}`;
    }

    const data = await makeNASARequest(endpoint);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NASA Image and Video Library Search
router.get('/images/search', async (req, res) => {
  try {
    const { q, media_type, year_start, year_end, page } = req.query;
    
    const searchParams = new URLSearchParams();
    if (q) searchParams.append('q', q);
    if (media_type) searchParams.append('media_type', media_type);
    if (year_start) searchParams.append('year_start', year_start);
    if (year_end) searchParams.append('year_end', year_end);
    if (page) searchParams.append('page', page);

    const response = await axios.get(`https://images-api.nasa.gov/search?${searchParams.toString()}`, {
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exoplanet Archive
router.get('/exoplanets', async (req, res) => {
  try {
    const { table, select, where, order, format } = req.query;
    
    const params = {
      table: table || 'ps', // Default to Planetary Systems table
      select: select || '*',
      format: format || 'json'
    };
    
    if (where) params.where = where;
    if (order) params.order = order;

    const response = await axios.get('https://exoplanetarchive.ipac.caltech.edu/TAP/sync', {
      params,
      timeout: 15000
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
