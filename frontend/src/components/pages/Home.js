import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaRocket, FaSatellite, FaGlobeAmericas } from "react-icons/fa";
import { API_ENDPOINTS } from "../../config/api";

const Home = () => {
  const [backgroundImages, setBackgroundImages] = useState({
    hero: null,
    mission: null
  });

  // Parallax scroll effects
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const missionY = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);



  // Fetch background images from backend
  useEffect(() => {
    const fetchBackgroundImages = async () => {
      try {
        const heroImage = API_ENDPOINTS.EXTERNAL.IMAGES('hero-bg');
        const missionImage = API_ENDPOINTS.EXTERNAL.IMAGES('mission-bg');
        setBackgroundImages({
          hero: heroImage,
          mission: missionImage
        });
      } catch (error) {
        console.error('Failed to fetch background images:', error);
      }
    };
    fetchBackgroundImages();
  }, []);





  return (
    <div className="relative">

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-center px-4 overflow-hidden"
      >
        <motion.div
          style={{
            scale,
            backgroundImage: backgroundImages.hero ? `url('${backgroundImages.hero}')` : 'none',
            backgroundColor: backgroundImages.hero ? 'transparent' : '#000'
          }}
          className="absolute inset-0 bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70 z-10" />

        {/* Dots & Lines Background */}
        <div className="absolute inset-0 z-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {[...Array(30)].map((_, i) => {
              const x1 = Math.random() * window.innerWidth;
              const y1 = Math.random() * window.innerHeight;
              const x2 = x1 + Math.random() * 100 - 50;
              const y2 = y1 + Math.random() * 100 - 50;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="cyan" strokeWidth="0.5" strokeOpacity="0.3" />;
            })}
          </svg>
        </div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-6xl sm:text-7xl font-extrabold tracking-widest mb-4 text-white drop-shadow-[0_0_30px_rgba(0,255,255,1)] relative"
          >
            WELCOME TO COSMICVIEW
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 animate-pulse">
              <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
              <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
              <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white max-w-3xl text-lg sm:text-xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          >
            Dive into the depths of the universe with real-time data, interactive visualizations, and galactic insights.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        style={{ y: missionY }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.div
          style={{
            backgroundImage: backgroundImages.mission ? `url('${backgroundImages.mission}')` : 'none',
            backgroundColor: backgroundImages.mission ? 'transparent' : '#111'
          }}
          className="absolute inset-0 bg-fixed bg-center bg-cover"
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="p-8 bg-black bg-opacity-60 rounded-xl max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">🌌 Our Mission</h2>
          <p className="text-gray-300">
            To bring the universe closer—experience orbital data, explore cosmic events, and visualize planets, satellites, and near-Earth objects like never before.
          </p>
        </motion.div>
      </motion.section>

      {/* Feature Highlights */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-10 text-center">
        <motion.h3
          className="text-xl font-semibold mb-8 text-blue-300 tracking-wider uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Features at a Glance
        </motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            { icon: <FaRocket />, title: "Live Launch Tracker" },
            { icon: <FaSatellite />, title: "ISS Orbit Visualizer" },
            { icon: <FaGlobeAmericas />, title: "Solar System Explorer" },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition border border-gray-700"
            >
              <div className="text-4xl text-cyan-400 mb-4">{feature.icon}</div>
              <h4 className="text-lg font-medium text-white tracking-wide">{feature.title}</h4>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
