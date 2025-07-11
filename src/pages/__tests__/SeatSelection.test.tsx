import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SeatSelection from '../SeatSelection';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('../../data/locations', () => ({
  locations: [
    {
      venue: 'Main Office',
      buildings: [
        {
          name: 'A',
          floors: [
            { number: '1', seats: [{ id: 1, booked: false }, { id: 2, booked: true }] },
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
    renderWithProviders(
      <SeatSelection onBack={() => {}} onConfirmSelection={() => {}} />,
      { preloadedState: { booking: { currentBooking: { date: '' } } } }
    );
    expect(screen.getByText(/Please select booking details first./i)).toBeInTheDocument();
  });

  test('renders seat map and allows single selection', () => {
    const onConfirmSelection = jest.fn();
    renderWithProviders(
      <SeatSelection onBack={() => {}} onConfirmSelection={onConfirmSelection} />,
      {
        preloadedState: {
          booking: {
            currentBooking: {
              date: '2025-07-01',
              venue: 'Main Office',
              building: 'A',
              floor: '1',
              bookingType: 'self',
              selectedSeats: [],
            },
          },
        },
      }
    );

    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('Confirm Booking'));

    expect(onConfirmSelection).toHaveBeenCalledWith([{ id: 1, booked: false, selected: true }], false);
  });

  test('highlights previously selected seat on update', () => {
    renderWithProviders(
      <SeatSelection onBack={() => {}} onConfirmSelection={() => {}} editingBooking={{ seatNumber: '1' }} />,
      {
        preloadedState: {
          booking: {
            currentBooking: {
              date: '2025-07-01',
              venue: 'Main Office',
              building: 'A',
              floor: '1',
              bookingType: 'self',
              selectedSeats: [],
            },
          },
        },
      }
    );

    expect(screen.getByText('1')).toHaveClass('btn-success');
  });
});