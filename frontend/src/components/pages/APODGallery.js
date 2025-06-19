import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../utils/apiClient";

const APODGallery = () => {
  const [apodData, setApodData] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("favorites")) || []);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const saveFavorites = (data) => {
    localStorage.setItem("favorites", JSON.stringify(data));
    setFavorites(data);
  };

  const toggleFavorite = (item) => {
    const isFav = favorites.some((fav) => fav.url === item.url);
    const updated = isFav ? favorites.filter((fav) => fav.url !== item.url) : [...favorites, item];
    saveFavorites(updated);
  };

  const fetchAPOD = async (params = {}) => {
    setLoading(true);
    try {
      const data = await apiClient.nasa.getAPOD(params);
      setApodData(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Failed to fetch APOD", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAPOD({ count: 9 });
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    fetchAPOD({ date: newDate });
  };

  const handleLoadMore = () => {
    fetchAPOD({ count: 6 });
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <label className="text-sm text-gray-400">
          Choose a date:
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="ml-2 bg-gray-800 text-white p-1 rounded"
          />
        </label>
        <button 
          onClick={handleLoadMore} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Load More
        </button>
      </div>
      
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apodData.map((item, idx) => (
            <div
              key={idx}
              className="relative cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => setSelected(item)}
            >
              <img 
                src={item.url} 
                alt={item.title} 
                className="rounded-lg shadow-md h-60 w-full object-cover" 
              />
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.date}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item);
                }}
                className={`absolute top-2 right-2 text-xl ${
                  favorites.some((fav) => fav.url === item.url) ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                ★
              </button>
            </div>
          ))}
        </div>
      )}
      
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-lg max-w-2xl w-full p-4 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button 
                className="absolute top-2 right-3 text-white text-xl" 
                onClick={() => setSelected(null)}
              >
                &times;
              </button>
              <img 
                src={selected.hdurl || selected.url} 
                alt={selected.title} 
                className="rounded-lg mb-4 max-h-96 w-full object-contain" 
              />
              <h2 className="text-xl font-bold mb-1">{selected.title}</h2>
              <p className="text-gray-400 text-sm mb-2">{selected.date}</p>
              <p className="text-sm leading-relaxed text-gray-300">{selected.explanation}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default APODGallery;
