import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGlobeAmericas } from "react-icons/fa";
import { API_ENDPOINTS, apiRequest } from "../../config/api";

const SolarSystemExplorer = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [externalLinks, setExternalLinks] = useState({});

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await apiRequest(API_ENDPOINTS.EXTERNAL.LINKS);
        setExternalLinks(data);
      } catch (error) {
        console.error('Failed to fetch external links:', error);
      }
    };
    fetchLinks();
  }, []);

  return (
    <div className="p-6 relative">
      <motion.h2
        className="text-4xl font-bold text-center mb-8 font-nasa flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <FaGlobeAmericas className="text-blue-400" /> Interactive Solar System Explorer
      </motion.h2>

      <motion.div
        className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-xl relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <motion.div
          className="absolute top-2 right-2 z-10 text-xs text-white bg-black bg-opacity-50 px-3 py-1 rounded-full backdrop-blur-md"
          whileHover={{ scale: 1.05 }}
        >
          Real-time 3D Visualization by NASA
        </motion.div>

        {!iframeLoaded && !iframeError && (
          <div className="w-full h-[700px] flex items-center justify-center bg-black text-white">
            <p className="animate-pulse">🚀 Loading simulation...</p>
          </div>
        )}

        {iframeError && (
          <div className="w-full h-[700px] flex items-center justify-center bg-red-900 text-white">
            <p>❌ Failed to load the simulation. Please check your connection or browser settings.</p>
          </div>
        )}

        {externalLinks.nasaEyes && (
          <iframe
            src={externalLinks.nasaEyes}
            title="NASA Eyes on the Solar System"
            width="100%"
            height="700"
            frameBorder="0"
            allowFullScreen
            className="w-full rounded-b-xl"
            onLoad={() => setIframeLoaded(true)}
            onError={() => setIframeError(true)}
            style={{ display: iframeLoaded && !iframeError ? 'block' : 'none' }}
          />
        )}
      </motion.div>

      <motion.div
        className="mt-6 text-center text-sm text-gray-400 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p>
          🪐 Explore the vastness of our solar system in a NASA-powered 3D simulation. Zoom in on planets,
          rotate around their orbits, and dive into detailed astronomical insights.
        </p>
        <p className="mt-2">
          Powered by
          {externalLinks.nasaEyesInfo && (
            <a
              href={externalLinks.nasaEyesInfo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline ml-1"
            >
              NASA Eyes on the Solar System
            </a>
          )}
          .
        </p>
      </motion.div>
    </div>
  );
};

export default SolarSystemExplorer;
