import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BookingForm from '../components/BookingForm';
import UpcomingBookings from '../components/UpcomingBookings';
import SeatSelection from '../pages/SeatSelection'; // Import SeatSelection
import { setBookingDetails, BookingDetails } from '../redux/bookingSlice';
import { RootState } from '../redux/store';

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentBooking = useSelector((state: RootState) => state.booking.currentBooking);

  const [showSeatSelection, setShowSeatSelection] = useState(false);

  useEffect(() => {
    if (location.state && location.state.bookingToUpdate) {
      const { bookingToUpdate } = location.state;
      dispatch(setBookingDetails({
        id: bookingToUpdate.id,
        date: bookingToUpdate.date,
        venue: bookingToUpdate.venue,
        building: bookingToUpdate.building,
        floor: bookingToUpdate.floor,
        bookingType: bookingToUpdate.bookingType,
        numberOfTeamMembers: bookingToUpdate.numberOfTeamMembers,
        teamMembers: bookingToUpdate.teamMembers,
        selectedSeats: bookingToUpdate.seats.map((seat: { id: number }) => ({ ...seat, booked: false, selected: true }))
      }));
      setShowSeatSelection(true); // Show seat selection if updating a booking
      window.history.replaceState({}, document.title);
    }
  }, [location.state, dispatch]);

  const handleBookingFormSubmit = () => {
    setShowSeatSelection(true);
  };

  const handleBackToBookingForm = () => {
    setShowSeatSelection(false);
  };

  const handleConfirmSelection = (selectedSeats: any[], isUpdate: boolean) => {
    if (currentBooking.bookingType === 'team') {
      navigate('/team-members', { state: { bookingDetails: currentBooking, selectedSeats, isUpdate } });
    } else {
      navigate('/confirm', { state: { bookingDetails: currentBooking, selectedSeats, isUpdate } });
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <h2>Upcoming Bookings</h2>
          <UpcomingBookings />
        </div>
        <div className="col-md-8">
          {showSeatSelection ? (
            <SeatSelection onBack={handleBackToBookingForm} onConfirmSelection={handleConfirmSelection} />
          ) : (
            <>
              <h2>Book a Seat</h2>
              <BookingForm onFormSubmit={handleBookingFormSubmit} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
