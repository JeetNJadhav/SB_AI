import React from 'react';

interface SeatProps {
  seat: {
    id: number;
    booked: boolean;
    selected: boolean;
  };
  onSelect: (id: number) => void;
}

const Seat: React.FC<SeatProps> = ({ seat, onSelect }) => {
  const getSeatClass = (): string => {
    if (seat.booked) {
      return 'btn-danger';
    }
    if (seat.selected) {
      return 'btn-success';
    }
    return 'btn-outline-primary';
  };

  return (
    <button
      className={`btn m-1 ${getSeatClass()}`}
      onClick={() => {
        // eslint-disable-next-line no-console
        console.log('Seat clicked:', seat.id, 'selected:', seat.selected, 'booked:', seat.booked);
        onSelect(seat.id);
      }}
      disabled={seat.booked}
    >
      {seat.id}
    </button>
  );
};

export default Seat;
