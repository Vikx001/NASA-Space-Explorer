import React, { useState, useEffect, useRef, useCallback } from "react";
import Globe from "react-globe.gl";
import {
  FaSatelliteDish,
  FaUserAstronaut,
  FaGlobe,
  FaLockOpen,
  FaVideo,
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress
} from "react-icons/fa";
import apiClient from "../../utils/apiClient";

const ISSTracker = () => {
  const globeRef = useRef();
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

      if (position) {
        const last = trajectory[trajectory.length - 1];
        const dist = calculateDistance(last.lat, last.lng, lat, lng);
        const speed = (dist / 2) * 3.6;
        setIssSpeed(speed);
      }

      const newPos = { lat, lng, timestamp };
      setPosition(newPos);
      setTrajectory((prev) => [...prev.slice(-50), newPos]);

      if (followISS && globeRef.current) {
        globeRef.current.pointOfView({ lat, lng, altitude: 2 }, 500);
      }

      fetchLocationName(lat, lng);
    } catch (err) {
      console.error("ISS fetch failed:", err);
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
    <div className="p-6 bg-black text-white min-h-screen font-sans">
      <h2 className="text-4xl font-bold mb-6 text-center">ISS Real-Time Tracker</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaSatelliteDish /> Current Position
          </h3>
          {position && (
            <>
              <p>Lat: {position.lat.toFixed(4)}°</p>
              <p>Lng: {position.lng.toFixed(4)}°</p>
              <p>Speed: {issSpeed.toFixed(1)} km/h</p>
              <p>Altitude: {altitude} km</p>
              <p>Orbit: {orbitPeriod} min</p>
              <p>Location: {placeName}</p>
            </>
          )}
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaUserAstronaut /> Crew Aboard ISS
          </h3>
          {astronauts.length > 0
            ? astronauts.map((astro, i) => <p key={i}>{astro.name}</p>)
            : <p>Loading...</p>}
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Controls</h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <button onClick={() => setIsPlaying((p) => !p)} className="btn">
              {isPlaying ? <FaPause /> : <FaPlay />} {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={() => setCurrentTexture(prev => prev === textures.night ? textures.day : textures.night)} className="btn">
              <FaGlobe /> Texture
            </button>
            <button onClick={() => setFollowISS((f) => !f)} className="btn">
              <FaLockOpen /> {followISS ? "Unlock" : "Follow"}
            </button>
            <button onClick={() => setShowTrajectory((s) => !s)} className="btn">
              Trail: {showTrajectory ? "On" : "Off"}
            </button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="btn">
              {isFullscreen ? <FaCompress /> : <FaExpand />} Fullscreen
            </button>
            <a
              href="https://www.nasa.gov/live"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-blue-600 hover:bg-blue-700"
            >
              <FaVideo /> Live Feed
            </a>
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl overflow-hidden border border-gray-700 shadow-xl transition-all duration-500 ${
          isFullscreen ? "fixed inset-4 z-50 bg-black" : "mx-auto max-w-4xl"
        }`}
        style={{ height: isFullscreen ? "calc(100vh - 2rem)" : `${globeSize}px` }}
      >
        <Globe
          ref={globeRef}
          globeImageUrl={currentTexture}
          backgroundColor="rgba(0,0,0,0.1)"
          width={isFullscreen ? window.innerWidth - 32 : 800}
          height={isFullscreen ? window.innerHeight - 32 : globeSize}
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
      </div>
    </div>
  );
};

export default ISSTracker;