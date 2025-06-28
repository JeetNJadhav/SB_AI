import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { locations } from '../data/locations';

interface BookingDetails {
  date: string;
  venue: string;
  building: string;
  floor: string;
  bookingType: 'self' | 'team';
  numberOfTeamMembers?: number;
}

const BookingForm: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    date: '',
    venue: '',
    building: '',
    floor: '',
    bookingType: 'self', // Default to 'self'
  });
  const navigate = useNavigate();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingDetails({ ...bookingDetails, date: e.target.value });
  };

  const handleVenueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVenue = e.target.value;
    setBookingDetails({ ...bookingDetails, venue: selectedVenue, building: '', floor: '' });
  };

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBuilding = e.target.value;
    setBookingDetails({ ...bookingDetails, building: selectedBuilding, floor: '' });
  };

  const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBookingDetails({ ...bookingDetails, floor: e.target.value });
  };

  const handleBookingTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingDetails({ ...bookingDetails, bookingType: e.target.value as 'self' | 'team', numberOfTeamMembers: undefined });
  };

  const handleNumberOfTeamMembersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingDetails({ ...bookingDetails, numberOfTeamMembers: parseInt(e.target.value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/select-seat', { state: { bookingDetails } });
  };

  const selectedLocation = locations.find(loc => loc.venue === bookingDetails.venue);
  const selectedBuilding = selectedLocation?.buildings.find(bld => bld.name === bookingDetails.building);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="date" className="form-label">Date</label>
        <input type="date" className="form-control" id="date" name="date" onChange={handleDateChange} required />
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
        <select className="form-select" id="venue" name="venue" onChange={handleVenueChange} value={bookingDetails.venue} required>
          <option value="">Select Venue</option>
          {locations.map(loc => (
            <option key={loc.venue} value={loc.venue}>{loc.venue}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="building" className="form-label">Building</label>
        <select className="form-select" id="building" name="building" onChange={handleBuildingChange} value={bookingDetails.building} disabled={!bookingDetails.venue} required>
          <option value="">Select Building</option>
          {selectedLocation?.buildings.map(bld => (
            <option key={bld.name} value={bld.name}>{bld.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="floor" className="form-label">Floor</label>
        <select className="form-select" id="floor" name="floor" onChange={handleFloorChange} value={bookingDetails.floor} disabled={!bookingDetails.building} required>
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
