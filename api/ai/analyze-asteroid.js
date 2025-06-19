export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { asteroid } = req.body;
    
    if (!asteroid) {
      return res.status(400).json({ error: 'Asteroid data is required' });
    }

    const isHazardous = asteroid.is_potentially_hazardous_asteroid;
    const missDistance = asteroid.close_approach_data?.[0]?.miss_distance?.kilometers || 0;
    const diameter = asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
    
    let riskLevel = 'Low';
    let confidence = 85;
    let recommendations = [];
    
    if (isHazardous && missDistance < 1000000) {
      riskLevel = 'High';
      confidence = 95;
      recommendations.push('Continuous monitoring required');
      recommendations.push('Alert space agencies immediately');
      recommendations.push('Calculate precise trajectory');
    } else if (isHazardous || missDistance < 5000000) {
      riskLevel = 'Medium';
      confidence = 90;
      recommendations.push('Regular monitoring advised');
      recommendations.push('Track orbital changes');
    } else {
      riskLevel = 'Low';
      recommendations.push('Standard monitoring sufficient');
    }
    
    if (diameter > 1) {
      recommendations.push('Large object - potential global impact');
      confidence = Math.min(confidence + 5, 99);
    } else if (diameter > 0.1) {
      recommendations.push('Regional impact potential');
    }

    const analysis = {
      riskLevel,
      confidence,
      recommendations,
      summary: `${asteroid.name} classified as ${riskLevel} risk with ${confidence}% confidence`,
      details: {
        isPotentiallyHazardous: isHazardous,
        missDistance: `${Math.round(missDistance).toLocaleString()} km`,
        estimatedDiameter: `${diameter.toFixed(3)} km`,
        analysisDate: new Date().toISOString()
      }
    };

    res.json({ analysis });
  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    res.status(500).json({ error: error.message });
  }
}
