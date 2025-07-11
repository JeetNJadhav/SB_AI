import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

// Mock child components to simplify testing of Home component
jest.mock('../../components/BookingForm', () => () => <div>Mock BookingForm</div>);
jest.mock('../../components/UpcomingBookings', () => () => <div>Mock UpcomingBookings</div>);

describe('Home', () => {
  test('renders Home page with correct headings', () => {
    renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Upcoming Bookings/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Book a Seat/i })).toBeInTheDocument();
  });

  test('renders BookingForm and UpcomingBookings components', () => {
    renderWithProviders(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/Mock BookingForm/i)).toBeInTheDocument();
    expect(screen.getByText(/Mock UpcomingBookings/i)).toBeInTheDocument();
  });
});
