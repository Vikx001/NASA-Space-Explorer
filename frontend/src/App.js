import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import StarryBackground from "./components/common/StarryBackground";
import LaunchCountdownWidget from "./components/common/LaunchCountdownWidget";

import Home from "./components/pages/Home";
import APODGallery from "./components/pages/APODGallery";
import LaunchTracker from "./components/pages/LaunchTracker";
import ISSTracker from "./components/pages/ISSTracker";
import StarChart from "./components/pages/StarChart";
import SpaceTimeline from "./components/pages/SpaceTimeline";
import TelescopeLocator from "./components/pages/TelescopeLocator";
import SpaceNewsFeed from "./components/pages/SpaceNewsFeed";
import NEOTracker from "./components/pages/NEOTracker";
import MarsRoverGallery from "./components/pages/MarsRoverGallery";
import SolarSystemExplorer from "./components/pages/SolarSystemExplorer";
import AIDemo from "./components/pages/AIDemo";

import "./styles/global.css";

const App = () => {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen font-nasa relative overflow-hidden">
        <StarryBackground />
        <Navbar />
        <LaunchCountdownWidget />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apod" element={<APODGallery />} />
            <Route path="/launches" element={<LaunchTracker />} />
            <Route path="/iss" element={<ISSTracker />} />
            <Route path="/starchart" element={<StarChart />} />
            <Route path="/timeline" element={<SpaceTimeline />} />
            <Route path="/telescopes" element={<TelescopeLocator />} />
            <Route path="/news" element={<SpaceNewsFeed />} />
            <Route path="/neo" element={<NEOTracker />} />
            <Route path="/mars" element={<MarsRoverGallery />} />
            <Route path="/solarsystem" element={<SolarSystemExplorer />} />
            <Route path="/ai-demo" element={<AIDemo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
