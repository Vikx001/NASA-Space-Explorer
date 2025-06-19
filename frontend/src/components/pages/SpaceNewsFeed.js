import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS, apiRequest, buildQueryString } from "../../config/api";

const SpaceNewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const queryString = buildQueryString({ limit: 6 });
        const data = await apiRequest(`${API_ENDPOINTS.SPACENEWS.ARTICLES}?${queryString}`);
        setArticles(data.results);
      } catch (error) {
        console.error("Failed to fetch space news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-10 text-center text-white">
        🛰️ Latest Space News
      </h2>
      {loading ? (
        <p className="text-center text-gray-400">Fetching galactic updates...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              className="bg-gray-900 rounded-xl shadow-xl p-5 border border-white hover:shadow-2xl transition-transform hover:scale-[1.02] cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedArticle(article)}
            >
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-3">
                {article.summary}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              className="bg-gray-900 text-white rounded-lg max-w-2xl w-full p-6 relative border border-white shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-2xl text-white"
                onClick={() => setSelectedArticle(null)}
              >
                &times;
              </button>
              {selectedArticle.image_url && (
                <img
                  src={selectedArticle.image_url}
                  alt={selectedArticle.title}
                  className="w-full h-60 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
              <p className="text-sm text-gray-400 mb-4">
                Published: {new Date(selectedArticle.published_at).toLocaleString()}
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                {selectedArticle.summary}
              </p>
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
              >
                Read Full Article ↗
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpaceNewsFeed;
