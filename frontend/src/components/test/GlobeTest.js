import React from 'react';
import Globe from 'react-globe.gl';

const GlobeTest = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Globe Test</h2>
      <div className="h-96 border border-gray-700 rounded-xl overflow-hidden">
        <Globe
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(0,0,0,0.1)"
          width={800}
          height={400}
          pointsData={[
            { lat: 40.7128, lng: -74.0060, size: 1, color: 'red', label: 'New York' },
            { lat: 51.5074, lng: -0.1278, size: 1, color: 'blue', label: 'London' }
          ]}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={0.02}
          pointRadius={0.5}
          pointLabel="label"
        />
      </div>
    </div>
  );
};

export default GlobeTest;
