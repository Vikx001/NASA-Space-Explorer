import React, { useState, useEffect, useRef, useCallback } from "react";
import Globe from "react-globe.gl";
import { motion } from "framer-motion";
import {
  FaSatelliteDish,
  FaUserAstronaut,
  FaGlobe,
  FaLockOpen,
  FaVideo,
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaSpinner
} from "react-icons/fa";
import apiClient from "../../utils/apiClient";

const ISSTracker = () => {
  const globeRef = useRef();
  const locationTimeoutRef = useRef();
  const [position, setPosition] = useState(null);
  const [trajectory, setTrajectory] = useState([]);
  const [placeName, setPlaceName] = useState("");
  const [astronauts, setAstronauts] = useState([]);
  const [followISS, setFollowISS] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showTrajectory, setShowTrajectory] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [globeSize, setGlobeSize] = useState(600);
  const [issSpeed, setIssSpeed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pointsData, setPointsData] = useState([]);
  const altitude = 408;
  const orbitPeriod = 92.68;

  const textures = {
    night: "//unpkg.com/three-globe/example/img/earth-night.jpg",
    day: "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
  };
  const [currentTexture, setCurrentTexture] = useState(textures.night);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchLocationName = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await res.json();
      const location = data.city || data.locality || data.countryName || data.ocean || "Ocean";
      setPlaceName(location);
    } catch {
      const latDir = lat >= 0 ? "N" : "S";
      const lngDir = lng >= 0 ? "E" : "W";
      setPlaceName(`${Math.abs(lat).toFixed(1)}°${latDir}, ${Math.abs(lng).toFixed(1)}°${lngDir}`);
    }
  };

  const fetchAstronauts = async () => {
    try {
      const data = await apiClient.iss.getAstronauts();
      setAstronauts(data.people.filter((p) => p.craft === "ISS"));
    } catch (err) {
      console.error("Astronauts fetch failed:", err);
    }
  };

  const fetchPosition = useCallback(async () => {
    try {
      const data = await apiClient.iss.getPosition();
      const lat = parseFloat(data.iss_position.latitude);
      const lng = parseFloat(data.iss_position.longitude);
      const timestamp = data.timestamp || Date.now() / 1000;

      // Calculate speed if we have previous position
      if (position && trajectory.length > 0) {
        const last = trajectory[trajectory.length - 1];
        const dist = calculateDistance(last.lat, last.lng, lat, lng);
        const speed = (dist / 2) * 3.6; // Convert to km/h
        setIssSpeed(speed);
      }

      const newPos = { lat, lng, timestamp };
      setPosition(newPos);
      setTrajectory((prev) => [...prev.slice(-50), newPos]);

      // Update the points data for the globe
      const newPointsData = [{
        lat,
        lng,
        size: 2,
        color: "#ff6b35"
      }];
      setPointsData(newPointsData);

      // Update globe view if following ISS
      if (followISS && globeRef.current) {
        globeRef.current.pointOfView({ lat, lng, altitude: 2 }, 500);
      }

      // Debounced location fetching
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
      locationTimeoutRef.current = setTimeout(() => {
        fetchLocationName(lat, lng);
      }, 1000);

      setLoading(false);
    } catch (err) {
      console.error("ISS fetch failed:", err);
      setLoading(false);
    }
  }, [position, followISS, trajectory]);

  useEffect(() => {
    fetchAstronauts();
    fetchPosition();
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(fetchPosition, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, fetchPosition]);

  const arcsData = trajectory.length > 1
    ? trajectory.slice(1).map((pos, i) => {
        const start = trajectory[i];
        const total = trajectory.length - 1;
        const progress = i / total;
        return {
          startLat: start.lat,
          startLng: start.lng,
          endLat: pos.lat,
          endLng: pos.lng,
          color: `rgba(${Math.floor(255 * progress)}, ${Math.floor(100 + 155 * progress)}, 255, ${0.7 + progress * 0.3})`,
          width: 1.5 + progress * 3,
          altitude: 0.02 + progress * 0.03
        };
      })
    : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 p-6">
        <motion.h2
          className="text-4xl font-bold mb-8 text-center"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ISS Real-Time Tracker
        </motion.h2>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-blue-400">
              <FaSatelliteDish className="text-2xl" />
              Current Position
            </h3>
            {loading ? (
              <div className="flex items-center gap-2 text-gray-400">
                <FaSpinner className="animate-spin" />
                Loading position...
              </div>
            ) : position ? (
              <div className="space-y-2">
                <p className="text-gray-300"><span className="font-semibold text-white">Latitude:</span> {position.lat.toFixed(4)}°</p>
                <p className="text-gray-300"><span className="font-semibold text-white">Longitude:</span> {position.lng.toFixed(4)}°</p>
                <p className="text-gray-300"><span className="font-semibold text-white">Speed:</span> {issSpeed.toFixed(1)} km/h</p>
                <p className="text-gray-300"><span className="font-semibold text-white">Altitude:</span> {altitude} km</p>
                <p className="text-gray-300"><span className="font-semibold text-white">Orbit Period:</span> {orbitPeriod} min</p>
                <p className="text-gray-300"><span className="font-semibold text-white">Over:</span> {placeName || "Loading..."}</p>
              </div>
            ) : (
              <p className="text-gray-400">No position data</p>
            )}
          </motion.div>

          <motion.div
            className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-green-400">
              <FaUserAstronaut className="text-2xl" />
              Crew Aboard ISS
            </h3>
            {astronauts.length > 0 ? (
              <div className="space-y-2">
                {astronauts.map((astro, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    {astro.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-400">
                <FaSpinner className="animate-spin" />
                Loading crew...
              </div>
            )}
          </motion.div>

          <motion.div
            className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-purple-400">
              <FaGlobe className="text-2xl" />
              Controls
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isPlaying
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                onClick={() => setCurrentTexture(prev => prev === textures.night ? textures.day : textures.night)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              >
                <FaGlobe />
                {currentTexture === textures.night ? "Day" : "Night"}
              </button>

              <button
                onClick={() => setFollowISS((f) => !f)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  followISS
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                <FaLockOpen />
                {followISS ? "Unlock" : "Follow"}
              </button>

              <button
                onClick={() => setShowTrajectory((s) => !s)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  showTrajectory
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                Trail {showTrajectory ? "On" : "Off"}
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
                Fullscreen
              </button>

              <a
                href="https://www.nasa.gov/live"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
              >
                <FaVideo />
                Live Feed
              </a>
            </div>
          </motion.div>
        </div>

        {/* Globe Container */}
        <motion.div
          className={`rounded-xl overflow-hidden border border-gray-700/50 shadow-2xl transition-all duration-500 ${
            isFullscreen ? "fixed inset-4 z-50 bg-black" : "mx-auto max-w-5xl"
          }`}
          style={{ height: isFullscreen ? "calc(100vh - 2rem)" : `${globeSize}px` }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Globe
            ref={globeRef}
            globeImageUrl={currentTexture}
            backgroundColor="rgba(0,0,0,0.1)"
            width={isFullscreen ? window.innerWidth - 32 : 800}
            height={isFullscreen ? window.innerHeight - 32 : globeSize}
            pointsData={pointsData}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointAltitude={0.05}
            pointRadius={2}
            arcsData={showTrajectory ? arcsData : []}
            arcStartLat="startLat"
            arcStartLng="startLng"
            arcEndLat="endLat"
            arcEndLng="endLng"
            arcColor="color"
            arcStroke="width"
            arcAltitude="altitude"
            atmosphereColor="#00d4ff"
            atmosphereAltitude={0.15}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ISSTracker;