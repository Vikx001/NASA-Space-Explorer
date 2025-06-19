import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiClient from "../../utils/apiClient";

const LaunchTracker = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const data = await apiClient.spacex.getLaunches('upcoming');
        const sorted = data.sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));
        setLaunches(sorted.slice(0, 5));
      } catch (err) {
        console.error("Error fetching launches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLaunches();
  }, []);

  return (
    <div className="p-4">
      <h2
        className="text-3xl font-bold mb-6 tracking-wide text-center"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        Upcoming SpaceX Launches
      </h2>
      {loading ? (
        <p className="text-gray-400 text-center">Loading launches...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {launches.map((launch) => (
            <motion.div
              key={launch.id}
              className="p-6 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
            >
              {launch.links?.patch?.small && (
                <img src={launch.links.patch.small} alt={`${launch.name} patch`} className="w-20 h-20 mx-auto mb-4" />
              )}
              <h3 className="text-2xl font-semibold mb-2 text-white">{launch.name}</h3>
              <p className="text-sm text-gray-400 mb-2">
                {new Date(launch.date_utc).toLocaleString()}
              </p>
              <p className="text-gray-300 mb-4">
                {launch.details ? launch.details : "No mission details available."}
              </p>
              {launch.links.webcast && (
                <a
                  href={launch.links.webcast}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 text-sm font-medium bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
                >
                  Watch Launch
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LaunchTracker;
