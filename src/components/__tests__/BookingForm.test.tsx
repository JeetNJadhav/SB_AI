import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import BookingForm from '../BookingForm';

// Mock react-router-dom's useNavigate
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('BookingForm', () => {
  test('renders booking form elements', () => {
    render(
      <Router>
        <BookingForm />
      </Router>
    );

    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Booking Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Venue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Building/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Floor/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select Seat/i })).toBeInTheDocument();
  });

  test('allows selecting booking type', () => {
    render(
      <Router>
        <BookingForm />
      </Router>
    );

    const bookTeamRadio = screen.getByLabelText(/Book for Team/i);
    fireEvent.click(bookTeamRadio);
    expect(screen.getByLabelText(/Number of Team Members/i)).toBeInTheDocument();

    const bookSelfRadio = screen.getByLabelText(/Book for Self/i);
    fireEvent.click(bookSelfRadio);
    expect(screen.queryByLabelText(/Number of Team Members/i)).not.toBeInTheDocument();
  });

  test('navigates to seat selection on form submission for self booking', () => {
    render(
      <Router>
        <BookingForm />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-07-01' } });
    fireEvent.change(screen.getByLabelText(/Venue/i), { target: { value: 'Main Office' } });
    fireEvent.change(screen.getByLabelText(/Building/i), { target: { value: 'A' } });
    fireEvent.change(screen.getByLabelText(/Floor/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /Select Seat/i }));

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/select-seat',
      expect.objectContaining({
        state: {
          bookingDetails: expect.objectContaining({
            date: '2025-07-01',
            venue: 'Main Office',
            building: 'A',
            floor: '1',
            bookingType: 'self',
          }),
        },
      })
    );
  });

  test('navigates to seat selection on form submission for team booking', () => {
    render(
      <Router>
        <BookingForm />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-07-01' } });
    fireEvent.click(screen.getByLabelText(/Book for Team/i));
    fireEvent.change(screen.getByLabelText(/Number of Team Members/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/Venue/i), { target: { value: 'Main Office' } });
    fireEvent.change(screen.getByLabelText(/Building/i), { target: { value: 'A' } });
    fireEvent.change(screen.getByLabelText(/Floor/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /Select Seat/i }));

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/select-seat',
      expect.objectContaining({
        state: {
          bookingDetails: expect.objectContaining({
            date: '2025-07-01',
            venue: 'Main Office',
            building: 'A',
            floor: '1',
            bookingType: 'team',
            numberOfTeamMembers: 3,
          }),
        },
      })
    );
  });
});
