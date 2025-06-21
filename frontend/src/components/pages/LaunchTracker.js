import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import apiClient from "../../utils/apiClient";

const LaunchTracker = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        // Try upcoming first
        let data = await apiClient.spacex.getLaunches('upcoming');
        console.log('Upcoming launches:', data);

        // Filter out old "upcoming" launches (anything before 2024)
        const currentYear = new Date().getFullYear();
        const validUpcoming = data.filter(launch => {
          const launchYear = new Date(launch.date_utc).getFullYear();
          return launchYear >= currentYear;
        });

        if (validUpcoming.length === 0) {
          // If no valid upcoming launches, show recent past launches
          console.log('No valid upcoming launches, fetching recent launches...');
          data = await apiClient.spacex.getLaunches('past');
          const sorted = data.sort((a, b) => new Date(b.date_utc) - new Date(a.date_utc));
          setLaunches(sorted.slice(0, 5));
          setShowRecent(true);
        } else {
          const sorted = validUpcoming.sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));
          setLaunches(sorted.slice(0, 5));
          setShowRecent(false);
        }
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
        className="text-3xl font-bold mb-4 tracking-wide text-center"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        {showRecent ? 'Recent SpaceX Launches' : 'Upcoming SpaceX Launches'}
      </h2>
      {showRecent && (
        <div className="text-center mb-4 p-3 bg-yellow-900 bg-opacity-50 rounded-lg border border-yellow-600">
          <p className="text-yellow-300 text-sm">
            ⚠️ SpaceX API data appears outdated. Showing recent launches instead.
          </p>
        </div>
      )}
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
                📅 {new Date(launch.date_utc).toLocaleDateString()} at {new Date(launch.date_utc).toLocaleTimeString()}
              </p>
              <p className="text-sm text-blue-400 mb-2">
                🚀 Flight #{launch.flight_number} • {launch.success === null ? (showRecent ? 'Completed' : 'Scheduled') : (launch.success ? 'Success' : 'Failed')}
              </p>
              <p className="text-gray-300 mb-4">
                {launch.details ? launch.details : "No mission details available."}
              </p>
              <div className="flex gap-2">
                {launch.links?.webcast && (
                  <a
                    href={launch.links.webcast}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    🎥 Watch
                  </a>
                )}
                {launch.links?.wikipedia && (
                  <a
                    href={launch.links.wikipedia}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    📖 Info
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LaunchTracker;
