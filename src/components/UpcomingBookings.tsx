import React from 'react';

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

const UpcomingBookings: React.FC<{ bookings?: Booking[] }> = ({ bookings: propBookings }) => {
  const defaultBookings: Booking[] = [
    { id: 1, date: '2025-07-10', venue: 'Main Office', building: 'A', floor: '3', seats: [{ id: 12 }], bookingType: 'self' },
    { id: 2, date: '2025-07-15', venue: 'Branch Office', building: 'B', floor: '2', seats: [{ id: 5 }, { id: 6 }], bookingType: 'team', teamMembers: [{ name: 'John Doe', email: 'john@example.com' }, { name: 'Jane Smith', email: 'jane@example.com' }] },
  ];

  const bookings = propBookings || defaultBookings;

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
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming bookings.</p>
      )}
    </div>
  );
};

export default UpcomingBookings;
