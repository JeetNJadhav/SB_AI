import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SeatSelection from '../SeatSelection';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock the locations data
jest.mock('../../data/locations', () => ({
  locations: [
    {
      venue: 'Main Office',
      buildings: [
        {
          name: 'A',
          floors: [
            { number: '1', seats: [
              { id: 1, booked: false },
              { id: 2, booked: true }
            ] },
          ],
        },
      ],
    },
  ],
}));

describe('SeatSelection', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
    window.alert = jest.fn();
  });

  test('renders message if no booking details', () => {
    render(
      <MemoryRouter initialEntries={[{ state: null }]}>
        <SeatSelection />
      </MemoryRouter>
    );
    expect(screen.getByText(/Please select booking details first./i)).toBeInTheDocument();
  });

  test('renders seat map for self booking and allows single selection', () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'self' as const,
    };

    render(
      <MemoryRouter initialEntries={[{ state: { bookingDetails } }]}>
        <SeatSelection />
      </MemoryRouter>
    );

    expect(screen.getByText(/Select a Seat/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Select seat 1
    fireEvent.click(screen.getByText('1'));
    expect(screen.getByText('1')).toHaveClass('btn-success');

    // Clicking seat 1 again should deselect it
    fireEvent.click(screen.getByText('1'));
    expect(screen.getByText('1')).toHaveClass('btn-outline-primary');

    // Clicking seat 2 (booked/disabled) should not change selection
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText('1')).toHaveClass('btn-outline-primary');

    // Select seat 1 again
    fireEvent.click(screen.getByText('1'));
    expect(screen.getByText('1')).toHaveClass('btn-success');

    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/confirm',
      expect.objectContaining({
        state: {
          bookingDetails: expect.objectContaining({ bookingType: 'self' }),
          selectedSeats: expect.arrayContaining([expect.objectContaining({ id: 1 })]),
        },
      })
    );
  });

  test('renders seat map for team booking and allows multiple selections', () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'team' as const,
      numberOfTeamMembers: 1,
    };

    render(
      <MemoryRouter initialEntries={[{ state: { bookingDetails } }]}>
        <SeatSelection />
      </MemoryRouter>
    );

    expect(screen.getByText(/Please select 1 seats for your team./i)).toBeInTheDocument();

    // Select seat 1
    fireEvent.click(screen.getByText('1'));
    expect(screen.getByText('1')).toHaveClass('btn-success');

    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/team-members',
      expect.objectContaining({
        state: {
          bookingDetails: expect.objectContaining({ bookingType: 'team' }),
          selectedSeats: expect.arrayContaining([expect.objectContaining({ id: 1 })]),
        },
      })
    );
  });

  test('shows alert if incorrect number of seats selected for self booking', () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'self' as const,
    };

    render(
      <MemoryRouter initialEntries={[{ state: { bookingDetails } }]}>
        <SeatSelection />
      </MemoryRouter>
    );

    // Do not select any seat
    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(window.alert).toHaveBeenCalledWith('Please select exactly one seat for self-booking.');
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('shows alert if incorrect number of seats selected for team booking', () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'team' as const,
      numberOfTeamMembers: 2,
    };

    render(
      <MemoryRouter initialEntries={[{ state: { bookingDetails } }]}>
        <SeatSelection />
      </MemoryRouter>
    );

    // Select only one seat
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(window.alert).toHaveBeenCalledWith('Please select exactly 2 seats for team booking.');
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});