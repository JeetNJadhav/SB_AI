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
  const [editingBooking, setEditingBooking] = useState<BookingDetails | null>(null);

  useEffect(() => {
    if (location.state && location.state.bookingToUpdate) {
      const { bookingToUpdate } = location.state;
      dispatch(setBookingDetails({
        id: bookingToUpdate._id, // Use _id from backend
        date: bookingToUpdate.date,
        venue: bookingToUpdate.venue,
        building: bookingToUpdate.building,
        floor: bookingToUpdate.floor,
        seatNumber: bookingToUpdate.seatNumber,
        // Assuming bookingType, numberOfTeamMembers, teamMembers, selectedSeats are part of the bookingToUpdate if needed for update
      }));
      setEditingBooking(bookingToUpdate); // Set the booking to be edited
      setShowSeatSelection(false); // Don't show seat selection immediately
      window.history.replaceState({}, document.title);
    }
  }, [location.state, dispatch]);

  const handleBookingFormSubmit = () => {
    setShowSeatSelection(true);
    setEditingBooking(null); // Clear editing state after submission
  };

  const handleUpdateBooking = (booking: any) => {
    dispatch(setBookingDetails({
      id: booking._id,
      date: booking.date,
      venue: booking.venue,
      building: booking.building,
      floor: booking.floor,
      seatNumber: booking.seatNumber,
    }));
    setEditingBooking(booking);
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
          <UpcomingBookings onUpdate={handleUpdateBooking} />
        </div>
        <div className="col-md-8">
          {showSeatSelection ? (
            <SeatSelection onBack={handleBackToBookingForm} onConfirmSelection={handleConfirmSelection} editingBooking={editingBooking} />
          ) : (
            <>
              <h2>{editingBooking ? 'Edit Seat Booking' : 'Book a Seat'}</h2>
              <BookingForm onFormSubmit={handleBookingFormSubmit} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
