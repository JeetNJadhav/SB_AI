import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Seat from '../Seat';

describe('Seat', () => {
  const mockOnSelect = jest.fn();

  test('renders seat with correct ID', () => {
    const seat = { id: 1, booked: false, selected: false };
    render(<Seat seat={seat} onSelect={mockOnSelect} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('applies btn-danger class if seat is booked', () => {
    const seat = { id: 2, booked: true, selected: false };
    render(<Seat seat={seat} onSelect={mockOnSelect} />);
    expect(screen.getByText('2')).toHaveClass('btn-danger');
  });

  test('applies btn-success class if seat is selected', () => {
    const seat = { id: 3, booked: false, selected: true };
    render(<Seat seat={seat} onSelect={mockOnSelect} />);
    expect(screen.getByText('3')).toHaveClass('btn-success');
  });

  test('applies btn-outline-primary class if seat is unbooked and unselected', () => {
    const seat = { id: 4, booked: false, selected: false };
    render(<Seat seat={seat} onSelect={mockOnSelect} />);
    expect(screen.getByText('4')).toHaveClass('btn-outline-primary');
  });

  test('calls onSelect when clicked if not booked', async () => {
    const seat = { id: 5, booked: false, selected: false };
    render(<Seat seat={seat} onSelect={mockOnSelect} />);
    await userEvent.click(screen.getByText('5'));
    expect(mockOnSelect).toHaveBeenCalledWith(5);
  });

  test('does not call onSelect when clicked if booked', async () => {
    const seat = { id: 6, booked: true, selected: false };
    render(<Seat seat={seat} onSelect={mockOnSelect} />);
    const button = screen.getByText('6');
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(mockOnSelect).not.toHaveBeenCalled();
  });
});
