import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_ENDPOINTS, apiRequest } from "../../config/api";

const ParallaxEventSection = ({ event, index, totalEvents }) => {
  const isLast = index === totalEvents - 1;
  return (
    <section
      className="relative h-screen flex flex-col items-center justify-center bg-fixed bg-center bg-cover"
      style={{ backgroundImage: `url(${event.image})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 mix-blend-overlay" />
      <motion.div
        className="relative z-10 max-w-3xl p-8 bg-gray-900 bg-opacity-75 rounded-lg shadow-xl text-center border border-gray-700"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: index * 0.1 }}
      >
        <h3
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          {event.title}
        </h3>
        <p className="text-sm text-gray-300 italic mb-4">{event.date}</p>
        <p className="text-gray-200 mb-2">{event.description}</p>
        <p className="text-gray-400 text-sm border-t border-gray-600 pt-2">
          {event.details}
        </p>
      </motion.div>
      {!isLast && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ y: 0 }}
          animate={{ y: 20 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.8 }}
        >
          <p
            className="mb-2 text-sm text-cyan-200"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            Continue Scrolling Through Time
          </p>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="cyan"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </motion.div>
      )}
    </section>
  );
};

const SpaceTimeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimelineEvents = async () => {
      try {
        const data = await apiRequest(API_ENDPOINTS.EXTERNAL.TIMELINE);
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch timeline events:', error);
        // Fallback to empty array if fetch fails
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Loading timeline...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-auto">
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2
          className="text-3xl font-bold mb-3 tracking-wide"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Historic & Future Space Events
        </h2>
        <p className="text-gray-400">
          Scroll down to traverse time and witness milestones in space exploration.
        </p>
      </motion.div>
      {events.map((event, index) => (
        <ParallaxEventSection
          key={index}
          event={event}
          index={index}
          totalEvents={events.length}
        />
      ))}
    </div>
  );
};

export default SpaceTimeline;
