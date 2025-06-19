import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import APOD from '../APOD';

// Mock API request utility
jest.mock('../../../config/api', () => ({
  apiRequest: jest.fn(),
  buildQueryString: jest.fn((params) => new URLSearchParams(params).toString()),
  API_ENDPOINTS: {
    NASA: {
      APOD: 'http://localhost:5001/api/nasa/apod'
    }
  }
}));

import { apiRequest } from '../../../config/api';

describe('APOD Component', () => {
  const mockAPODData = [
    {
      date: '2025-06-17',
      title: 'Test Astronomy Picture',
      explanation: 'This is a test explanation for the astronomy picture of the day.',
      url: 'https://example.com/test-image.jpg',
      media_type: 'image',
      copyright: 'Test Photographer'
    },
    {
      date: '2025-06-16',
      title: 'Another Test Picture',
      explanation: 'Another test explanation.',
      url: 'https://example.com/test-image2.jpg',
      media_type: 'image'
    }
  ];

  beforeEach(() => {
    apiRequest.mockClear();
    apiRequest.mockResolvedValue(mockAPODData);
  });

  test('renders loading state initially', () => {
    render(<APOD />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders APOD data after loading', async () => {
    render(<APOD />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Astronomy Picture')).toBeInTheDocument();
      expect(screen.getByText('Another Test Picture')).toBeInTheDocument();
    });
  });

  test('displays APOD images', async () => {
    render(<APOD />);
    
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute('src', 'https://example.com/test-image.jpg');
      expect(images[1]).toHaveAttribute('src', 'https://example.com/test-image2.jpg');
    });
  });

  test('displays copyright information when available', async () => {
    render(<APOD />);
    
    await waitFor(() => {
      expect(screen.getByText(/Test Photographer/)).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    apiRequest.mockRejectedValue(new Error('API Error'));
    
    render(<APOD />);
    
    await waitFor(() => {
      // Component should handle error without crashing
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  test('calls API with correct parameters', async () => {
    render(<APOD />);
    
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith(
        expect.stringContaining('nasa/apod')
      );
    });
  });

  test('renders without crashing', () => {
    expect(() => render(<APOD />)).not.toThrow();
  });
});
