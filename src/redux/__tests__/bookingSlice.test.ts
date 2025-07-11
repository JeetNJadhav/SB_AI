import { configureStore } from '@reduxjs/toolkit';
import bookingReducer, { setBookingDetails, addTeamMember, removeTeamMember, setTeamMembers, setSelectedSeats, clearBooking } from '../bookingSlice';

describe('bookingSlice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        booking: bookingReducer,
      },
    });
  });

  test('should return the initial state', () => {
    expect(store.getState().booking).toEqual({
      currentBooking: {
        date: '',
        venue: '',
        building: '',
        floor: '',
        bookingType: 'self',
        teamMembers: [],
        selectedSeats: [],
      },
      upcomingBookings: [],
    });
  });

  test('should handle setBookingDetails', () => {
    const newDetails = {
      date: '2025-07-01',
      venue: 'Main Office',
      building: 'A',
      floor: '1',
      bookingType: 'self',
    };
    store.dispatch(setBookingDetails(newDetails));
    expect(store.getState().booking.currentBooking).toEqual(expect.objectContaining(newDetails));
  });

  test('should handle addTeamMember', () => {
    const newMember = { name: 'John Doe', email: 'john@example.com' };
    store.dispatch(addTeamMember(newMember));
    expect(store.getState().booking.currentBooking.teamMembers).toEqual([newMember]);
  });

  test('should handle removeTeamMember', () => {
    const initialMembers = [{ name: 'John Doe', email: 'john@example.com' }, { name: 'Jane Smith', email: 'jane@example.com' }];
    store.dispatch(setTeamMembers(initialMembers));
    store.dispatch(removeTeamMember(0));
    expect(store.getState().booking.currentBooking.teamMembers).toEqual([{ name: 'Jane Smith', email: 'jane@example.com' }]);
  });

  test('should handle setTeamMembers', () => {
    const members = [{ name: 'Alice', email: 'alice@example.com' }];
    store.dispatch(setTeamMembers(members));
    expect(store.getState().booking.currentBooking.teamMembers).toEqual(members);
  });

  test('should handle clearBooking', () => {
    store.dispatch(setBookingDetails({ date: '2025-07-01', venue: 'Main Office', building: 'A', floor: '1', bookingType: 'self' }));
    store.dispatch(setSelectedSeats([{ id: 1, booked: false, selected: true }]));
    store.dispatch(setTeamMembers([{ name: 'Test', email: 'test@test.com' }]));
    store.dispatch(clearBooking());
    expect(store.getState().booking.currentBooking).toEqual({
      date: '',
      venue: '',
      building: '',
      floor: '',
      bookingType: 'self',
      teamMembers: [],
      selectedSeats: [],
    });
  });
});
