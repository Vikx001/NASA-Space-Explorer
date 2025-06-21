import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRocket, FaCamera, FaCalendarAlt, FaSpinner } from "react-icons/fa";

const MarsRoverGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRover, setSelectedRover] = useState('perseverance');
  const [error, setError] = useState(null);

  const rovers = [
    { name: 'perseverance', displayName: 'Perseverance', status: 'Active' },
    { name: 'curiosity', displayName: 'Curiosity', status: 'Active' },
    { name: 'opportunity', displayName: 'Opportunity', status: 'Complete' },
    { name: 'spirit', displayName: 'Spirit', status: 'Complete' }
  ];

  const fetchMarsPhotos = async (rover) => {
    setLoading(true);
    setError(null);
    try {
      // Try latest photos first for active rovers
      const isActive = rover === 'perseverance' || rover === 'curiosity';
      let url;

      if (isActive) {
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp`;
      } else {
        // For inactive rovers, use a specific sol that had good photos
        const sol = rover === 'opportunity' ? 5000 : 2000;
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const photoArray = data.latest_photos || data.photos || [];

      if (photoArray.length === 0) {
        throw new Error('No photos available for this rover');
      }

      // Get diverse photos from different cameras
      const diversePhotos = [];
      const cameras = {};

      for (const photo of photoArray) {
        const cameraName = photo.camera.name;
        if (!cameras[cameraName] || cameras[cameraName].length < 3) {
          if (!cameras[cameraName]) cameras[cameraName] = [];
          cameras[cameraName].push(photo);
          diversePhotos.push(photo);
          if (diversePhotos.length >= 12) break;
        }
      }

      setPhotos(diversePhotos);
    } catch (err) {
      console.error("Failed to fetch Mars photos", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarsPhotos(selectedRover);
  }, [selectedRover]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Mars Rover Gallery
        </motion.h2>

        {/* Rover Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {rovers.map((rover) => (
            <button
              key={rover.name}
              onClick={() => setSelectedRover(rover.name)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                selectedRover === rover.name
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <FaRocket />
              {rover.displayName}
              <span className={`text-xs px-2 py-1 rounded-full ${
                rover.status === 'Active' ? 'bg-green-600' : 'bg-gray-500'
              }`}>
                {rover.status}
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <FaSpinner className="animate-spin text-4xl text-blue-400 mr-4" />
            <p className="text-xl text-gray-400">Loading Mars photos...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-6 mb-8">
            <p className="text-red-300">Error loading photos: {error}</p>
            <button
              onClick={() => fetchMarsPhotos(selectedRover)}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Photos Grid */}
        {!loading && !error && photos.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative">
                  <img
                    src={photo.img_src}
                    alt={`Mars surface captured by ${photo.rover.name}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    <FaCamera className="inline mr-1" />
                    {photo.camera.name}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <FaRocket className="text-red-400" />
                    {photo.rover.name}
                  </h3>

                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400 flex items-center gap-2">
                      <span className="font-medium">Sol:</span> {photo.sol}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-400" />
                      {photo.earth_date}
                    </p>
                    <p className="text-gray-400">
                      <span className="font-medium">Camera:</span> {photo.camera.full_name}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Photos Message */}
        {!loading && !error && photos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No photos available for {selectedRover}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarsRoverGallery;
