import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SeatMap from '../SeatMap';

describe('SeatMap', () => {
  const mockOnSelect = jest.fn();
  const seats = [
    { id: 1, booked: false, selected: false },
    { id: 2, booked: true, selected: false },
    { id: 3, booked: false, selected: true },
  ];

  test('renders all seats provided', () => {
    render(<SeatMap seats={seats} onSelect={mockOnSelect} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('passes onSelect prop to Seat components', () => {
    render(<SeatMap seats={seats} onSelect={mockOnSelect} />);
    fireEvent.click(screen.getByText('1'));
    expect(mockOnSelect).toHaveBeenCalledWith(1);
  });

  test('Seat components display correct classes based on their state', () => {
    render(<SeatMap seats={seats} onSelect={mockOnSelect} />);
    expect(screen.getByText('1')).toHaveClass('btn-outline-primary');
    expect(screen.getByText('2')).toHaveClass('btn-danger');
    expect(screen.getByText('3')).toHaveClass('btn-success');
  });
});
