import React, { PropsWithChildren } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import BookingForm from '../BookingForm';
import { setBookingDetails } from '../../redux/bookingSlice';
import bookingReducer from '../../redux/bookingSlice';
import userEvent from '@testing-library/user-event';

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
        {
          name: 'B',
          floors: [
            { number: '1', seats: [] },
          ],
        },
      ],
    },
    {
      venue: 'Branch Office',
      buildings: [
        {
          name: 'C',
          floors: [
            { number: '1', seats: [] },
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

  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
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

describe('BookingForm', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockClear();
  });

  test('renders booking form elements', () => {
    renderWithProviders(<BookingForm />, { preloadedState: { booking: { venue: '' } } });

    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Booking Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Venue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Building/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Floor/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select Seat/i })).toBeInTheDocument();
  });

  test('allows selecting booking type', () => {
    const { store } = renderWithProviders(<BookingForm />);

    const bookTeamRadio = screen.getByLabelText(/Book for Team/i);
    fireEvent.click(bookTeamRadio);
    expect(store.dispatch).toHaveBeenCalledWith(setBookingDetails({ ...store.getState().booking, bookingType: 'team', numberOfTeamMembers: undefined }));
  });

  test('renders number of team members input when booking type is team', () => {
    renderWithProviders(<BookingForm />, { preloadedState: { booking: { bookingType: 'team', venue: 'Main Office', building: 'A', floor: '1' } } });
    expect(screen.getByLabelText(/Number of Team Members/i)).toBeInTheDocument();
  });

  test('navigates to seat selection on form submission', async () => {
    renderWithProviders(<BookingForm />);

    await userEvent.type(screen.getByLabelText(/Date/i), '2025-07-01');
    fireEvent.change(screen.getByLabelText(/Venue/i), { target: { value: 'Main Office' } });

    // Wait for the Building dropdown to be enabled and its options to be rendered
    const buildingSelect = await screen.findByRole('combobox', { name: /Building/i, enabled: true });
    fireEvent.change(buildingSelect, { target: { value: 'A' } });

    // Wait for the Floor dropdown to be enabled and its options to be rendered
    const floorSelect = await screen.findByRole('combobox', { name: /Floor/i, enabled: true });
    fireEvent.change(floorSelect, { target: { value: '1' } });

    fireEvent.submit(screen.getByTestId('booking-form'));

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/select-seat');
  });

  test('dispatches correct action when number of team members is changed', () => {
    const { store } = renderWithProviders(<BookingForm />, {
      preloadedState: {
        booking: {
          bookingType: 'team',
          numberOfTeamMembers: 2,
          venue: 'Main Office',
          building: 'A',
          floor: '1',
          date: '2025-07-01',
        },
      },
    });
    // Make sure the input is rendered
    const input = screen.getByLabelText(/Number of Team Members/i);
    fireEvent.change(input, { target: { value: '5' } });
    expect(store.dispatch).toHaveBeenCalledWith(
      setBookingDetails({
        bookingType: 'team',
        numberOfTeamMembers: 5,
        venue: 'Main Office',
        building: 'A',
        floor: '1',
        date: '2025-07-01',
      })
    );
  });
});