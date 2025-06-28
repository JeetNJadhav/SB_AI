// Mock react-router-dom's useNavigate and useLocation
const mockedUsedNavigate = jest.fn();
const mockedUsedLocation = jest.fn();

// Move jest.mock after these declarations
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
    useLocation: mockedUsedLocation,
  };
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import TeamMemberDetails from '../TeamMemberDetails';

describe('TeamMemberDetails', () => {
  beforeEach(() => {
    jest.resetModules();
    mockedUsedNavigate.mockClear();
    mockedUsedLocation.mockReset();
  });

  test('renders invalid booking details message if not a team booking', () => {
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: { bookingType: 'self' },
        selectedSeats: [{ id: 1 }],
      },
    });
    render(
      <Router>
        <TeamMemberDetails />
      </Router>
    );
    expect(screen.getByText(/Invalid booking details or not a team booking./i)).toBeInTheDocument();
  });

  test('renders input fields for each team member', () => {
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: { bookingType: 'team', numberOfTeamMembers: 2 },
        selectedSeats: [{ id: 1 }, { id: 2 }],
      },
    });
    render(
      <Router>
        <TeamMemberDetails />
      </Router>
    );
    expect(screen.getByLabelText(/Name/i, { selector: '#name-0' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i, { selector: '#email-0' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i, { selector: '#name-1' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i, { selector: '#email-1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm Team Booking/i })).toBeInTheDocument();
  });

  test('navigates to confirmation page on form submission', () => {
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: { bookingType: 'team', numberOfTeamMembers: 1 },
        selectedSeats: [{ id: 1 }],
      },
    });
    render(
      <Router>
        <TeamMemberDetails />
      </Router>
    );
    fireEvent.change(screen.getByLabelText(/Name/i, { selector: '#name-0' }), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i, { selector: '#email-0' }), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Confirm Team Booking/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/confirm',
      expect.objectContaining({
        state: expect.objectContaining({
          bookingDetails: expect.objectContaining({ bookingType: 'team' }),
          selectedSeats: expect.arrayContaining([expect.objectContaining({ id: 1 })]),
          teamMembers: expect.arrayContaining([
            expect.objectContaining({ name: 'Test User', email: 'test@example.com' }),
          ]),
        }),
      })
    );
  });
});
