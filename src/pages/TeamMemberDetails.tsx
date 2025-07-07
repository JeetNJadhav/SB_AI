import React, { useState } from 'react';
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

const TeamMemberDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Safely handle undefined location or state
  const { bookingDetails, selectedSeats } = ((location && location.state) ? location.state : { bookingDetails: undefined, selectedSeats: undefined }) as { bookingDetails: BookingDetails; selectedSeats: Seat[] };

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const initialMembers: TeamMember[] = [];
    for (let i = 0; i < (bookingDetails?.numberOfTeamMembers || 0); i++) {
      initialMembers.push({ name: '', email: '' });
    }
    return initialMembers;
  });

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index] = { ...newTeamMembers[index], [e.target.name]: e.target.value };
    setTeamMembers(newTeamMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Log team member details for now
    
    navigate('/confirm', { state: { bookingDetails, selectedSeats, teamMembers, isUpdate: !!bookingDetails?.id } });
  };

  if (!bookingDetails || !selectedSeats || bookingDetails.bookingType !== 'team') {
    return <div>Invalid booking details or not a team booking.</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Enter Team Member Details</h2>
      <form onSubmit={handleSubmit}>
        {teamMembers.map((member, index) => (
          <div key={index} className="mb-3 border p-3">
            <h4>Team Member {index + 1}</h4>
            <div className="mb-3">
              <label htmlFor={`name-${index}`} className="form-label">Name</label>
              <input type="text" className="form-control" id={`name-${index}`} name="name" value={member.name} onChange={(e) => handleChange(index, e)} required />
            </div>
            <div className="mb-3">
              <label htmlFor={`email-${index}`} className="form-label">Email</label>
              <input type="email" className="form-control" id={`email-${index}`} name="email" value={member.email} onChange={(e) => handleChange(index, e)} required />
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary mt-3">Confirm Team Booking</button>
      </form>
    </div>
  );
};

export default TeamMemberDetails;
