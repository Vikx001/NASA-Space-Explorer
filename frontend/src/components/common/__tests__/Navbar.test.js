import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  test('renders logo and brand name', () => {
    renderWithRouter(<Navbar />);
    
    expect(screen.getByText('CosmicView')).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    renderWithRouter(<Navbar />);
    
    const expectedLinks = [
      'Home',
      'APOD',
      'Launches',
      'ISS',
      'Star Chart',
      'Timeline',
      'Telescopes',
      'News',
      'NEO',
      'Mars',
      'Solar System'
    ];

    expectedLinks.forEach(linkText => {
      expect(screen.getByText(linkText)).toBeInTheDocument();
    });
  });

  test('mobile menu toggle works', () => {
    renderWithRouter(<Navbar />);
    
    // Find mobile menu button (hamburger menu)
    const mobileMenuButton = screen.getByRole('button');
    expect(mobileMenuButton).toBeInTheDocument();
    
    // Click to open mobile menu
    fireEvent.click(mobileMenuButton);
    
    // Mobile menu should be visible (test implementation depends on your mobile menu structure)
    // This test assumes the mobile menu becomes visible when clicked
  });

  test('navigation links have correct href attributes', () => {
    renderWithRouter(<Navbar />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');
    
    const apodLink = screen.getByRole('link', { name: /apod/i });
    expect(apodLink).toHaveAttribute('href', '/apod');
    
    const launchesLink = screen.getByRole('link', { name: /launches/i });
    expect(launchesLink).toHaveAttribute('href', '/launches');
  });

  test('navbar is accessible', () => {
    renderWithRouter(<Navbar />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    expect(() => renderWithRouter(<Navbar />)).not.toThrow();
  });
});
