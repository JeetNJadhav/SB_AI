
import React from 'react';
import Seat from './Seat';

interface Seat {
  id: number;
  booked: boolean;
  selected: boolean;
}

interface SeatMapProps {
  seats: Seat[];
  onSelect: (id: number) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, onSelect }) => {
  return (
    <div className="d-flex flex-wrap">
      {seats.map(seat => (
        <Seat key={seat.id} seat={seat} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default SeatMap;
