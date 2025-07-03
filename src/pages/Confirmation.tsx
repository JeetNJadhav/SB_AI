import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addBooking, updateBooking, clearBooking } from '../redux/bookingSlice';

interface BookingDetails {
  id?: number;
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

interface TeamMember {
  name: string;
  email: string;
}

interface LocationState {
  bookingDetails: BookingDetails;
  selectedSeats: Seat[];
  teamMembers?: TeamMember[];
  isUpdate?: boolean;
}

const Confirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { bookingDetails, selectedSeats, teamMembers, isUpdate } = (location.state as LocationState) || {};

  const handlePayment = () => {
    const bookingData = {
      ...bookingDetails,
      seats: selectedSeats,
      teamMembers: teamMembers || [],
    };

    if (isUpdate) {
      dispatch(updateBooking(bookingData));
    } else {
      dispatch(addBooking(bookingData));
    }
    dispatch(clearBooking());
    navigate('/payment');
  };

  if (!bookingDetails || !selectedSeats) {
    return <div>Invalid booking details.</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{isUpdate ? 'Confirm Your Updated Booking' : 'Confirm Your Booking'}</h2>
      <p>Date: {bookingDetails.date}</p>
      <p>Venue: {bookingDetails.venue}</p>
      <p>Building: {bookingDetails.building}</p>
      <p>Floor: {bookingDetails.floor}</p>
      {bookingDetails.bookingType === 'self' ? (
        <p>Selected Seat: {selectedSeats[0]?.id}</p>
      ) : (
        <div>
          <p>Selected Seats:</p>
          <ul>
            {selectedSeats.map(seat => (
              <li key={seat.id}>Seat {seat.id}</li>
            ))}
          </ul>
          {teamMembers && teamMembers.length > 0 && (
            <div>
              <p>Team Members:</p>
              <ul>
                {teamMembers.map((member, index) => (
                  <li key={index}>{member.name} ({member.email})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <button className="btn btn-primary" onClick={handlePayment}>{isUpdate ? 'Update Booking' : 'Pay Now'}</button>
    </div>
  );
};

export default Confirmation;
