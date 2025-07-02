import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookingDetails {
  date: string;
  venue: string;
  building: string;
  floor: string;
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

const initialState: BookingDetails = {
  date: '',
  venue: '',
  building: '',
  floor: '',
  bookingType: 'self',
  teamMembers: [],
  selectedSeats: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingDetails: (state, action: PayloadAction<BookingDetails>) => {
      return { ...state, ...action.payload };
    },
    addTeamMember: (state, action: PayloadAction<TeamMember>) => {
      state.teamMembers?.push(action.payload);
    },
    removeTeamMember: (state, action: PayloadAction<number>) => {
      state.teamMembers?.splice(action.payload, 1);
    },
    setTeamMembers: (state, action: PayloadAction<TeamMember[]>) => {
      state.teamMembers = action.payload;
    },
    setSelectedSeats: (state, action: PayloadAction<Seat[]>) => {
      state.selectedSeats = action.payload;
    },
    clearBooking: (state) => {
      state.date = '';
      state.venue = '';
      state.building = '';
      state.floor = '';
      state.bookingType = 'self';
      state.numberOfTeamMembers = undefined;
      state.teamMembers = [];
      state.selectedSeats = [];
    },
  },
});

export const { setBookingDetails, addTeamMember, removeTeamMember, setTeamMembers, setSelectedSeats, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
