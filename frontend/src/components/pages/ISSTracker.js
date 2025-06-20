import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Globe from "react-globe.gl";
import { FaSatelliteDish, FaUserAstronaut, FaPlay, FaPause, FaVideo } from "react-icons/fa";
import apiClient from "../../utils/apiClient";

const ISSTracker = () => {
  const [position, setPosition] = useState(null);
  const [trajectory, setTrajectory] = useState([]);
  const [astronauts, setAstronauts] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const globeRef = useRef();

  // Fetch ISS position
  const fetchPosition = async () => {
    try {
      const data = await apiClient.iss.getPosition();
      console.log('ISS Position Data:', data);
      
      const lat = parseFloat(data.iss_position.latitude);
      const lng = parseFloat(data.iss_position.longitude);
      
      const newPosition = { lat, lng, timestamp: Date.now() };
      setPosition(newPosition);
      
      // Add to trajectory (keep last 20 points)
      setTrajectory(prev => {
        const newTrajectory = [...prev, newPosition].slice(-20);
        console.log('Trajectory points:', newTrajectory.length);
        return newTrajectory;
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch ISS position:', error);
      setLoading(false);
    }
  };

  // Fetch astronauts
  const fetchAstronauts = async () => {
    try {
      const data = await apiClient.iss.getAstronauts();
      console.log('Astronauts Data:', data);
      setAstronauts(data.people || []);
    } catch (error) {
      console.error('Failed to fetch astronauts:', error);
      // Fallback data
      setAstronauts([
        { name: "Expedition Crew Member 1", craft: "ISS" },
        { name: "Expedition Crew Member 2", craft: "ISS" },
        { name: "Expedition Crew Member 3", craft: "ISS" }
      ]);
    }
  };

  // Initialize and set up interval
  useEffect(() => {
    fetchPosition();
    fetchAstronauts();
    
    let interval;
    if (isPlaying) {
      interval = setInterval(fetchPosition, 5000); // Update every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Create arcs data for trajectory
  const arcsData = trajectory.length > 1 ? trajectory.slice(1).map((pos, i) => ({
    startLat: trajectory[i].lat,
    startLng: trajectory[i].lng,
    endLat: pos.lat,
    endLng: pos.lng,
    color: `rgba(255, 107, 53, ${0.3 + (i / trajectory.length) * 0.7})`,
    stroke: 2
  })) : [];

  console.log('Arcs data:', arcsData.length, 'arcs');

  // Points data for ISS position
  const pointsData = position ? [{
    lat: position.lat,
    lng: position.lng,
    size: 1,
    color: '#ff6b35',
    label: `ISS - Lat: ${position.lat.toFixed(2)}, Lng: ${position.lng.toFixed(2)}`
  }] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <FaSatelliteDish className="text-6xl text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Tracking ISS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <FaSatelliteDish className="text-blue-400" />
            ISS Live Tracker
          </h1>
          <p className="text-gray-300 text-lg">
            Track the International Space Station in real-time
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
            {isPlaying ? 'Pause Tracking' : 'Start Tracking'}
          </button>
        </div>

        {/* Globe Container */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Globe
              ref={globeRef}
              width={800}
              height={600}
              backgroundColor="rgba(0,0,0,0)"
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              
              // ISS Position
              pointsData={pointsData}
              pointLat="lat"
              pointLng="lng"
              pointColor="color"
              pointAltitude={0.02}
              pointRadius={1.5}
              pointLabel="label"
              
              // ISS Trail
              arcsData={arcsData}
              arcStartLat="startLat"
              arcStartLng="startLng"
              arcEndLat="endLat"
              arcEndLng="endLng"
              arcColor="color"
              arcStroke="stroke"
              arcAltitude={0.01}
              arcDashLength={1}
              arcDashGap={0}
              
              // Auto-rotate
              enablePointerInteraction={true}
            />
            
            {/* Status overlay */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="font-semibold">{isPlaying ? 'LIVE' : 'PAUSED'}</span>
              </div>
              {position && (
                <div className="text-sm space-y-1">
                  <div>Lat: {position.lat.toFixed(4)}°</div>
                  <div>Lng: {position.lng.toFixed(4)}°</div>
                  <div>Speed: ~27,600 km/h</div>
                  <div>Trail Points: {trajectory.length}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Astronauts Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 mb-6"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FaUserAstronaut className="text-blue-400" />
            Current Crew ({astronauts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {astronauts.map((astronaut, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="text-white font-semibold">{astronaut.name}</div>
                <div className="text-gray-300 text-sm">{astronaut.craft}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* External Links */}
        <div className="text-center">
          <a
            href="https://www.nasa.gov/live"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            <FaVideo />
            Watch NASA Live
          </a>
        </div>
      </div>
    </div>
  );
};

export default ISSTracker;
