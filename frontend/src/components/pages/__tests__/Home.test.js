import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  useTransform: () => 0,
}));

// Mock API endpoints
jest.mock('../../../config/api', () => ({
  API_ENDPOINTS: {
    EXTERNAL: {
      IMAGES: jest.fn((type) => `https://example.com/${type}.jpg`)
    }
  }
}));

// Mock API request utility
jest.mock('../../../config/api', () => ({
  apiRequest: jest.fn(),
  API_ENDPOINTS: {
    EXTERNAL: {
      IMAGES: jest.fn((type) => `https://example.com/${type}.jpg`)
    }
  }
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders welcome message', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText('WELCOME TO COSMICVIEW')).toBeInTheDocument();
    expect(screen.getByText(/Dive into the depths of the universe/)).toBeInTheDocument();
  });

  test('renders feature cards', async () => {
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Explore the Cosmos')).toBeInTheDocument();
      expect(screen.getByText('Real-Time Data')).toBeInTheDocument();
      expect(screen.getByText('Interactive Experience')).toBeInTheDocument();
    });
  });

  test('renders navigation links', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText('Start Exploring')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    renderWithRouter(<Home />);
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('WELCOME TO COSMICVIEW');
  });

  test('renders without crashing', () => {
    expect(() => renderWithRouter(<Home />)).not.toThrow();
  });
});
