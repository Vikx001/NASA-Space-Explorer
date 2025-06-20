import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Globe from "react-globe.gl";
import { FaSatelliteDish, FaUserAstronaut, FaGlobe, FaLockOpen, FaVideo, FaPlay, FaPause, FaExpand, FaCompress } from "react-icons/fa";
import apiClient from "../../utils/apiClient";

const ISSTracker = () => {
  const [position, setPosition] = useState(null);
  const [trajectory, setTrajectory] = useState([]);
  const [placeName, setPlaceName] = useState("");
  const [astronauts, setAstronauts] = useState([]);
  const [globeTextures, setGlobeTextures] = useState({
    night: "//unpkg.com/three-globe/example/img/earth-night.jpg",
    day: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
  });
  const [currentTexture, setCurrentTexture] = useState("//unpkg.com/three-globe/example/img/earth-night.jpg");
  const [followISS, setFollowISS] = useState(true);
  const [externalLinks, setExternalLinks] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTrajectory, setShowTrajectory] = useState(true);
  const [trailStyle, setTrailStyle] = useState("futuristic"); // "classic", "futuristic", "neon", "plasma"
  const [globeSize, setGlobeSize] = useState(600);
  const [issSpeed, setIssSpeed] = useState(0);
  const [altitude] = useState(408); // Average ISS altitude in km
  const [orbitPeriod] = useState(92.68); // ISS orbital period in minutes

  const globeRef = useRef();



  // Initialize globe textures and external links
  useEffect(() => {
    const initializeResources = () => {
      // Use direct URLs for textures
      const fallbackTextures = {
        night: '//unpkg.com/three-globe/example/img/earth-night.jpg',
        day: '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
      };
      setGlobeTextures(fallbackTextures);
      setCurrentTexture(fallbackTextures.night);

      // Set default external links
      const defaultLinks = {
        nasa_iss: 'https://www.nasa.gov/mission_pages/station/main/index.html',
        iss_tracker: 'https://spotthestation.nasa.gov/',
        live_stream: 'https://www.nasa.gov/live'
      };
      setExternalLinks(defaultLinks);
    };
    initializeResources();
  }, []);

  const fetchPosition = useCallback(async () => {
    try {
      const data = await apiClient.iss.getPosition();
      console.log('ISS Position Data:', data); // Debug log
      const lat = parseFloat(data.iss_position.latitude);
      const lng = parseFloat(data.iss_position.longitude);
      const timestamp = data.timestamp;

      // Calculate speed if we have previous position
      if (position && trajectory.length > 0) {
        const prevPos = trajectory[trajectory.length - 1];
        const distance = calculateDistance(prevPos.lat, prevPos.lng, lat, lng);
        const timeElapsed = 5; // 5 seconds between updates
        const speed = (distance / timeElapsed) * 3.6; // Convert m/s to km/h
        setIssSpeed(speed);
      }

      const newPosition = { lat, lng, timestamp };
      setPosition(newPosition);
      setTrajectory((prev) => [...prev.slice(-50), newPosition]); // Keep more trajectory points
      fetchLocationName(lat, lng);

      if (followISS && globeRef.current) {
        globeRef.current.pointOfView({ lat, lng, altitude: 2 }, 1000);
      }
    } catch (err) {
      console.error("Failed to fetch ISS position", err);
    }
  }, [position, trajectory, followISS]);

  // Calculate distance between two points on Earth
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchLocationName = async (lat, lng) => {
    try {
      // Try to get location name from reverse geocoding
      const response = await fetch(`/api/iss/location?lat=${lat}&lon=${lng}`);
      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          // Extract meaningful location info
          const parts = data.display_name.split(',');
          const location = parts.slice(0, 3).join(', ').trim();
          setPlaceName(location || `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(1)}°${lng >= 0 ? 'E' : 'W'}`);
        } else {
          throw new Error('No location data');
        }
      } else {
        throw new Error('Geocoding failed');
      }
    } catch {
      // Fallback to coordinates
      const latDir = lat >= 0 ? 'N' : 'S';
      const lngDir = lng >= 0 ? 'E' : 'W';
      setPlaceName(`${Math.abs(lat).toFixed(1)}°${latDir}, ${Math.abs(lng).toFixed(1)}°${lngDir}`);
    }
  };

  const fetchAstronauts = async () => {
    try {
      const data = await apiClient.iss.getAstronauts();
      setAstronauts(data.people.filter((p) => p.craft === "ISS"));
    } catch (err) {
      console.error("Failed to fetch astronauts", err);
    }
  };

  // Control functions
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setGlobeSize(isFullscreen ? 600 : 800);
  };

  const toggleTrajectory = () => {
    setShowTrajectory(!showTrajectory);
  };

  const cycleTrailStyle = () => {
    const styles = ["classic", "futuristic", "neon", "plasma"];
    const currentIndex = styles.indexOf(trailStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setTrailStyle(styles[nextIndex]);
  };

  const resetView = () => {
    if (globeRef.current && position) {
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2 }, 1000);
    }
  };



  useEffect(() => {
    fetchPosition();
    fetchAstronauts();
  }, [fetchPosition]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(fetchPosition, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, fetchPosition]);

  const toggleTexture = () => {
    if (globeTextures.night && globeTextures.day) {
      setCurrentTexture(prev => 
        prev === globeTextures.night ? globeTextures.day : globeTextures.night
      );
    }
  };

  // Enhanced trajectory data with different visual styles - MADE MORE VISIBLE
  const getTrailColor = (index, total) => {
    const progress = index / total;
    switch (trailStyle) {
      case "classic":
        return `rgba(0, 212, 255, ${0.6 + progress * 0.4})`; // More opaque
      case "futuristic":
        return `rgba(${Math.floor(255 * progress)}, ${Math.floor(100 + 155 * progress)}, 255, ${0.7 + progress * 0.3})`;
      case "neon":
        return `rgba(${Math.floor(255 * (1 - progress))}, 255, ${Math.floor(255 * progress)}, ${0.8 + progress * 0.2})`;
      case "plasma":
        return `rgba(255, ${Math.floor(100 * (1 - progress))}, ${Math.floor(255 * progress)}, ${0.8 + progress * 0.2})`;
      default:
        return `rgba(255, 107, 53, ${0.8 + progress * 0.2})`; // Bright orange, very visible
    }
  };

  const getTrailWidth = (index, total) => {
    const progress = index / total;
    switch (trailStyle) {
      case "classic":
        return 2 + progress * 3; // Thicker
      case "futuristic":
        return 1.5 + progress * 4;
      case "neon":
        return 3 + progress * 3;
      case "plasma":
        return 2.5 + progress * 3.5;
      default:
        return 3 + progress * 2; // Much thicker default
    }
  };

  const arcsData = trajectory.length > 1 ? trajectory.slice(1).map((pos, i) => {
    const start = trajectory[i];
    const total = trajectory.length - 1;
    return {
      startLat: start.lat,
      startLng: start.lng,
      endLat: pos.lat,
      endLng: pos.lng,
      color: getTrailColor(i, total),
      width: getTrailWidth(i, total),
      altitude: trailStyle === "futuristic" ? 0.02 + (i / total) * 0.03 : 0.02,
    };
  }) : [];

  // Debug logging for trail
  console.log('Trail Debug:', {
    trajectoryLength: trajectory.length,
    showTrajectory,
    arcsDataLength: arcsData.length,
    trailStyle,
    firstArc: arcsData[0],
    lastArc: arcsData[arcsData.length - 1]
  });



  return (
    <div className="p-6 bg-black text-white min-h-screen font-nasa relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:20px_20px] animate-pulse z-0" />
      <motion.h2 className="text-4xl font-bold mb-6 text-center z-10 relative">
        🛰️ ISS Real-Time Tracker
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-6 mb-6 z-10 relative">
        <div className="bg-gradient-to-br from-[#0d1b2a] to-[#1b263b] p-6 rounded-2xl shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-white">
            <FaSatelliteDish className="text-blue-400" /> Current Position
          </h3>
          {position && (
            <>
              <p className="text-sm text-gray-300 mb-2">
                Latitude: <span className="text-blue-400 font-mono">{position.lat.toFixed(6)}°</span>
              </p>
              <p className="text-sm text-gray-300 mb-2">
                Longitude: <span className="text-blue-400 font-mono">{position.lng.toFixed(6)}°</span>
              </p>
              <p className="text-sm text-gray-300 mb-2">
                Speed: <span className="text-green-400 font-mono">{issSpeed.toFixed(1)} km/h</span>
              </p>
              <p className="text-sm text-gray-300 mb-2">
                Altitude: <span className="text-purple-400 font-mono">{altitude} km</span>
              </p>
              <p className="text-sm text-gray-300 mb-2">
                Orbit Period: <span className="text-orange-400 font-mono">{orbitPeriod} min</span>
              </p>
              <p className="text-sm text-gray-300">
                Location: <span className="text-cyan-300 italic">{placeName}</span>
              </p>
            </>
          )}
        </div>

        <div className="bg-gradient-to-br from-[#1b263b] to-[#0d1b2a] p-6 rounded-2xl shadow-xl border border-gray-700">
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <FaUserAstronaut className="text-blue-400" /> Crew Aboard ISS
          </h4>
          <div className="space-y-1">
            {astronauts.map((astro, idx) => (
              <div key={idx} className="text-sm text-gray-300">
                {astro.name}
              </div>
            ))}
          </div>
          {astronauts.length === 0 && (
            <p className="text-gray-400 text-sm">Loading crew information...</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-[#1b263b] to-[#0d1b2a] p-6 rounded-2xl shadow-xl border border-gray-700">
          <h4 className="text-xl font-bold text-white mb-4">Controls</h4>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={togglePlayPause}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-white text-sm ${
                isPlaying ? 'bg-slate-600 hover:bg-slate-700' : 'bg-slate-500 hover:bg-slate-600'
              }`}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={toggleTexture}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition text-white text-sm"
            >
              <FaGlobe /> Texture
            </button>

            <button
              onClick={() => setFollowISS((prev) => !prev)}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-white text-sm ${
                followISS ? 'bg-slate-700 hover:bg-slate-800' : 'bg-slate-500 hover:bg-slate-600'
              }`}
            >
              <FaLockOpen /> {followISS ? "Unlock" : "Follow"}
            </button>

            <button
              onClick={toggleTrajectory}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-white text-sm ${
                showTrajectory ? 'bg-slate-600 hover:bg-slate-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              Trail
            </button>

            <button
              onClick={cycleTrailStyle}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition text-white text-sm"
              title={`Current: ${trailStyle}`}
            >
              {trailStyle.charAt(0).toUpperCase() + trailStyle.slice(1)}
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition text-white text-sm"
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
              {isFullscreen ? 'Exit' : 'Full'}
            </button>

            <button
              onClick={resetView}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition text-white text-sm"
            >
              Reset
            </button>
          </div>



          {externalLinks.live_stream && (
            <a
              href={externalLinks.live_stream}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-5 py-3 mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-semibold"
            >
              <FaVideo /> Watch ISS Live Feed
            </a>
          )}
        </div>
      </div>

      <div
        className={`border border-gray-700 rounded-xl overflow-hidden relative z-10 shadow-lg transition-all duration-500 ${
          isFullscreen ? 'fixed inset-4 z-50 bg-black' : ''
        }`}
        style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : `${globeSize}px` }}
      >
        {!currentTexture && (
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-white">Loading Globe...</p>
            </div>
          </div>
        )}

        {currentTexture && (
          <Globe
            ref={globeRef}
            globeImageUrl={currentTexture}
            backgroundColor="rgba(0,0,0,0.1)"
            width={isFullscreen ? window.innerWidth - 32 : 800}
            height={isFullscreen ? window.innerHeight - 32 : globeSize}

            // ISS Position Point
            pointsData={position ? [{
              lat: position.lat,
              lng: position.lng,
              size: 2,
              color: "#ff6b35"
            }] : []}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointAltitude={0.05}
            pointRadius={2}

            // ISS Trail - SIMPLIFIED
            arcsData={arcsData}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcStroke="width"
            arcAltitude={0.02}

            // Basic atmosphere
            atmosphereColor="#00d4ff"
            atmosphereAltitude={0.15}

            // Enable interaction
            enablePointerInteraction={true}
          />
        )}

        {/* Fullscreen overlay controls */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-60">
            <button
              onClick={toggleFullscreen}
              className="bg-black bg-opacity-70 text-white p-3 rounded-full hover:bg-opacity-90 transition"
            >
              <FaCompress size={20} />
            </button>
          </div>
        )}

        {/* ISS Info Overlay */}
        {position && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg backdrop-blur-sm">
            <h4 className="font-bold text-sm mb-2">ISS Live Data</h4>
            <p className="text-xs">Speed: {issSpeed.toFixed(1)} km/h</p>
            <p className="text-xs">Altitude: {altitude} km</p>
            <p className="text-xs">Trajectory Points: {trajectory.length}</p>
            <p className="text-xs">Trail Style: <span className="text-blue-300">{trailStyle}</span></p>
            {showTrajectory && (
              <p className="text-xs text-green-300">Enhanced Trail Active</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ISSTracker;
