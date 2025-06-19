const express = require('express');
const axios = require('axios');
const router = express.Router();

// Helper function to handle external requests
const makeExternalRequest = async (url, options = {}) => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      ...options
    });
    return response.data;
  } catch (error) {
    console.error(`External API Error for ${url}:`, error.message);
    throw new Error(`Failed to fetch data from external source: ${error.message}`);
  }
};

// Static data for observatories
const observatories = [
  {
    name: "Arecibo Observatory (Defunct)",
    lat: 18.344167,
    lng: -66.752778,
    info: "One of the world's largest radio telescopes, used for radio astronomy, atmospheric science, and radar observations. Collapsed in 2020.",
    image: "/api/external/images/arecibo"
  },
  {
    name: "Mauna Kea Observatories",
    lat: 19.8206,
    lng: -155.4681,
    info: "Cluster of astronomical observatories at the summit of Mauna Kea, Hawaii. Hosts some of the world's largest optical/infrared telescopes.",
    image: "/api/external/images/mauna-kea"
  },
  {
    name: "Very Large Telescope (VLT)",
    lat: -24.627,
    lng: -70.404,
    info: "Operated by ESO, located in the Atacama Desert, Chile. One of the most productive ground-based telescope facilities.",
    image: "/api/external/images/vlt"
  },
  {
    name: "Green Bank Telescope",
    lat: 38.4331,
    lng: -79.8398,
    info: "World's largest fully steerable radio telescope. Located in the National Radio Quiet Zone, USA.",
    image: "/api/external/images/green-bank"
  },
  {
    name: "Royal Observatory, Greenwich",
    lat: 51.4769,
    lng: 0.0,
    info: "Historic observatory in London, UK. Established the Prime Meridian and Greenwich Mean Time (GMT).",
    image: "/api/external/images/greenwich"
  }
];

// Static data for space timeline events
const timelineEvents = [
  {
    date: "1957-10-04",
    title: "Sputnik 1 Launched",
    description: "The Soviet Union launched the first artificial satellite, marking the dawn of the space age.",
    details: "Sputnik 1, weighing 183 pounds, orbited Earth every 96.2 minutes at an altitude of 142-588 miles. Its radio signals could be heard by amateur radio operators worldwide, proving that space exploration was possible.",
    image: "/api/external/images/sputnik",
    category: "Satellite",
    significance: "First artificial satellite in orbit"
  },
  {
    date: "1961-04-12",
    title: "Yuri Gagarin - First Human in Space",
    description: "Soviet cosmonaut Yuri Gagarin became the first human to journey into outer space.",
    details: "Gagarin completed one orbit of Earth in Vostok 1, lasting 108 minutes. His famous words 'Poyekhali!' (Let's go!) marked humanity's first step into the cosmos.",
    image: "/api/external/images/gagarin",
    category: "Human Spaceflight",
    significance: "First human in space"
  },
  {
    date: "1962-02-20",
    title: "John Glenn Orbits Earth",
    description: "John Glenn became the first American to orbit Earth aboard Friendship 7.",
    details: "Glenn completed three orbits in 4 hours and 55 minutes, proving American capability in human spaceflight and paving the way for the Apollo program.",
    image: "/api/external/images/glenn",
    category: "Human Spaceflight",
    significance: "First American to orbit Earth"
  },
  {
    date: "1965-03-18",
    title: "First Spacewalk",
    description: "Soviet cosmonaut Alexei Leonov performed the first extravehicular activity (EVA).",
    details: "Leonov spent 12 minutes outside Voskhod 2, tethered by a 5.35-meter cord. This demonstrated that humans could work outside spacecraft, crucial for future missions.",
    image: "/api/external/images/leonov",
    category: "Human Spaceflight",
    significance: "First spacewalk in history"
  },
  {
    date: "1969-07-20",
    title: "Apollo 11 Moon Landing",
    description: "Apollo 11 landed on the Moon, marking humanity's greatest achievement in space exploration.",
    details: "Neil Armstrong and Buzz Aldrin became the first humans to walk on the lunar surface while Michael Collins orbited above. Armstrong's words 'That's one small step for man, one giant leap for mankind' echoed worldwide.",
    image: "/api/external/images/apollo11",
    category: "Lunar Exploration",
    significance: "First humans on the Moon"
  },
  {
    date: "1971-04-19",
    title: "Salyut 1 - First Space Station",
    description: "The Soviet Union launched the world's first space station into low Earth orbit.",
    details: "Salyut 1 operated for 175 days, proving that long-duration spaceflight was possible. Though the first crew mission was unsuccessful, it laid groundwork for future space stations.",
    image: "/api/external/images/salyut1",
    category: "Space Station",
    significance: "First space station in orbit"
  },
  {
    date: "1977-09-05",
    title: "Voyager 1 Launched",
    description: "NASA launched Voyager 1 on an unprecedented journey to explore the outer solar system.",
    details: "Voyager 1 has traveled over 14 billion miles from Earth, becoming the first human-made object to enter interstellar space in 2012. It continues to send data from beyond our solar system.",
    image: "/api/external/images/voyager1",
    category: "Deep Space",
    significance: "First probe to reach interstellar space"
  },
  {
    date: "1981-04-12",
    title: "First Space Shuttle Launch",
    description: "Space Shuttle Columbia launched on STS-1, beginning the era of reusable spacecraft.",
    details: "The Space Shuttle program revolutionized space access with 135 missions over 30 years, building the ISS, deploying Hubble, and advancing scientific research.",
    image: "/api/external/images/shuttle",
    category: "Space Transportation",
    significance: "First reusable orbital spacecraft"
  },
  {
    date: "1990-04-24",
    title: "Hubble Space Telescope Deployed",
    description: "The Hubble Space Telescope was deployed, revolutionizing our understanding of the universe.",
    details: "Despite initial mirror problems, Hubble has provided unprecedented views of distant galaxies, nebulae, and cosmic phenomena for over 30 years, fundamentally changing astronomy.",
    image: "/api/external/images/hubble",
    category: "Space Observatory",
    significance: "Revolutionary space-based telescope"
  },
  {
    date: "1998-11-20",
    title: "International Space Station Assembly Begins",
    description: "The ISS began assembly in low Earth orbit, symbolizing unprecedented international collaboration.",
    details: "The largest human-made object in space, the ISS has hosted over 270 astronauts from 19 countries, conducting thousands of experiments and advancing scientific knowledge.",
    image: "/api/external/images/iss",
    category: "Space Station",
    significance: "Largest international space project"
  },
  {
    date: "2003-01-04",
    title: "Spirit Rover Lands on Mars",
    description: "NASA's Spirit rover successfully landed on Mars, beginning a new era of Martian exploration.",
    details: "Originally planned for 90 days, Spirit operated for over 6 years, discovering evidence of past water activity and paving the way for future Mars missions.",
    image: "/api/external/images/spirit",
    category: "Mars Exploration",
    significance: "Long-duration Mars surface exploration"
  },
  {
    date: "2012-08-05",
    title: "Curiosity Rover Lands on Mars",
    description: "NASA's Curiosity rover landed on Mars using the innovative 'sky crane' landing system.",
    details: "Curiosity has been exploring Gale Crater for over a decade, discovering organic compounds and evidence that Mars could have supported microbial life billions of years ago.",
    image: "/api/external/images/curiosity",
    category: "Mars Exploration",
    significance: "Advanced Mars geological laboratory"
  },
  {
    date: "2020-05-30",
    title: "SpaceX Crew Dragon First Crewed Flight",
    description: "SpaceX's Crew Dragon successfully transported NASA astronauts to the ISS.",
    details: "Demo-2 mission marked the return of human spaceflight capability to the United States and the first commercial crew mission, opening a new era of public-private space partnerships.",
    image: "/api/external/images/crew-dragon",
    category: "Commercial Spaceflight",
    significance: "First commercial crew mission"
  },
  {
    date: "2021-02-18",
    title: "Perseverance Rover Lands on Mars",
    description: "NASA's Perseverance rover landed in Jezero Crater to search for signs of ancient microbial life.",
    details: "Equipped with the Ingenuity helicopter, Perseverance is collecting samples for future return to Earth and producing oxygen from the Martian atmosphere.",
    image: "/api/external/images/perseverance",
    category: "Mars Exploration",
    significance: "Mars sample collection mission"
  },
  {
    date: "2021-09-15",
    title: "Inspiration4 - First All-Civilian Orbital Mission",
    description: "SpaceX launched the first all-civilian crew to orbit Earth for three days.",
    details: "Led by Jared Isaacman, this mission demonstrated that space travel is becoming accessible to non-professional astronauts, raising funds for St. Jude Children's Research Hospital.",
    image: "/api/external/images/inspiration4",
    category: "Commercial Spaceflight",
    significance: "Democratization of space access"
  },
  {
    date: "2021-12-25",
    title: "James Webb Space Telescope Launched",
    description: "The most powerful space telescope ever built was launched to observe the early universe.",
    details: "JWST observes in infrared light, allowing it to see through cosmic dust and study the formation of the first galaxies, stars, and planetary systems.",
    image: "/api/external/images/jwst",
    category: "Space Observatory",
    significance: "Most advanced space telescope"
  },
  {
    date: "2022-09-26",
    title: "DART Mission Asteroid Impact",
    description: "NASA's DART spacecraft successfully impacted asteroid Dimorphos, changing its orbit.",
    details: "This planetary defense test proved that humanity can potentially deflect dangerous asteroids, providing a crucial capability for protecting Earth from cosmic threats.",
    image: "/api/external/images/dart",
    category: "Planetary Defense",
    significance: "First successful asteroid deflection"
  },
  {
    date: "2024-11-15",
    title: "Artemis II Lunar Flyby (Planned)",
    description: "NASA's Artemis II will be the first crewed mission around the Moon since Apollo 17.",
    details: "Four astronauts will test the Orion spacecraft during a 10-day lunar flyby mission, preparing for the Artemis III lunar landing and establishing a sustainable lunar presence.",
    image: "/api/external/images/artemis2",
    category: "Lunar Exploration",
    significance: "Return to lunar exploration"
  },
  {
    date: "2026-01-01",
    title: "Artemis III Lunar Landing (Planned)",
    description: "NASA plans to land the first woman and next man on the Moon's south pole.",
    details: "This mission will establish a lunar base camp and begin regular lunar operations, including the search for water ice and preparation for Mars missions.",
    image: "/api/external/images/artemis3",
    category: "Lunar Exploration",
    significance: "Sustainable lunar presence"
  },
  {
    date: "2030-01-01",
    title: "Mars Sample Return Mission (Planned)",
    description: "NASA and ESA plan to return samples collected by Perseverance rover to Earth.",
    details: "This complex multi-mission campaign will be the first to return samples from another planet, potentially providing definitive evidence of past or present life on Mars.",
    image: "/api/external/images/mars-sample-return",
    category: "Mars Exploration",
    significance: "First Mars sample return"
  }
];

// Get observatories data
router.get('/observatories', (req, res) => {
  try {
    res.json(observatories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get timeline events
router.get('/timeline', (req, res) => {
  try {
    res.json(timelineEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Proxy for external images to avoid CORS issues
router.get('/images/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    const imageUrls = {
      // Observatory images
      'arecibo': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Arecibo_Observatory_Aerial_View.jpg',
      'mauna-kea': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Mauna_Kea_observatories.jpg',
      'vlt': 'https://upload.wikimedia.org/wikipedia/commons/6/64/Very_Large_Telescope.jpg',
      'green-bank': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Green_Bank_Telescope.jpg',
      'greenwich': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Royal_Observatory_Greenwich.jpg',

      // Timeline event images
      'sputnik': 'https://upload.wikimedia.org/wikipedia/commons/b/be/Sputnik_asm.jpg',
      'gagarin': 'https://upload.wikimedia.org/wikipedia/commons/6/68/Yuri_Gagarin_in_1963.jpg',
      'glenn': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/John_Glenn_Mercury_Atlas_6.jpg',
      'leonov': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Alexey_Leonov_spacewalk.jpg',
      'apollo11': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Aldrin_Apollo_11_original.jpg',
      'salyut1': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Salyut_1_space_station.jpg',
      'voyager1': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Voyager_1_-_GPN-2003-00027.jpg',
      'shuttle': 'https://upload.wikimedia.org/wikipedia/commons/3/3f/STS-1_launch.jpg',
      'hubble': 'https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg',
      'iss': 'https://upload.wikimedia.org/wikipedia/commons/0/04/International_Space_Station_after_undocking_of_STS-132.jpg',
      'spirit': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Spirit_rover_on_Mars.jpg',
      'curiosity': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Curiosity_Self-Portrait_at_%27Big_Sky%27_Drilling_Site.jpg',
      'crew-dragon': 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Crew_Dragon_Demo-2_approaching_ISS_%28cropped%29.jpg',
      'perseverance': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/PIA24542-Mars2020PerseveranceRover-FirstImages-20210219.jpg',
      'inspiration4': 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Inspiration4_launch.jpg',
      'jwst': 'https://upload.wikimedia.org/wikipedia/commons/1/1c/James_Webb_Space_Telescope_Mirrors_Will_Piece_Together_Cosmic_Puzzles_%28weic1909a%29.jpg',
      'dart': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/DART_spacecraft_model.jpg',
      'artemis2': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Artemis_2_crew_official_portrait.jpg',
      'artemis3': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Artemis_3_mission_concept.jpg',
      'mars-sample-return': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Mars_Sample_Return_mission_concept.jpg',

      // Other images
      'earth-night': '//unpkg.com/three-globe/example/img/earth-night.jpg',
      'earth-day': '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      'asteroid1': 'https://cdn-icons-png.flaticon.com/512/3240/3240524.png',
      'asteroid2': 'https://cdn-icons-png.flaticon.com/512/737/737970.png',
      'asteroid3': 'https://cdn-icons-png.flaticon.com/512/2972/2972817.png',
      'hero-bg': 'https://www.nasa.gov/wp-content/uploads/2025/02/hubble-leda1313424-stsci-01jjadtmj80r1r4w6kk563rw2c.jpg',
      'mission-bg': 'https://www.nasa.gov/wp-content/uploads/2024/11/iss072e097437orig.jpg'
    };

    const imageUrl = imageUrls[type];
    if (!imageUrl) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // For external URLs, redirect to avoid CORS issues
    res.redirect(imageUrl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get asteroid images
router.get('/asteroid-images', (req, res) => {
  try {
    const images = [
      '/api/external/images/asteroid1',
      '/api/external/images/asteroid2',
      '/api/external/images/asteroid3'
    ];
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get globe textures
router.get('/globe-textures', (req, res) => {
  try {
    const textures = {
      night: '/api/external/images/earth-night',
      day: '/api/external/images/earth-day'
    };
    res.json(textures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// External links for reference (not proxied)
router.get('/links', (req, res) => {
  try {
    const links = {
      stellarium: 'https://stellarium-web.org/',
      nasaEyes: 'https://eyes.nasa.gov/apps/solar-system/#/home',
      issLiveStream: 'https://www.ustream.tv/channel/live-iss-stream',
      nasaEyesInfo: 'https://eyes.nasa.gov/'
    };
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
