import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../Home';

// Mock child components to simplify testing of Home component
jest.mock('../../components/BookingForm', () => () => <div>Mock BookingForm</div>);
jest.mock('../../components/UpcomingBookings', () => () => <div>Mock UpcomingBookings</div>);

describe('Home', () => {
  test('renders Home page with correct headings', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    expect(screen.getByRole('heading', { name: /Upcoming Bookings/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Book a Seat/i })).toBeInTheDocument();
  });

  test('renders BookingForm and UpcomingBookings components', () => {
    render(
      <Router>
        <Home />
      </Router>
    );

    expect(screen.getByText(/Mock BookingForm/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock UpcomingBookings/i)).toBeInTheDocument();
  });
});
