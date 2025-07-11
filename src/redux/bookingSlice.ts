import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookingDetails {
  id?: string;
  date: string;
  venue: string;
  building: string;
  floor: string;
  seatNumber?: string;
  bookingType: 'self' | 'team';
  numberOfTeamMembers?: number;
  teamMembers?: TeamMember[];
  selectedSeats?: Seat[];
}

export interface TeamMember {
  name: string;
  email: string;
}

export interface Seat {
  id: number;
  booked: boolean;
  selected: boolean;
}

interface BookingState {
  currentBooking: BookingDetails;
  upcomingBookings: BookingDetails[];
}

const initialState: BookingState = {
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
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingDetails: (state, action: PayloadAction<BookingDetails>) => {
      state.currentBooking = { ...state.currentBooking, ...action.payload };
    },
    addTeamMember: (state, action: PayloadAction<TeamMember>) => {
      state.currentBooking.teamMembers?.push(action.payload);
    },
    removeTeamMember: (state, action: PayloadAction<number>) => {
      state.currentBooking.teamMembers?.splice(action.payload, 1);
    },
    setTeamMembers: (state, action: PayloadAction<TeamMember[]>) => {
      state.currentBooking.teamMembers = action.payload;
    },
    setSelectedSeats: (state, action: PayloadAction<Seat[]>) => {
      state.currentBooking.selectedSeats = action.payload;
    },
    addBooking: (state, action: PayloadAction<BookingDetails>) => {
      const newBooking = { ...action.payload, id: action.payload.id };
      state.upcomingBookings.push(newBooking);
      state.currentBooking = initialState.currentBooking; // Clear current booking after adding
    },
    updateBooking: (state, action: PayloadAction<BookingDetails>) => {
      const index = state.upcomingBookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.upcomingBookings[index] = action.payload;
      }
      state.currentBooking = initialState.currentBooking; // Clear current booking after updating
    },
    clearBooking: (state) => {
      state.currentBooking = initialState.currentBooking;
    },
    deleteBooking: (state, action: PayloadAction<string>) => {
      state.upcomingBookings = state.upcomingBookings.filter(booking => booking.id !== action.payload);
    },
  },
});

export const { setBookingDetails, addTeamMember, removeTeamMember, setTeamMembers, setSelectedSeats, addBooking, updateBooking, clearBooking, deleteBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
