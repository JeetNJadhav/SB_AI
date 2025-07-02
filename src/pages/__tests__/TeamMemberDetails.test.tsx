import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TeamMemberDetails from '../TeamMemberDetails';
import userEvent from '@testing-library/user-event';

// Mock react-router-dom's useNavigate and useLocation
const mockedUsedNavigate = jest.fn();
const mockedUsedLocation = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => mockedUsedLocation(), // Call the mock function directly
}));

describe('TeamMemberDetails', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
    mockedUsedLocation.mockClear();
  });

  test('renders invalid booking details message if not a team booking', () => {
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: { bookingType: 'self' },
        selectedSeats: [{ id: 1 }],
      },
    });
    render(
      <MemoryRouter>
        <TeamMemberDetails />
      </MemoryRouter>
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
      <MemoryRouter>
        <TeamMemberDetails />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Name/i, { selector: '#name-0' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i, { selector: '#email-0' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i, { selector: '#name-1' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i, { selector: '#email-1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm Team Booking/i })).toBeInTheDocument();
  });

  test('navigates to confirmation page on form submission', async () => {
    mockedUsedLocation.mockReturnValue({
      state: {
        bookingDetails: { bookingType: 'team', numberOfTeamMembers: 1 },
        selectedSeats: [{ id: 1 }],
        teamMembers: [], // Explicitly define teamMembers
      },
    });
    render(
      <MemoryRouter>
        <TeamMemberDetails />
      </MemoryRouter>
    );
    await userEvent.type(screen.getByLabelText(/Name/i, { selector: '#name-0' }), 'Test User');
    await userEvent.type(screen.getByLabelText(/Email/i, { selector: '#email-0' }), 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: /Confirm Team Booking/i }));
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
