import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

interface TeamMember {
  name: string;
  email: string;
}

interface LocationState {
  bookingDetails: BookingDetails;
  selectedSeats: Seat[];
  teamMembers?: TeamMember[];
}

const Confirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails, selectedSeats, teamMembers } = (location.state as LocationState) || {};

  const handlePayment = () => {
    // In a real application, you would send booking data to a backend here
    console.log('Booking Confirmed:', { bookingDetails, selectedSeats, teamMembers });
    navigate('/payment');
  };

  if (!bookingDetails || !selectedSeats) {
    return <div>Invalid booking details.</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Confirm Your Booking</h2>
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
      <button className="btn btn-primary" onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default Confirmation;
