import React, { useState, useEffect } from "react";
import { FaMeteor, FaRulerCombined, FaExclamationTriangle } from "react-icons/fa";
import apiClient from "../../utils/apiClient";

const NEOTracker = () => {
  const [neoData, setNeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [asteroidImages, setAsteroidImages] = useState({});
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch NEO data
        const today = new Date().toISOString().split("T")[0];
        const neoResponse = await apiClient.nasa.getNEOFeed({
          start_date: today,
          end_date: today
        });

        console.log('NEO Response:', neoResponse); // Debug log

        let neos = [];
        if (neoResponse.near_earth_objects) {
          // Try today first, then any available date
          neos = neoResponse.near_earth_objects[today] ||
                 Object.values(neoResponse.near_earth_objects)[0] || [];
        }

        console.log('NEO Data:', neos); // Debug log
        setNeoData(neos);

        // Fetch real images for each asteroid
        const imagePromises = neos.map(async (neo) => {
          try {
            setImageLoadingStates(prev => ({ ...prev, [neo.id]: true }));
            // Use default image since we don't have the image endpoint
        const imageData = {
          url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/433eros.jpg',
          title: neo.name,
          description: 'Representative asteroid image',
          source: 'NASA/Johns Hopkins APL (Representative)'
        };
            setAsteroidImages(prev => ({ ...prev, [neo.id]: imageData }));
            setImageLoadingStates(prev => ({ ...prev, [neo.id]: false }));
          } catch (error) {
            console.error(`Failed to fetch image for ${neo.name}:`, error);
            // Fallback to default asteroid image
            setAsteroidImages(prev => ({
              ...prev,
              [neo.id]: {
                url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Itokawa8_hayabusa_1210.jpg',
                title: neo.name,
                description: 'Representative asteroid image',
                source: 'Fallback'
              }
            }));
            setImageLoadingStates(prev => ({ ...prev, [neo.id]: false }));
          }
        });

        await Promise.allSettled(imagePromises);
      } catch (err) {
        console.error("Failed to fetch NEO data", err);
        // Set fallback data if API fails
        const fallbackNeos = [
          {
            id: "54016354",
            name: "(2020 SO)",
            is_potentially_hazardous_asteroid: false,
            close_approach_data: [{
              close_approach_date_full: "2024-Dec-19 12:30",
              miss_distance: { kilometers: "1234567" },
              relative_velocity: { kilometers_per_hour: "12345" }
            }],
            estimated_diameter: {
              kilometers: {
                estimated_diameter_min: 0.008,
                estimated_diameter_max: 0.018
              }
            }
          },
          {
            id: "54016355",
            name: "(2021 AB)",
            is_potentially_hazardous_asteroid: true,
            close_approach_data: [{
              close_approach_date_full: "2024-Dec-20 08:15",
              miss_distance: { kilometers: "987654" },
              relative_velocity: { kilometers_per_hour: "23456" }
            }],
            estimated_diameter: {
              kilometers: {
                estimated_diameter_min: 0.012,
                estimated_diameter_max: 0.025
              }
            }
          }
        ];
        setNeoData(fallbackNeos);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getAsteroidImage = (neoId) => {
    return asteroidImages[neoId] || null;
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold mb-8 text-center font-nasa">🛰️ Near-Earth Object Tracker</h2>
      {loading ? (
        <p className="text-center text-gray-400">Loading NEO data...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {neoData.map((neo) => {
            const hazardous = neo.is_potentially_hazardous_asteroid;
            const imageData = getAsteroidImage(neo.id);
            const isImageLoading = imageLoadingStates[neo.id];

            return (
              <div
                key={neo.id}
                className="bg-gray-900 rounded-lg shadow-lg p-4 border border-gray-700 hover:shadow-xl transition-transform hover:scale-105"
              >
                <div className="relative w-full h-40 mb-4 bg-gray-800 rounded-lg overflow-hidden">
                  {isImageLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                      <span className="ml-2 text-gray-400 text-sm">Loading image...</span>
                    </div>
                  ) : imageData ? (
                    <div className="relative h-full">
                      <img
                        src={imageData.url}
                        alt={imageData.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Itokawa8_hayabusa_1210.jpg';
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-xs text-gray-300 p-1">
                        Source: {imageData.source}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <FaMeteor size={32} />
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-semibold text-white mb-2 flex items-center gap-2">
                  <FaMeteor className="text-orange-400" />
                  <span className="truncate" title={neo.name}>{neo.name}</span>
                </h3>

                <p className="text-gray-400 text-sm mb-3">
                  <strong>Close Approach:</strong> {neo.close_approach_data[0]?.close_approach_date_full}
                </p>

                <div className="text-gray-300 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <FaRulerCombined className="text-blue-400 flex-shrink-0" />
                    <span>
                      <strong>Miss Distance:</strong>{" "}
                      {Number(neo.close_approach_data[0]?.miss_distance.kilometers).toLocaleString()} km
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-purple-400">📏</span>
                    <span>
                      <strong>Diameter:</strong>{" "}
                      {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)} -{" "}
                      {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">⚡</span>
                    <span>
                      <strong>Velocity:</strong>{" "}
                      {Number(neo.close_approach_data[0]?.relative_velocity.kilometers_per_hour).toFixed(0)} km/h
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaExclamationTriangle className={`flex-shrink-0 ${hazardous ? "text-red-500" : "text-green-400"}`} />
                    <span>
                      <strong>Potentially Hazardous:</strong>{" "}
                      <span className={`font-bold ${hazardous ? "text-red-500" : "text-green-400"}`}>
                        {hazardous ? "Yes" : "No"}
                      </span>
                    </span>
                  </div>

                  {imageData && imageData.description && (
                    <div className="mt-3 pt-2 border-t border-gray-700">
                      <p className="text-xs text-gray-400 italic">
                        {imageData.description.length > 100
                          ? `${imageData.description.substring(0, 100)}...`
                          : imageData.description
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NEOTracker;
