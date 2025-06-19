// Simple utility function tests to demonstrate testing capability

describe('Utility Functions', () => {
  // Test basic JavaScript functionality
  test('should format date correctly', () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    expect(formatDate('2025-06-17')).toBe('June 17, 2025');
  });

  test('should calculate distance correctly', () => {
    const formatDistance = (km) => {
      if (km > 1000000) {
        return `${(km / 1000000).toFixed(2)} million km`;
      } else if (km > 1000) {
        return `${(km / 1000).toFixed(2)} thousand km`;
      }
      return `${km} km`;
    };

    expect(formatDistance(1500000)).toBe('1.50 million km');
    expect(formatDistance(2500)).toBe('2.50 thousand km');
    expect(formatDistance(500)).toBe('500 km');
  });

  test('should validate coordinates', () => {
    const isValidCoordinate = (lat, lon) => {
      return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
    };

    expect(isValidCoordinate(40.7128, -74.0060)).toBe(true); // NYC
    expect(isValidCoordinate(91, 0)).toBe(false); // Invalid lat
    expect(isValidCoordinate(0, 181)).toBe(false); // Invalid lon
  });

  test('should clean asteroid names', () => {
    const cleanAsteroidName = (name) => {
      return name.replace(/^\(\d+\)\s*/, '').replace(/\s*\(\d+.*?\)/, '').trim();
    };

    expect(cleanAsteroidName('(2000) LF3')).toBe('LF3');
    expect(cleanAsteroidName('(433) Eros')).toBe('Eros');
    expect(cleanAsteroidName('Bennu (101955)')).toBe('Bennu');
  });

  test('should determine hazard level', () => {
    const getHazardLevel = (isHazardous, missDistance) => {
      if (isHazardous && missDistance < 1000000) {
        return 'HIGH';
      } else if (isHazardous) {
        return 'MEDIUM';
      }
      return 'LOW';
    };

    expect(getHazardLevel(true, 500000)).toBe('HIGH');
    expect(getHazardLevel(true, 2000000)).toBe('MEDIUM');
    expect(getHazardLevel(false, 500000)).toBe('LOW');
  });
});
