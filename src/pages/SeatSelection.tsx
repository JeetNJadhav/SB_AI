import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SeatMap from '../components/SeatMap';
import { locations } from '../data/locations';

interface BookingDetails {
  date: string;
  venue: string;
  building: string;
  floor: string;
  bookingType: 'self' | 'team';
  numberOfTeamMembers?: number;
}

interface Seat {
  id: number;
  booked: boolean;
  selected: boolean;
}

const SeatSelection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails } = (location.state as { bookingDetails: BookingDetails }) || {};

  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    if (bookingDetails) {
      const selectedVenue = locations.find(loc => loc.venue === bookingDetails.venue);
      const selectedBuilding = selectedVenue?.buildings.find(bld => bld.name === bookingDetails.building);
      const selectedFloor = selectedBuilding?.floors.find(flr => flr.number === bookingDetails.floor);

      if (selectedFloor) {
        setSeats(selectedFloor.seats.map(seat => ({ ...seat, selected: false })));
      }
    }
  }, [bookingDetails]);

  const handleSelect = (id: number) => {
    setSeats(prevSeats => {
      if (bookingDetails.bookingType === 'self') {
        // Only one seat can be selected at a time
        return prevSeats.map(seat =>
          seat.id === id ? { ...seat, selected: !seat.selected } : { ...seat, selected: false }
        );
      } else if (bookingDetails.bookingType === 'team') {
        // For team-booking, allow multiple selections up to numberOfTeamMembers
        const newSeats = prevSeats.map(seat =>
          seat.id === id ? { ...seat, selected: !seat.selected } : seat
        );
        const currentlySelected = newSeats.filter(seat => seat.selected).length;
        const targetCount = bookingDetails.numberOfTeamMembers || 0;
        const isSelecting = newSeats.find(seat => seat.id === id)?.selected;
        if (isSelecting && currentlySelected > targetCount) {
          return prevSeats;
        }
        return newSeats;
      }
      return prevSeats;
    });
  };

  const handleConfirm = () => {
    const selectedSeats = seats.filter(seat => seat.selected);

    if (bookingDetails.bookingType === 'self') {
      if (selectedSeats.length === 1) {
        navigate('/confirm', { state: { bookingDetails, selectedSeats } });
      } else {
        alert('Please select exactly one seat for self-booking.');
      }
    } else if (bookingDetails.bookingType === 'team') {
      const targetCount = bookingDetails.numberOfTeamMembers || 0;
      if (selectedSeats.length === targetCount) {
        navigate('/team-members', { state: { bookingDetails, selectedSeats } });
      } else {
        alert(`Please select exactly ${targetCount} seats for team booking.`);
      }
    }
  };

  if (!bookingDetails) {
    return <div>Please select booking details first.</div>;
  }

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
      <SeatMap seats={seats} onSelect={handleSelect} />
      <button className="btn btn-primary mt-3" onClick={handleConfirm}>Confirm Booking</button>
    </div>
  );
};

export default SeatSelection;
