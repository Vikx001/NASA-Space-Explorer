import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaCamera, FaCalendarAlt, FaSpinner } from "react-icons/fa";

const MarsRoverGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRover, setSelectedRover] = useState('perseverance');
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

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
      let url;
      let photoArray = [];

      // Different strategies for different rovers
      if (rover === 'perseverance' || rover === 'curiosity') {
        // For active rovers, try latest photos first, then fallback to specific sol
        try {
          url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp`;
          const response = await fetch(url);
          const data = await response.json();
          photoArray = data.latest_photos || [];
        } catch (e) {
          console.log('Latest photos failed, trying specific sol...');
        }

        // Fallback to specific sol if latest photos failed
        if (photoArray.length === 0) {
          const sol = rover === 'perseverance' ? 1000 : 3000;
          url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp`;
          const response = await fetch(url);
          const data = await response.json();
          photoArray = data.photos || [];
        }
      } else {
        // For inactive rovers, use specific sols
        const sol = rover === 'opportunity' ? 2000 : 1000;
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=uGD2FnbivVtg0PN49UuX0FcK0XtfvB6Mz1wabstp`;
        const response = await fetch(url);
        const data = await response.json();
        photoArray = data.photos || [];
      }

      if (photoArray.length === 0) {
        throw new Error(`No photos available for ${rover}`);
      }

      // Get diverse photos from different cameras
      const diversePhotos = [];
      const cameras = {};

      for (const photo of photoArray.slice(0, 30)) { // Check first 30 photos
        if (photo.img_src) {
          const cameraName = photo.camera.name;
          if (!cameras[cameraName] || cameras[cameraName].length < 3) {
            if (!cameras[cameraName]) cameras[cameraName] = [];
            cameras[cameraName].push(photo);
            diversePhotos.push(photo);
            if (diversePhotos.length >= 12) break;
          }
        }
      }

      if (diversePhotos.length === 0) {
        throw new Error(`No valid photos found for ${rover}`);
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
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative">
                  <img
                    src={photo.img_src}
                    alt={`Mars surface captured by ${photo.rover.name}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className="w-full h-48 bg-gray-700 hidden items-center justify-center text-gray-400"
                    style={{ display: 'none' }}
                  >
                    <div className="text-center">
                      <FaCamera className="text-2xl mb-2" />
                      <p className="text-sm">Image not available</p>
                    </div>
                  </div>
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

        {/* Photo Modal - Same as APOD */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                className="bg-gray-900 rounded-lg max-w-4xl w-full p-4 relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-3 text-white text-xl hover:text-gray-300 transition"
                  onClick={() => setSelectedPhoto(null)}
                >
                  &times;
                </button>

                <img
                  src={selectedPhoto.img_src}
                  alt={`Mars surface captured by ${selectedPhoto.rover.name}`}
                  className="rounded-lg mb-4 max-h-96 w-full object-contain"
                />

                <div className="text-white">
                  <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <FaRocket className="text-red-400" />
                    {selectedPhoto.rover.name} - Sol {selectedPhoto.sol}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">
                        <span className="font-medium text-white">Earth Date:</span> {selectedPhoto.earth_date}
                      </p>
                      <p className="text-gray-400 mb-1">
                        <span className="font-medium text-white">Camera:</span> {selectedPhoto.camera.full_name}
                      </p>
                      <p className="text-gray-400">
                        <span className="font-medium text-white">Camera Type:</span> {selectedPhoto.camera.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">
                        <span className="font-medium text-white">Rover Status:</span> {selectedPhoto.rover.status}
                      </p>
                      <p className="text-gray-400 mb-1">
                        <span className="font-medium text-white">Landing Date:</span> {selectedPhoto.rover.landing_date}
                      </p>
                      <p className="text-gray-400">
                        <span className="font-medium text-white">Launch Date:</span> {selectedPhoto.rover.launch_date}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MarsRoverGallery;
