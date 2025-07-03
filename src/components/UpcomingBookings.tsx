import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { deleteBooking } from '../redux/bookingSlice';

interface Seat {
  id: number;
}

interface TeamMember {
  name: string;
  email: string;
}

interface Booking {
  id: number;
  date: string;
  venue: string;
  building: string;
  floor: string;
  seats: Seat[];
  bookingType: 'self' | 'team';
  teamMembers?: TeamMember[];
}

const UpcomingBookings: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.booking.upcomingBookings);

  const handleBookingClick = (booking: Booking) => {
    navigate('/', { state: { bookingToUpdate: booking } });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      dispatch(deleteBooking(id));
    }
  };

  return (
    <div>
      {bookings.length > 0 ? (
        <ul className="list-group">
          {bookings.map((booking: Booking) => (
            <li key={booking.id} className="list-group-item">
              <strong>Date:</strong> {booking.date}<br/>
              <strong>Venue:</strong> {booking.venue}<br/>
              <strong>Building:</strong> {booking.building}<br/>
              <strong>Floor:</strong> {booking.floor}<br/>
              <strong>Seats:</strong> {booking.seats.map(seat => `Seat ${seat.id}`).join(', ')}<br/>
              {booking.bookingType === 'team' && Array.isArray(booking.teamMembers) && booking.teamMembers.length > 0 && (
                <div>
                  <strong>Team Members:</strong>
                  <ul>
                    {booking.teamMembers.map((member, index) => (
                      <li key={index}>{member.name} ({member.email})</li>
                    ))}
                  </ul>
                </div>
              )}
              <button className="btn btn-sm btn-primary mt-2" onClick={() => handleBookingClick(booking)}>Update</button>
              <button className="btn btn-sm btn-danger mt-2 ms-2" onClick={() => handleDelete(booking.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming bookings.</p>
      )}
    </div>
  );
};;

export default UpcomingBookings;
