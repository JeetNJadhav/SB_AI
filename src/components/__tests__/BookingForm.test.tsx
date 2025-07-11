import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookingForm from '../BookingForm';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

jest.mock('../../data/locations', () => ({
  locations: [
    {
      venue: 'Main Office',
      buildings: [
        {
          name: 'A',
          floors: [
            { number: '1', seats: [] },
            { number: '2', seats: [] },
          ],
        },
      ],
    },
  ],
}));

describe('BookingForm', () => {
  test('renders booking form elements', () => {
    renderWithProviders(
      <MemoryRouter>
        <BookingForm onFormSubmit={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Booking Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Venue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Building/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Floor/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select Seat/i })).toBeInTheDocument();
  });

  test('allows selecting booking type', () => {
    const { store } = renderWithProviders(
      <MemoryRouter>
        <BookingForm onFormSubmit={() => {}} />
      </MemoryRouter>
    );

    const bookTeamRadio = screen.getByLabelText(/Book for Team/i);
    fireEvent.click(bookTeamRadio);
    expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ payload: { bookingType: 'team' } }));
  });

  test('renders number of team members input when booking type is team', () => {
    renderWithProviders(
      <MemoryRouter>
        <BookingForm onFormSubmit={() => {}} />
      </MemoryRouter>,
      {
        preloadedState: {
          booking: {
            currentBooking: {
              bookingType: 'team',
            },
          },
        },
      }
    );
    expect(screen.getByLabelText(/Number of Team Members/i)).toBeInTheDocument();
  });

  test('calls onFormSubmit on form submission', () => {
    const onFormSubmit = jest.fn();
    renderWithProviders(
      <MemoryRouter>
        <BookingForm onFormSubmit={onFormSubmit} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-07-01' } });
    fireEvent.change(screen.getByLabelText(/Venue/i), { target: { value: 'Main Office' } });
    fireEvent.change(screen.getByLabelText(/Building/i), { target: { value: 'A' } });
    fireEvent.change(screen.getByLabelText(/Floor/i), { target: { value: '1' } });

    fireEvent.click(screen.getByRole('button', { name: /Select Seat/i }));

    expect(onFormSubmit).toHaveBeenCalled();
  });
});