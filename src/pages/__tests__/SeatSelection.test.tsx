import React, { PropsWithChildren } from 'react';
import { screen, fireEvent, render } from '@testing-library/react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import SeatSelection from '../SeatSelection';
import bookingReducer from '../../redux/bookingSlice';
import userEvent from '@testing-library/user-event';

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
              { id: 2, booked: false }
            ] },
          ],
        },
      ],
    },
  ],
}));

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

interface RenderOptions {
  preloadedState?: any;
  store?: any;
  route?: string;
}

const rootReducer = combineReducers({
  booking: bookingReducer,
});

function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState, store = configureStore({ reducer: rootReducer, preloadedState }), route = '/', ...renderOptions }: RenderOptions = {}
) {
  const mockedStore = {
    ...store,
    dispatch: jest.fn(),
  };

  function Wrapper({ children }: PropsWithChildren<{}>) {
    return (
      <Provider store={mockedStore}>
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }
  return { store: mockedStore, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

describe('SeatSelection', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
    window.alert = jest.fn();
  });

  test('renders message if no booking details', () => {
    renderWithProviders(<SeatSelection />, { preloadedState: { booking: {} } });
    expect(screen.getByText(/Please select booking details first./i)).toBeInTheDocument();
  });

  test('renders seat map for self booking and allows single selection', async () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'self',
    };

    renderWithProviders(<SeatSelection />, { preloadedState: { booking: bookingDetails } });

    expect(screen.getByText(/Select a Seat/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // Select seat 1
    fireEvent.click(screen.getByText('1'));
    expect(screen.getByText('1')).toHaveClass('btn-success');

    await userEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/confirm',
      expect.objectContaining({
        state: {
          selectedSeats: expect.arrayContaining([expect.objectContaining({ id: 1 })]),
        },
      })
    );
  });

  test('renders seat map for team booking and allows multiple selections', async () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'team',
      numberOfTeamMembers: 2,
    };

    renderWithProviders(<SeatSelection />, { preloadedState: { booking: bookingDetails } });

    expect(screen.getByText(/Please select 2 seats for your team./i)).toBeInTheDocument();

    // Select seat 1
    fireEvent.click(screen.getByText('1'));
    expect(screen.getByText('1')).toHaveClass('btn-success');

    // Select seat 2 (booked, should not be selectable)
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText('2')).toHaveClass('btn-success'); // Now selectable

    await userEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    // Should navigate to team-members with selected seat 1
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/team-members',
      expect.objectContaining({
        state: {
          selectedSeats: expect.arrayContaining([expect.objectContaining({ id: 1 })]),
        },
      })
    );
  });

  test('shows alert if incorrect number of seats selected for self booking', async () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'self',
    };

    renderWithProviders(<SeatSelection />, { preloadedState: { booking: bookingDetails } });

    // Do not select any seat
    await userEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(window.alert).toHaveBeenCalledWith('Please select exactly one seat for self-booking.');
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('shows alert if incorrect number of seats selected for team booking', async () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'team',
      numberOfTeamMembers: 2,
    };

    renderWithProviders(<SeatSelection />, { preloadedState: { booking: bookingDetails } });

    // Select only one seat
    fireEvent.click(screen.getByText('1'));
    await userEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(window.alert).toHaveBeenCalledWith('Please select exactly 2 seats for team booking.');
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('shows alert if incorrect number of seats selected for team booking (zero selected)', async () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'team',
      numberOfTeamMembers: 2,
    };

    renderWithProviders(<SeatSelection />, { preloadedState: { booking: bookingDetails } });

    // Do not select any seat
    await userEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(window.alert).toHaveBeenCalledWith('Please select exactly 2 seats for team booking.');
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('shows alert if more than required seats are selected for team booking', async () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'team',
      numberOfTeamMembers: 2,
    };

    renderWithProviders(<SeatSelection />, { preloadedState: { booking: bookingDetails } });

    // Select only one seat
    fireEvent.click(screen.getByText('1'));
    await userEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(window.alert).toHaveBeenCalledWith('Please select exactly 2 seats for team booking.');
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('shows alert if no seats are selected for team booking', async () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'team',
      numberOfTeamMembers: 2,
    };

    renderWithProviders(<SeatSelection />, { preloadedState: { booking: bookingDetails } });

    // Do not select any seat
    await userEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(window.alert).toHaveBeenCalledWith('Please select exactly 2 seats for team booking.');
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('navigates to team-members if required number of seats are selected for team booking', async () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'team',
      numberOfTeamMembers: 2,
    };

    renderWithProviders(<SeatSelection />, { preloadedState: { booking: bookingDetails } });

    // Select two seats
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    await userEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/team-members',
      expect.objectContaining({
        state: {
          selectedSeats: expect.arrayContaining([
            expect.objectContaining({ id: 1 }),
            expect.objectContaining({ id: 2 })
          ]),
        },
      })
    );
  });

  test('prevents selecting more seats than numberOfTeamMembers for team booking', () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'team',
      numberOfTeamMembers: 1,
    };

    renderWithProviders(<SeatSelection />, { preloadedState: { booking: bookingDetails } });

    // Select seat 1
    fireEvent.click(screen.getByText('1'));
    expect(screen.getByText('1')).toHaveClass('btn-success');

    // Attempt to select seat 2 (should not be allowed as numberOfTeamMembers is 1)
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText('2')).not.toHaveClass('btn-success');
    expect(screen.getByText('1')).toHaveClass('btn-success'); // Seat 1 should remain selected
  });

  test('does not allow seat selection if booking type is invalid', () => {
    renderWithProviders(<SeatSelection />, { preloadedState: { booking: { date: '2025-07-01', venue: 'Main Office', building: 'A', floor: '1', bookingType: 'invalid' } } });
    fireEvent.click(screen.getByText('1'));
    expect(screen.getByText('1')).not.toHaveClass('btn-success');
  });

  test('does not change seat selection if bookingType is not self or team', () => {
    const bookingDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'other', // unexpected value
    };

    const { container } = renderWithProviders(<SeatSelection />, { preloadedState: { booking: bookingDetails } });

    // Initially, no seat is selected
    expect(container.querySelector('.btn-success')).toBeNull();

    // Try to select seat 1
    fireEvent.click(screen.getByText('1'));

    // Still, no seat should be selected
    expect(container.querySelector('.btn-success')).toBeNull();
  });
});
