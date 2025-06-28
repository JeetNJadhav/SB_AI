import React from 'react';
import BookingForm from '../components/BookingForm';
import UpcomingBookings from '../components/UpcomingBookings';

const Home: React.FC = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <h2>Upcoming Bookings</h2>
          <UpcomingBookings />
        </div>
        <div className="col-md-8">
          <h2>Book a Seat</h2>
          <BookingForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
