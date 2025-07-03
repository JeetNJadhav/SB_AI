import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SeatMap from '../components/SeatMap';
import { locations } from '../data/locations';
import { RootState } from '../redux/store';
import { setSelectedSeats } from '../redux/bookingSlice';

interface Seat {
  id: number;
  booked: boolean;
  selected: boolean;
}

const SeatSelection: React.FC<{ onBack: () => void; onConfirmSelection: (selectedSeats: Seat[], isUpdate: boolean) => void }> = ({ onBack, onConfirmSelection }) => {
  const dispatch = useDispatch();
  const bookingDetails = useSelector((state: RootState) => state.booking.currentBooking);
  const storedSelectedSeats = useSelector((state: RootState) => {
    console.log('storedSelectedSeats from Redux (selector):', state.booking.currentBooking.selectedSeats);
    return state.booking.currentBooking.selectedSeats;
  });

  const handleSelect = (id: number) => {
    console.log('handleSelect called for ID:', id);
    const currentSelectedSeats = storedSelectedSeats ? [...storedSelectedSeats] : [];
    const clickedSeatFromLocations = selectedFloor?.seats.find(seat => seat.id === id);

    if (!clickedSeatFromLocations) {
      console.log('Clicked seat not found in locations data.');
      return;
    }

    let newSelectedSeats: Seat[] = [];

    if (bookingDetails.bookingType === 'self') {
      const isAlreadySelected = currentSelectedSeats.some(seat => seat.id === id);
      newSelectedSeats = isAlreadySelected ? [] : [{ ...clickedSeatFromLocations, selected: true, booked: clickedSeatFromLocations.booked }];
      console.log('Self booking - newSelectedSeats:', newSelectedSeats);
    } else if (bookingDetails.bookingType === 'team') {
      const targetCount = bookingDetails.numberOfTeamMembers || 0;
      const isAlreadySelected = currentSelectedSeats.some(seat => seat.id === id);

      if (isAlreadySelected) {
        newSelectedSeats = currentSelectedSeats.filter(seat => seat.id !== id);
        console.log('Team booking - deselecting - newSelectedSeats:', newSelectedSeats);
      } else {
        if (currentSelectedSeats.length < targetCount) {
          newSelectedSeats = [...currentSelectedSeats, { ...clickedSeatFromLocations, selected: true, booked: clickedSeatFromLocations.booked }];
          console.log('Team booking - selecting - newSelectedSeats:', newSelectedSeats);
        } else {
          alert(`You can select a maximum of ${targetCount} seats for your team.`);
          console.log('Team booking - selection limit reached.');
          return;
        }
      }
    } else {
      console.log('Default branch hit in handleSelect');
      return;
    }
    dispatch(setSelectedSeats(newSelectedSeats));
    console.log('Dispatching newSelectedSeats:', newSelectedSeats);
  };

  const handleConfirm = () => {
    const isUpdate = !!bookingDetails.id;

    if (!bookingDetails || !bookingDetails.date) {
      console.log('Booking details missing before confirm.');
      return;
    }

    if (bookingDetails.bookingType === 'self') {
      if (storedSelectedSeats && storedSelectedSeats.length === 1) {
        onConfirmSelection(storedSelectedSeats, isUpdate);
      } else {
        alert('Please select exactly one seat for self-booking.');
      }
    } else if (bookingDetails.bookingType === 'team') {
      const targetCount = bookingDetails.numberOfTeamMembers || 0;
      if (storedSelectedSeats && storedSelectedSeats.length === targetCount) {
        onConfirmSelection(storedSelectedSeats, isUpdate);
      } else {
        alert(`Please select exactly ${targetCount} seats for team booking.`);
      }
    }
  };

  if (!bookingDetails || !bookingDetails.date) {
    return <div>Please select booking details first.</div>;
  }

  const selectedVenue = locations.find(loc => loc.venue === bookingDetails.venue);
  const selectedBuilding = selectedVenue?.buildings.find(bld => bld.name === bookingDetails.building);
  const selectedFloor = selectedBuilding?.floors.find(flr => flr.number === bookingDetails.floor);

  const displaySeats = selectedFloor ? selectedFloor.seats.map(seat => {
    const isSelected = storedSelectedSeats?.some(s => s.id === seat.id);
    const isBooked = seat.booked; // Assuming 'booked' status comes from locations data
    return { ...seat, selected: isSelected || false, booked: isBooked };
  }) : [];

  console.log('displaySeats before render:', displaySeats);

  return (
    <div className="container mt-4">
      <h2>Select a Seat</h2>
      <p>Date: {bookingDetails.date}</p>
      <p>Venue: {bookingDetails.venue}</p>
      <p>Building: {bookingDetails.building}</p>
      <p>Floor: {bookingDetails.floor}</p>
      {bookingDetails.bookingType === 'team' && (
        <p>Please select {bookingDetails.numberOfTeamMembers} seats for your team.</p>
      )}
      <SeatMap seats={displaySeats} onSelect={handleSelect} />
      <button className="btn btn-primary mt-3" onClick={handleConfirm}>Confirm Booking</button>
      <button className="btn btn-secondary mt-3 ms-2" onClick={onBack}>Back to Booking Details</button>
    </div>
  );
};

export default SeatSelection;