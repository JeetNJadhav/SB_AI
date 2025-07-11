import React, { useState, useEffect } from "react";
import axios from "axios";

interface Booking {
  _id: string;
  date: string;
  venue: string;
  building: string;
  floor: string;
  seatNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

const UpcomingBookings: React.FC<{ onUpdate: (booking: Booking) => void }> = ({ onUpdate }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/bookings");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (_id: string) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await axios.delete(`http://localhost:3001/api/bookings/${_id}`);
        setBookings(bookings.filter((booking) => booking._id !== _id));
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking. Please try again.");
      }
    }
  };

  return (
    <div>
      {bookings.length > 0 ? (
        <ul className="list-group">
          {bookings.map((booking: Booking) => (
            <li key={booking._id} className="list-group-item">
              <strong>Date:</strong> {booking.date}
              <br />
              <strong>Venue:</strong> {booking.venue}
              <br />
              <strong>Building:</strong> {booking.building}
              <br />
              <strong>Floor:</strong> {booking.floor}
              <br />
              <strong>Seat:</strong> {booking.seatNumber}
              <br />
              <strong>Booked by:</strong> {booking.user.name} (
              {booking.user.email})<br />
              <button
                className="btn btn-sm btn-primary mt-2"
                onClick={() => onUpdate(booking)}
              >
                Update
              </button>
              <button
                className="btn btn-sm btn-danger mt-2 ms-2"
                onClick={() => handleDelete(booking._id)}
              >
                Delete
              </button>
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
