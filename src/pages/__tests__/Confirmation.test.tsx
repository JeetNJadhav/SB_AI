import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Confirmation from '../Confirmation';

// Mock react-router-dom's useNavigate and useLocation
const mockedUsedNavigate = jest.fn();
const mockedUsedLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => mockedUsedLocation,
}));

describe('Confirmation', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
  });

  test('renders invalid booking details message if no booking details or selected seats', () => {
    mockedUsedLocation.mockReturnValue({ state: null });
    render(
      <Router>
        <Confirmation />
      </Router>
    );
    expect(screen.getByText(/Invalid booking details./i)).toBeInTheDocument();
  });

  test('renders self-booking confirmation correctly', () => {
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: {
          date: '2025-07-01',
          venue: 'Main Office',
          building: 'A',
          floor: '1',
          bookingType: 'self',
        },
        selectedSeats: [{ id: 10, booked: false, selected: true }],
      },
    });
    render(
      <Router>
        <Confirmation />
      </Router>
    );

    expect(screen.getByText(/Confirm Your Booking/i)).toBeInTheDocument();
    expect(screen.getByText(/Date: 2025-07-01/i)).toBeInTheDocument();
    expect(screen.getByText(/Venue: Main Office/i)).toBeInTheDocument();
    expect(screen.getByText(/Building: A/i)).toBeInTheDocument();
    expect(screen.getByText(/Floor: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Selected Seat: 10/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pay Now/i })).toBeInTheDocument();
  });

  test('renders team-booking confirmation correctly with team members', () => {
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: {
          date: '2025-07-02',
          venue: 'Branch Office',
          building: 'B',
          floor: '2',
          bookingType: 'team',
          numberOfTeamMembers: 2,
        },
        selectedSeats: [
          { id: 5, booked: false, selected: true },
          { id: 6, booked: false, selected: true },
        ],
        teamMembers: [
          { name: 'John Doe', email: 'john@example.com' },
          { name: 'Jane Smith', email: 'jane@example.com' },
        ],
      },
    });
    render(
      <Router>
        <Confirmation />
      </Router>
    );

    expect(screen.getByText(/Confirm Your Booking/i)).toBeInTheDocument();
    expect(screen.getByText(/Date: 2025-07-02/i)).toBeInTheDocument();
    expect(screen.getByText(/Venue: Branch Office/i)).toBeInTheDocument();
    expect(screen.getByText(/Building: B/i)).toBeInTheDocument();
    expect(screen.getByText(/Floor: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Selected Seats:/i)).toBeInTheDocument();
    expect(screen.getByText(/Seat 5/i)).toBeInTheDocument();
    expect(screen.getByText(/Seat 6/i)).toBeInTheDocument();
    expect(screen.getByText(/Team Members:/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe \(john@example.com\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith \(jane@example.com\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pay Now/i })).toBeInTheDocument();
  });

  test('navigates to payment page on Pay Now click', () => {
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: {
          date: '2025-07-01',
          venue: 'Main Office',
          building: 'A',
          floor: '1',
          bookingType: 'self',
        },
        selectedSeats: [{ id: 10, booked: false, selected: true }],
      },
    });
    render(
      <Router>
        <Confirmation />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /Pay Now/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/payment');
  });
});
