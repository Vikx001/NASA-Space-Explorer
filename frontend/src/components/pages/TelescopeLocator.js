import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Globe from "react-globe.gl";
import { FaBinoculars, FaExpand, FaCompress, FaGlobe, FaMapMarkedAlt, FaSearch } from "react-icons/fa";
import { API_ENDPOINTS, apiRequest, buildQueryString } from "../../config/api";

const TelescopeLocator = () => {
  const globeRef = useRef();
  const [selectedObs, setSelectedObs] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [observatories, setObservatories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [globeTexture, setGlobeTexture] = useState("night");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredObservatories, setFilteredObservatories] = useState([]);
  const [showLabels, setShowLabels] = useState(true);
  const [animateRotation, setAnimateRotation] = useState(false);

  useEffect(() => {
    const fetchObservatories = async () => {
      try {
        const data = await apiRequest(API_ENDPOINTS.EXTERNAL.OBSERVATORIES);
        setObservatories(data);
        setFilteredObservatories(data);
      } catch (error) {
        console.error('Failed to fetch observatories:', error);
        setObservatories([]);
        setFilteredObservatories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchObservatories();
  }, []);

  // Filter observatories based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredObservatories(observatories);
    } else {
      const filtered = observatories.filter(obs =>
        obs.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.info.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredObservatories(filtered);
    }
  }, [searchTerm, observatories]);

  // Control functions
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleTexture = () => {
    setGlobeTexture(prev => prev === "night" ? "day" : "night");
  };

  const toggleLabels = () => {
    setShowLabels(!showLabels);
  };

  const toggleRotation = () => {
    setAnimateRotation(!animateRotation);
    if (globeRef.current) {
      if (!animateRotation) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.5;
      } else {
        globeRef.current.controls().autoRotate = false;
      }
    }
  };

  const focusOnObservatory = (obs) => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: obs.lat, lng: obs.lng, altitude: 1.5 }, 2000);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const queryString = buildQueryString({ lat, lon: lng });
      const data = await apiRequest(`${API_ENDPOINTS.ISS.LOCATION}?${queryString}`);
      return data?.display_name || "Unknown location";
    } catch {
      return "Failed to retrieve place name";
    }
  };

  const handlePointClick = async (obs) => {
    setSelectedObs(obs);
    const name = await reverseGeocode(obs.lat, obs.lng);
    setPlaceName(name);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Loading observatories...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3"
      >
        <FaBinoculars className="text-blue-400" />
        Global Telescope Locator
      </motion.h2>

      {/* Search and Controls */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FaSearch className="text-blue-400" />
            Search Observatories
          </h3>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
          />
          <p className="text-sm text-gray-400 mt-2">
            Found {filteredObservatories.length} of {observatories.length} observatories
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FaGlobe className="text-green-400" />
            Globe Controls
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={toggleTexture}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-sm transition"
            >
              {globeTexture === "night" ? "Day" : "Night"}
            </button>

            <button
              onClick={toggleLabels}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                showLabels ? 'bg-slate-600 hover:bg-slate-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              Labels
            </button>

            <button
              onClick={toggleRotation}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                animateRotation ? 'bg-slate-600 hover:bg-slate-700' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              Rotate
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-sm transition"
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
              {isFullscreen ? 'Exit' : 'Full'}
            </button>
          </div>
        </div>
      </div>

      {selectedObs && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 mb-6 border border-gray-700 rounded-xl shadow-lg"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3">
              <img
                src={selectedObs.image}
                alt={selectedObs.name}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FaBinoculars className="text-blue-400" />
                  {selectedObs.name}
                </h3>
                <button
                  onClick={() => focusOnObservatory(selectedObs)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg text-sm transition flex items-center gap-2"
                >
                  <FaMapMarkedAlt /> Focus
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Coordinates</p>
                  <p className="text-blue-400 font-mono">
                    {selectedObs.lat.toFixed(4)}°, {selectedObs.lng.toFixed(4)}°
                  </p>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                  <p className="text-cyan-300 text-sm">{placeName}</p>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">{selectedObs.info}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div
        className={`border border-gray-700 rounded-xl overflow-hidden relative transition-all duration-500 ${
          isFullscreen ? 'fixed inset-4 z-50 bg-black' : 'h-[700px]'
        }`}
        style={{ height: isFullscreen ? 'calc(100vh - 2rem)' : '700px' }}
      >
        <Globe
          ref={globeRef}
          globeImageUrl={globeTexture === "night"
            ? '//unpkg.com/three-globe/example/img/earth-night.jpg'
            : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
          }
          backgroundColor="rgba(0,0,0,0.1)"
          width={isFullscreen ? window.innerWidth - 32 : undefined}
          height={isFullscreen ? window.innerHeight - 32 : 700}

          // Observatory points
          pointsData={filteredObservatories}
          pointLat="lat"
          pointLng="lng"
          pointLabel={showLabels ? "name" : ""}
          pointColor={(obs) => selectedObs?.name === obs.name ? "#ff6b35" : "#00ff88"}
          pointAltitude={0.02}
          pointRadius={(obs) => selectedObs?.name === obs.name ? 0.8 : 0.5}
          onPointClick={handlePointClick}
          pointResolution={8}

          // Atmosphere
          atmosphereColor="#00d4ff"
          atmosphereAltitude={0.12}

          // Animation and interaction
          enablePointerInteraction={true}
          animateIn={true}

          // Major cities for reference
          labelsData={showLabels ? [
            { lat: 40.7128, lng: -74.0060, text: 'New York', size: 0.4, color: '#ffffff' },
            { lat: 51.5074, lng: -0.1278, text: 'London', size: 0.4, color: '#ffffff' },
            { lat: 35.6762, lng: 139.6503, text: 'Tokyo', size: 0.4, color: '#ffffff' },
            { lat: -33.8688, lng: 151.2093, text: 'Sydney', size: 0.4, color: '#ffffff' },
            { lat: 55.7558, lng: 37.6176, text: 'Moscow', size: 0.4, color: '#ffffff' },
            { lat: 39.9042, lng: 116.4074, text: 'Beijing', size: 0.4, color: '#ffffff' }
          ] : []}
          labelLat="lat"
          labelLng="lng"
          labelText="text"
          labelSize="size"
          labelColor="color"
          labelResolution={2}
        />

        {/* Fullscreen controls */}
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

        {/* Observatory count overlay */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg backdrop-blur-sm">
          <h4 className="font-bold text-sm mb-1">Observatory Data</h4>
          <p className="text-xs">Total: {observatories.length}</p>
          <p className="text-xs">Visible: {filteredObservatories.length}</p>
          <p className="text-xs">Selected: {selectedObs ? selectedObs.name : 'None'}</p>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg backdrop-blur-sm">
          <h4 className="font-bold text-xs mb-2">Legend</h4>
          <div className="flex items-center gap-2 text-xs mb-1">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Observatory</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelescopeLocator;
