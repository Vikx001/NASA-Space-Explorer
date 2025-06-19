import React, { useState, useEffect } from "react";
import apiClient from "../../utils/apiClient";

const MarsRoverGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarsPhotos = async () => {
      try {
        const data = await apiClient.nasa.getMarsPhotos('curiosity', { sol: 1000 });
        setPhotos(data.photos.slice(0, 12));
      } catch (err) {
        console.error("Failed to fetch Mars photos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarsPhotos();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Mars & Rover Gallery</h2>
      {loading ? (
        <p className="text-center text-gray-400">Loading Mars photos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="rounded overflow-hidden shadow-lg">
              <img
                src={photo.img_src}
                alt={`Mars Rover - ${photo.rover.name}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-gray-800">
                <h3 className="text-lg font-semibold text-white">{photo.rover.name}</h3>
                <p className="text-gray-400 text-sm">Sol: {photo.sol}</p>
                <p className="text-gray-300 text-sm">Earth Date: {photo.earth_date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarsRoverGallery;
