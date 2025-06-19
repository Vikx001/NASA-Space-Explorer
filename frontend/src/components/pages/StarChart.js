import React, { useState, useEffect, useRef } from "react";

const StarChart = () => {
  const chartRef = useRef(null);
  const [error, setError] = useState(false);
  const [externalLinks, setExternalLinks] = useState({});

  useEffect(() => {
    const initializeLinks = () => {
      // Set default external links
      const defaultLinks = {
        star_map: 'https://stellarium-web.org/',
        constellation_guide: 'https://www.constellation-guide.com/',
        astronomy_tools: 'https://www.timeanddate.com/astronomy/'
      };
      setExternalLinks(defaultLinks);
    };
    initializeLinks();
  }, []);

  useEffect(() => {
    const renderIframe = () => {
      if (chartRef.current && externalLinks.stellarium) {
        chartRef.current.innerHTML = "";
        const iframe = document.createElement("iframe");
        iframe.src = externalLinks.stellarium;
        iframe.width = "100%";
        iframe.height = "600";
        iframe.style.border = "none";
        iframe.allowFullscreen = true;
        iframe.className = "rounded-xl shadow-2xl bg-black border border-white animate-fade-in";
        iframe.onload = () => setError(false);
        iframe.onerror = () => setError(true);
        chartRef.current.appendChild(iframe);
      }
    };

    if (externalLinks.stellarium) {
      renderIframe();
    }
  }, [externalLinks]);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        ✨ Real-Time Night Sky Star Chart
      </h2>

      <div
        ref={chartRef}
        className="border border-gray-700 rounded-xl shadow-lg min-h-[600px] bg-black flex items-center justify-center overflow-hidden relative"
      >
        {error && (
          <div className="text-red-400 text-center p-4">
            <p className="text-lg font-semibold">Failed to load the star chart.</p>
            <p className="text-sm">Please check your internet connection or try disabling browser extensions that may block content.</p>
          </div>
        )}
        {!externalLinks.stellarium && !error && (
          <div className="text-white text-center p-4">
            <p className="animate-pulse">🚀 Loading star chart...</p>
          </div>
        )}
      </div>

      <p className="text-center text-gray-400 mt-4 text-sm">
        Use your mouse to explore constellations, planets, and celestial objects in real time.
      </p>
    </div>
  );
};

export default StarChart;
