class SpaceAIAnalyzer {

  analyzeAsteroidRisk(asteroid) {
    const missDistance = parseFloat(asteroid.close_approach_data[0]?.miss_distance.kilometers);
    const diameter = asteroid.estimated_diameter.kilometers.estimated_diameter_max;
    const isHazardous = asteroid.is_potentially_hazardous_asteroid;
    
    let riskLevel = 'LOW';
    let analysis = '';
    let recommendations = [];

    if (isHazardous && missDistance < 1000000) {
      riskLevel = 'HIGH';
      analysis = `${asteroid.name} poses a significant threat due to its potentially hazardous classification and close approach distance of ${missDistance.toLocaleString()} km.`;
      recommendations.push('Continuous monitoring required');
      recommendations.push('Trajectory calculations should be updated frequently');
    } else if (isHazardous || missDistance < 5000000) {
      riskLevel = 'MEDIUM';
      analysis = `${asteroid.name} requires attention. While not immediately dangerous, its ${isHazardous ? 'hazardous classification' : 'close approach'} warrants monitoring.`;
      recommendations.push('Regular observation recommended');
      recommendations.push('Update orbital calculations monthly');
    } else {
      riskLevel = 'LOW';
      analysis = `${asteroid.name} poses minimal risk with a safe miss distance of ${missDistance.toLocaleString()} km.`;
      recommendations.push('Standard monitoring sufficient');
    }

    if (diameter > 1) {
      analysis += ` Its estimated diameter of up to ${diameter.toFixed(2)} km makes it a significant object.`;
    } else if (diameter > 0.1) {
      analysis += ` With an estimated diameter of ${diameter.toFixed(3)} km, it's a medium-sized asteroid.`;
    } else {
      analysis += ` This is a relatively small asteroid with diameter under 100 meters.`;
    }
    
    return {
      riskLevel,
      analysis,
      recommendations,
      confidence: 0.85,
      factors: {
        missDistance: missDistance.toLocaleString() + ' km',
        diameter: diameter.toFixed(3) + ' km',
        hazardous: isHazardous,
        velocity: asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_hour + ' km/h'
      }
    };
  }

  analyzeSpaceWeather(issPosition) {
    const lat = parseFloat(issPosition.iss_position.latitude);
    const lon = parseFloat(issPosition.iss_position.longitude);
    
    let region = 'Unknown';
    let auroraChance = 'Low';
    let visibility = 'Good';

    if (Math.abs(lat) > 60) {
      region = lat > 0 ? 'Arctic' : 'Antarctic';
      auroraChance = 'High';
      visibility = 'Excellent for aurora viewing';
    } else if (Math.abs(lat) > 45) {
      region = 'High Latitude';
      auroraChance = 'Medium';
      visibility = 'Possible aurora activity';
    } else {
      region = 'Mid to Low Latitude';
      auroraChance = 'Low';
      visibility = 'Clear space observations';
    }
    
    return {
      region,
      auroraChance,
      visibility,
      analysis: `ISS is currently over ${region} region at ${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}. ${visibility} expected.`,
      recommendations: [
        auroraChance === 'High' ? 'Excellent time for aurora photography' : 'Good conditions for space observations',
        'Minimal atmospheric interference expected',
        'Optimal viewing conditions for Earth observation'
      ]
    };
  }

  analyzeMarsConditions(marsPhotos) {
    if (!marsPhotos || marsPhotos.length === 0) {
      return { analysis: 'No recent Mars data available', conditions: 'Unknown' };
    }
    
    const latestPhoto = marsPhotos[0];
    const sol = latestPhoto.sol;
    const camera = latestPhoto.camera.name;
    const rover = latestPhoto.rover.name;
    
    let conditions = 'Nominal';
    let analysis = '';

    if (sol > 3000) {
      conditions = 'Extended Mission';
      analysis = `${rover} has been operating for ${sol} sols, well beyond its planned mission duration. `;
    } else if (sol > 1000) {
      conditions = 'Long-term Operations';
      analysis = `${rover} is in long-term operational phase at sol ${sol}. `;
    } else {
      conditions = 'Primary Mission';
      analysis = `${rover} is in its primary mission phase at sol ${sol}. `;
    }

    const cameraInsights = {
      'MAST': 'High-resolution imaging and terrain analysis',
      'NAVCAM': 'Navigation and path planning operations',
      'FHAZ': 'Front hazard avoidance and safety checks',
      'RHAZ': 'Rear hazard avoidance and maneuvering',
      'MAHLI': 'Close-up scientific analysis',
      'MARDI': 'Descent and landing documentation'
    };
    
    analysis += `Recent ${camera} imagery suggests ${cameraInsights[camera] || 'scientific operations'} are ongoing.`;
    
    return {
      conditions,
      analysis,
      sol,
      rover,
      camera,
      recommendations: [
        'Rover systems operating nominally',
        'Continued scientific data collection',
        'Regular health monitoring maintained'
      ]
    };
  }

  generateMissionInsights(launchData) {
    if (!launchData || launchData.length === 0) {
      return { insights: 'No recent launch data available' };
    }
    
    const upcomingLaunches = launchData.filter(launch => launch.upcoming);
    const recentLaunches = launchData.filter(launch => !launch.upcoming).slice(0, 5);
    
    let insights = '';
    let trends = [];
    
    if (upcomingLaunches.length > 0) {
      insights += `${upcomingLaunches.length} upcoming missions scheduled. `;
      trends.push('Active launch schedule');
    }
    
    if (recentLaunches.length > 0) {
      const successRate = recentLaunches.filter(l => l.success).length / recentLaunches.length;
      insights += `Recent mission success rate: ${(successRate * 100).toFixed(0)}%. `;
      
      if (successRate > 0.8) {
        trends.push('High reliability');
      } else if (successRate > 0.6) {
        trends.push('Moderate reliability');
      } else {
        trends.push('Reliability concerns');
      }
    }
    
    return {
      insights,
      trends,
      upcomingCount: upcomingLaunches.length,
      recentSuccessRate: recentLaunches.length > 0 ? 
        (recentLaunches.filter(l => l.success).length / recentLaunches.length * 100).toFixed(0) + '%' : 'N/A'
    };
  }
}

module.exports = new SpaceAIAnalyzer();
