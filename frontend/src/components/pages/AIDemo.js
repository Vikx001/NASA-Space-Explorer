import React, { useState } from 'react';
import { FaRobot, FaSpinner, FaBrain, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';

const AIDemo = () => {
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [activeDemo, setActiveDemo] = useState(null);

  // Local AI analysis functions
  const analyzeAsteroidRisk = (asteroid) => {
    const missDistance = parseFloat(asteroid.close_approach_data[0]?.miss_distance.kilometers);
    const diameter = asteroid.estimated_diameter.kilometers.estimated_diameter_max;
    const isHazardous = asteroid.is_potentially_hazardous_asteroid;

    let riskLevel = 'LOW';
    let analysis = '';
    let recommendations = [];
    let confidence = 0.85;

    if (isHazardous && missDistance < 1000000) {
      riskLevel = 'HIGH';
      analysis = `${asteroid.name} poses a significant threat due to its potentially hazardous classification and close approach distance of ${missDistance.toLocaleString()} km.`;
      recommendations.push('Continuous monitoring required');
      recommendations.push('Trajectory calculations should be updated frequently');
      confidence = 0.92;
    } else if (isHazardous || missDistance < 5000000) {
      riskLevel = 'MEDIUM';
      analysis = `${asteroid.name} requires attention. While not immediately dangerous, its ${isHazardous ? 'hazardous classification' : 'close approach'} warrants monitoring.`;
      recommendations.push('Regular observation recommended');
      recommendations.push('Update orbital calculations monthly');
      confidence = 0.88;
    } else {
      riskLevel = 'LOW';
      analysis = `${asteroid.name} presents minimal risk. Current trajectory and size parameters indicate low threat level.`;
      recommendations.push('Standard monitoring protocols sufficient');
      recommendations.push('Quarterly trajectory verification');
      confidence = 0.85;
    }

    return {
      success: true,
      analysis: { riskLevel, analysis, recommendations, confidence },
      aiModel: 'SpaceAI Risk Assessment v2.0'
    };
  };

  const analyzeSpaceWeather = (issPosition) => {
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
      success: true,
      analysis: {
        region,
        auroraChance,
        visibility,
        analysis: `ISS is currently over ${region} region at ${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}. ${visibility} expected.`,
        recommendations: [
          auroraChance === 'High' ? 'Excellent time for aurora photography' : 'Good conditions for space observations',
          'Minimal atmospheric interference expected',
          'Optimal viewing conditions for Earth observation'
        ]
      },
      aiModel: 'SpaceAI Weather Analysis v2.0'
    };
  };

  const analyzeNews = (articles) => {
    const topics = ['SpaceX', 'Mars', 'ISS', 'NASA', 'Asteroid'];
    const trendingTopics = topics.map(topic => ({
      topic,
      mentions: Math.floor(Math.random() * 5) + 1
    }));

    return {
      success: true,
      summary: {
        text: 'Analysis of recent space industry developments reveals significant progress in Mars exploration, asteroid detection capabilities, and commercial spaceflight operations. Key developments include successful mission launches, breakthrough scientific discoveries, and enhanced planetary defense systems.',
        trendingTopics,
        keyInsights: [
          'Mars exploration missions showing promising results',
          'Asteroid detection systems operating at peak efficiency',
          'Commercial space operations expanding rapidly',
          'International cooperation in space research increasing'
        ]
      },
      aiModel: 'SpaceAI News Analysis v2.0'
    };
  };

  const classifySpaceObject = (objectData) => {
    const diameter = objectData.estimated_diameter.kilometers.estimated_diameter_max;
    const isHazardous = objectData.is_potentially_hazardous_asteroid;

    let type = 'Small Asteroid';
    let confidence = 0.85;
    let characteristics = [];

    if (diameter > 1) {
      type = 'Large Asteroid';
      confidence = 0.92;
      characteristics.push('Significant size requiring continuous monitoring');
      characteristics.push('Potential for regional impact if trajectory changes');
    } else {
      characteristics.push('Small size with limited impact potential');
      characteristics.push('Standard monitoring protocols sufficient');
    }

    if (isHazardous) {
      characteristics.push('Classified as potentially hazardous object');
    } else {
      characteristics.push('Non-hazardous classification confirmed');
    }

    return {
      success: true,
      classification: {
        type,
        confidence,
        analysis: `Object ${objectData.name} has been classified as a ${type} based on size analysis and orbital characteristics. Confidence level: ${(confidence * 100).toFixed(0)}%.`,
        characteristics
      },
      aiModel: 'SpaceAI Object Classification v2.0'
    };
  };

  const demoAsteroidAnalysis = async () => {
    setLoading(true);
    setActiveDemo('asteroid');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const sampleAsteroid = {
        name: "(2000) LF3",
        is_potentially_hazardous_asteroid: true,
        close_approach_data: [{
          miss_distance: { kilometers: "750000" },
          relative_velocity: { kilometers_per_hour: "28500" },
          close_approach_date_full: "2025-Jul-15 14:30"
        }],
        estimated_diameter: {
          kilometers: {
            estimated_diameter_min: 0.3,
            estimated_diameter_max: 0.8
          }
        }
      };

      const response = analyzeAsteroidRisk(sampleAsteroid);
      setCurrentResult({ type: 'asteroid', data: response });
    } catch (error) {
      console.error('AI Analysis failed:', error);
      setCurrentResult({ type: 'asteroid', data: { error: error.message } });
    } finally {
      setLoading(false);
    }
  };

  const demoSpaceWeather = async () => {
    setLoading(true);
    setActiveDemo('weather');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const sampleISSPosition = {
        iss_position: {
          latitude: "68.2",
          longitude: "-145.8"
        },
        timestamp: Date.now()
      };

      const response = analyzeSpaceWeather(sampleISSPosition);
      setCurrentResult({ type: 'weather', data: response });
    } catch (error) {
      console.error('Weather Analysis failed:', error);
      setCurrentResult({ type: 'weather', data: { error: error.message } });
    } finally {
      setLoading(false);
    }
  };

  const demoNewsSummary = async () => {
    setLoading(true);
    setActiveDemo('news');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1800));

    try {
      const sampleNews = [
        {
          title: "SpaceX Successfully Launches Starship Mission to Mars",
          description: "The latest Starship vehicle completed a successful orbital test flight, marking a major milestone for Mars colonization efforts."
        },
        {
          title: "NASA Discovers Potentially Hazardous Asteroid",
          description: "A new near-Earth object has been detected by NASA's planetary defense systems, requiring immediate tracking and analysis."
        },
        {
          title: "International Space Station Conducts Breakthrough Experiments",
          description: "Astronauts aboard the ISS have completed groundbreaking research in microgravity that could revolutionize medicine on Earth."
        },
        {
          title: "Mars Rover Perseverance Finds Evidence of Ancient Water",
          description: "The Perseverance rover has discovered new geological evidence suggesting Mars had flowing water for longer than previously thought."
        }
      ];

      const response = analyzeNews(sampleNews);
      setCurrentResult({ type: 'news', data: response });
    } catch (error) {
      console.error('News Analysis failed:', error);
      setCurrentResult({ type: 'news', data: { error: error.message } });
    } finally {
      setLoading(false);
    }
  };

  const demoObjectClassification = async () => {
    setLoading(true);
    setActiveDemo('classification');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1400));

    try {
      const sampleObject = {
        name: "Large Asteroid 2025-XY1",
        estimated_diameter: {
          kilometers: {
            estimated_diameter_max: 2.5,
            estimated_diameter_min: 1.8
          }
        },
        is_potentially_hazardous_asteroid: false
      };

      const response = classifySpaceObject(sampleObject);
      setCurrentResult({ type: 'classification', data: response });
    } catch (error) {
      console.error('Classification failed:', error);
      setCurrentResult({ type: 'classification', data: { error: error.message } });
    } finally {
      setLoading(false);
    }
  };

  const renderResult = (result, type) => {
    if (!result) return null;
    
    if (result.error) {
      return (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 mt-4">
          <p className="text-red-300">Error: {result.error}</p>
        </div>
      );
    }

    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <FaBrain className="text-blue-400" />
          <span className="text-sm text-gray-400">{result.aiModel || 'AI Analysis'}</span>
        </div>
        
        {type === 'asteroid' && result.analysis && (
          <div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 ${
              result.analysis.riskLevel === 'HIGH' ? 'bg-red-600 text-white' :
              result.analysis.riskLevel === 'MEDIUM' ? 'bg-yellow-600 text-white' :
              'bg-green-600 text-white'
            }`}>
              Risk Level: {result.analysis.riskLevel}
            </div>
            <p className="text-gray-300 mb-3">{result.analysis.analysis}</p>
            <div className="mb-3">
              <h4 className="text-white font-semibold mb-2">AI Recommendations:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {result.analysis.recommendations?.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
            <div className="text-sm text-gray-400">
              Confidence: {(result.analysis.confidence * 100).toFixed(0)}%
            </div>
          </div>
        )}

        {type === 'weather' && result.analysis && (
          <div>
            <p className="text-gray-300 mb-3">{result.analysis.analysis}</p>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-gray-400">Region:</span>
                <span className="text-white ml-2">{result.analysis.region}</span>
              </div>
              <div>
                <span className="text-gray-400">Aurora Chance:</span>
                <span className="text-white ml-2">{result.analysis.auroraChance}</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">System Recommendations:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {result.analysis.recommendations?.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {type === 'news' && result.summary && (
          <div>
            <p className="text-gray-300 mb-3">{result.summary.text}</p>
            <div className="mb-3">
              <h4 className="text-white font-semibold mb-2">Trending Topics:</h4>
              <div className="flex flex-wrap gap-2">
                {result.summary.trendingTopics?.map((topic, idx) => (
                  <span key={idx} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                    {topic.topic} ({topic.mentions})
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Key Insights:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {result.summary.keyInsights?.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {type === 'classification' && result.classification && (
          <div>
            <div className="mb-3">
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                {result.classification.type}
              </span>
              <span className="text-gray-400 ml-3">
                Confidence: {(result.classification.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-gray-300 mb-3">{result.classification.analysis}</p>
            <div>
              <h4 className="text-white font-semibold mb-2">Object Characteristics:</h4>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {result.classification.characteristics?.map((char, idx) => (
                  <li key={idx}>{char}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <FaRobot className="text-blue-400" />
            AI Space Analysis System
          </h1>
          <p className="text-gray-400 text-lg">
            Advanced artificial intelligence for space data analysis and threat assessment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Demo Buttons */}
          <div className="space-y-4">
            <button
              onClick={demoAsteroidAnalysis}
              disabled={loading && activeDemo === 'asteroid'}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white p-4 rounded-lg flex items-center gap-3 transition-colors"
            >
              {loading && activeDemo === 'asteroid' ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaExclamationTriangle />
              )}
              <div className="text-left">
                <div className="font-semibold">Asteroid Risk Assessment</div>
                <div className="text-sm opacity-80">Automated threat evaluation and risk classification</div>
              </div>
            </button>

            <button
              onClick={demoSpaceWeather}
              disabled={loading && activeDemo === 'weather'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-4 rounded-lg flex items-center gap-3 transition-colors"
            >
              {loading && activeDemo === 'weather' ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaChartLine />
              )}
              <div className="text-left">
                <div className="font-semibold">Space Weather Analysis</div>
                <div className="text-sm opacity-80">Atmospheric conditions and visibility forecasting</div>
              </div>
            </button>

            <button
              onClick={demoNewsSummary}
              disabled={loading && activeDemo === 'news'}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white p-4 rounded-lg flex items-center gap-3 transition-colors"
            >
              {loading && activeDemo === 'news' ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaBrain />
              )}
              <div className="text-left">
                <div className="font-semibold">Intelligence Summarization</div>
                <div className="text-sm opacity-80">Automated analysis of space industry developments</div>
              </div>
            </button>

            <button
              onClick={demoObjectClassification}
              disabled={loading && activeDemo === 'classification'}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white p-4 rounded-lg flex items-center gap-3 transition-colors"
            >
              {loading && activeDemo === 'classification' ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaRobot />
              )}
              <div className="text-left">
                <div className="font-semibold">Object Classification</div>
                <div className="text-sm opacity-80">Automated identification and categorization system</div>
              </div>
            </button>
          </div>

          {/* Results Panel */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaBrain className="text-blue-400" />
              Analysis Results
            </h3>

            {!currentResult && (
              <div className="text-center text-gray-400 py-8">
                <FaRobot className="text-4xl mx-auto mb-4 opacity-50" />
                <p>Select an analysis module to view results</p>
              </div>
            )}

            {currentResult && (
              <div>
                <div className="mb-4 p-3 bg-gray-700 rounded-lg border-l-4 border-blue-400">
                  <h4 className="text-white font-semibold">
                    {currentResult.type === 'asteroid' && 'Asteroid Risk Assessment'}
                    {currentResult.type === 'weather' && 'Space Weather Analysis'}
                    {currentResult.type === 'news' && 'Intelligence Summarization'}
                    {currentResult.type === 'classification' && 'Object Classification'}
                  </h4>
                  <p className="text-gray-400 text-sm">Analysis completed</p>
                </div>
                {renderResult(currentResult.data, currentResult.type)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDemo;
