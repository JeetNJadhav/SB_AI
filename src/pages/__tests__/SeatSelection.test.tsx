const mockedUsedNavigate = jest.fn();
const mockedUsedLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useLocation: mockedUsedLocation,
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

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SeatSelection from '../SeatSelection';

describe('SeatSelection', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: {
          date: '2025-07-01',
          venue: 'Main Office',
          building: 'A',
          floor: '1',
          bookingType: 'self',
        },
      },
    });
  });

  test('renders message if no booking details', () => {
    mockedUsedLocation.mockReturnValue({ state: null });
    render(
      <Router>
        <SeatSelection />
      </Router>
    );
    expect(screen.getByText(/Please select booking details first./i)).toBeInTheDocument();
  });

  test('renders seat map for self booking and allows single selection', () => {
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: {
          date: '2025-07-01',
          venue: 'Main Office',
          building: 'A',
          floor: '1',
          bookingType: 'self',
        },
      },
    });
    render(
      <Router>
        <SeatSelection />
      </Router>
    );

    expect(screen.getByText(/Select a Seat/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Select seat 1 (find the button explicitly)
    let seat1Button = screen.getAllByText('1').find(el => el.tagName === 'BUTTON');
    fireEvent.click(seat1Button!);
    seat1Button = screen.getAllByText('1').find(el => el.tagName === 'BUTTON');
    // eslint-disable-next-line no-console
    console.log('Seat 1 class:', seat1Button!.className);
    expect(seat1Button).toHaveClass('btn-success');

    // Clicking seat 1 again should deselect it
    fireEvent.click(seat1Button!);
    seat1Button = screen.getAllByText('1').find(el => el.tagName === 'BUTTON');
    expect(seat1Button).toHaveClass('btn-outline-primary');

    // Clicking seat 2 (booked/disabled) should not change selection
    const seat2Button = screen.getAllByText('2').find(el => el.tagName === 'BUTTON');
    fireEvent.click(seat2Button!);
    seat1Button = screen.getAllByText('1').find(el => el.tagName === 'BUTTON');
    expect(seat1Button).toHaveClass('btn-outline-primary');

    // Select seat 1 again
    fireEvent.click(seat1Button!);
    seat1Button = screen.getAllByText('1').find(el => el.tagName === 'BUTTON');
    expect(seat1Button).toHaveClass('btn-success');

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
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: {
          date: '2025-07-01',
          venue: 'Main Office',
          building: 'A',
          floor: '1',
          bookingType: 'team',
          numberOfTeamMembers: 1,
        },
      },
    });
    render(
      <Router>
        <SeatSelection />
      </Router>
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
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: {
          date: '2025-07-01',
          venue: 'Main Office',
          building: 'A',
          floor: '1',
          bookingType: 'self',
        },
      },
    });
    render(
      <Router>
        <SeatSelection />
      </Router>
    );

    // Do not select any seat
    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(screen.getByText(/Please select exactly one seat for self-booking./i)).toBeInTheDocument();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('shows alert if incorrect number of seats selected for team booking', () => {
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: {
          date: '2025-07-01',
          venue: 'Main Office',
          building: 'A',
          floor: '1',
          bookingType: 'team',
          numberOfTeamMembers: 2,
        },
      },
    });
    render(
      <Router>
        <SeatSelection />
      </Router>
    );

    // Select only one seat
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(screen.getByText(/Please select exactly 2 seats for team booking./i)).toBeInTheDocument();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });
});
