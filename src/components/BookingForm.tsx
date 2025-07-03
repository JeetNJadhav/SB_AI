import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { locations } from '../data/locations';
import { setBookingDetails, BookingDetails } from '../redux/bookingSlice';
import { BookingDetails as FullBookingDetails } from '../redux/bookingSlice';
import { RootState } from '../redux/store';

const BookingForm: React.FC<{ onFormSubmit: () => void }> = ({ onFormSubmit }) => {
  const dispatch = useDispatch();
  const bookingDetails = useSelector((state: RootState) => state.booking.currentBooking);
  const upcomingBookings = useSelector((state: RootState) => state.booking.upcomingBookings);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    dispatch(setBookingDetails({ ...bookingDetails, [name]: value }));
  };

  const handleBookingTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBookingDetails({ bookingType: e.target.value as 'self' | 'team' }));
  };

  const handleNumberOfTeamMembersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setBookingDetails({ ...bookingDetails, numberOfTeamMembers: parseInt(e.target.value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isDuplicateDate = upcomingBookings.some(
      (booking) => booking.date === bookingDetails.date && booking.id !== bookingDetails.id
    );

    if (isDuplicateDate) {
      alert('A booking already exists for this date. Please choose a different date.');
      return;
    }

    onFormSubmit();
  };

  const selectedLocation = locations.find(loc => loc.venue === bookingDetails.venue);
  const selectedBuilding = selectedLocation?.buildings.find(bld => bld.name === bookingDetails.building);

  return (
    <form onSubmit={handleSubmit} data-testid="booking-form">
      <div className="mb-3">
        <label htmlFor="date" className="form-label">Date</label>
        <input type="date" className="form-control" id="date" name="date" value={bookingDetails.date} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Booking Type</label>
        <div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="bookingType" id="bookSelf" value="self" checked={bookingDetails.bookingType === 'self'} onChange={handleBookingTypeChange} />
            <label className="form-check-label" htmlFor="bookSelf">Book for Self</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="bookingType" id="bookTeam" value="team" checked={bookingDetails.bookingType === 'team'} onChange={handleBookingTypeChange} />
            <label className="form-check-label" htmlFor="bookTeam">Book for Team</label>
          </div>
        </div>
      </div>

      {bookingDetails.bookingType === 'team' && (
        <div className="mb-3">
          <label htmlFor="numberOfTeamMembers" className="form-label">Number of Team Members</label>
          <input type="number" className="form-control" id="numberOfTeamMembers" name="numberOfTeamMembers" min="1" value={bookingDetails.numberOfTeamMembers || ''} onChange={handleNumberOfTeamMembersChange} required />
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="venue" className="form-label">Venue</label>
        <select className="form-select" id="venue" name="venue" onChange={handleChange} value={bookingDetails.venue} required>
          <option value="">Select Venue</option>
          {locations.map(loc => (
            <option key={loc.venue} value={loc.venue}>{loc.venue}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="building" className="form-label">Building</label>
        <select className="form-select" id="building" name="building" onChange={handleChange} value={bookingDetails.building} disabled={!bookingDetails.venue} required>
          <option value="">Select Building</option>
          {selectedLocation?.buildings.map(bld => (
            <option key={bld.name} value={bld.name}>{bld.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="floor" className="form-label">Floor</label>
        <select className="form-select" id="floor" name="floor" onChange={handleChange} value={bookingDetails.floor} disabled={!bookingDetails.building} required>
          <option value="">Select Floor</option>
          {selectedBuilding?.floors.map(floor => (
            <option key={floor.number} value={floor.number}>{floor.number}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Select Seat</button>
    </form>
  );
};

export default BookingForm;