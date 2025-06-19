import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_ENDPOINTS, apiRequest } from "../../config/api";

const LaunchCountdownWidget = () => {
  const [nextLaunchDate, setNextLaunchDate] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchNextLaunch = async () => {
      try {
        const data = await apiRequest(API_ENDPOINTS.SPACEX.LAUNCHES_UPCOMING);
        if (!Array.isArray(data) || data.length === 0) return;
        const sorted = data.sort((a, b) => new Date(a.date_utc) - new Date(b.date_utc));
        setNextLaunchDate(sorted[0].date_utc);
      } catch (err) {
        console.error("Failed to fetch next launch", err);
      }
    };
    fetchNextLaunch();
  }, []);

  useEffect(() => {
    if (!nextLaunchDate) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const launchTime = new Date(nextLaunchDate).getTime();
      const diff = launchTime - now;

      if (diff <= 0) {
        setTimeLeft("Launch is happening now!");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [nextLaunchDate]);

  if (!nextLaunchDate) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="absolute top-20 right-5 bg-gray-800 p-3 rounded shadow-md z-20 text-sm cursor-move"
    >
      <p className="mb-1 font-semibold text-blue-400">Next Launch Countdown:</p>
      <p className="text-gray-300">{timeLeft}</p>
    </motion.div>
  );
};

export default LaunchCountdownWidget;
