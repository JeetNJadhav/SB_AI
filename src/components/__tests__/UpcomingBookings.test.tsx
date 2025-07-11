import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import UpcomingBookings from '../UpcomingBookings';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockBookings = [
  {
    _id: '1',
    date: '2025-07-10',
    venue: 'Main Office',
    building: 'A',
    floor: '3',
    seatNumber: '12',
    user: { _id: 'u1', name: 'John Doe', email: 'john@example.com' },
  },
  {
    _id: '2',
    date: '2025-07-15',
    venue: 'Branch Office',
    building: 'B',
    floor: '2',
    seatNumber: '5',
    user: { _id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
  },
];

describe('UpcomingBookings', () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    mockedAxios.delete.mockResolvedValue({});
    (window.confirm as jest.Mock) = jest.fn(() => true);
    mockOnUpdate.mockClear();
  });

  test('renders no upcoming bookings message when no bookings are present', async () => {
    render(<UpcomingBookings onUpdate={mockOnUpdate} />);
    await waitFor(() => {
      expect(screen.getByText(/No upcoming bookings./i)).toBeInTheDocument();
    });
  });

  test('renders list of bookings', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockBookings });
    render(<UpcomingBookings onUpdate={mockOnUpdate} />);

    await waitFor(() => {
      expect(screen.getByText(/Date: 2025-07-10/i)).toBeInTheDocument();
      expect(screen.getByText(/Venue: Main Office/i)).toBeInTheDocument();
      expect(screen.getByText(/Seat: 12/i)).toBeInTheDocument();
      expect(screen.getByText(/Booked by: John Doe/i)).toBeInTheDocument();

      expect(screen.getByText(/Date: 2025-07-15/i)).toBeInTheDocument();
      expect(screen.getByText(/Venue: Branch Office/i)).toBeInTheDocument();
      expect(screen.getByText(/Seat: 5/i)).toBeInTheDocument();
      expect(screen.getByText(/Booked by: Jane Smith/i)).toBeInTheDocument();
    });
  });

  test('calls onUpdate when update button is clicked', async () => {
    mockedAxios.get.mockResolvedValue({ data: [mockBookings[0]] });
    render(<UpcomingBookings onUpdate={mockOnUpdate} />);

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Update/i }));
    });

    expect(mockOnUpdate).toHaveBeenCalledWith(mockBookings[0]);
  });

  test('calls delete when delete button is clicked and confirmed', async () => {
    mockedAxios.get.mockResolvedValue({ data: [mockBookings[0]] });
    render(<UpcomingBookings onUpdate={mockOnUpdate} />);

    let deleteButton: HTMLElement;
    await waitFor(() => {
        deleteButton = screen.getByRole('button', { name: /Delete/i });
        expect(deleteButton).toBeInTheDocument();
    });

    fireEvent.click(deleteButton!);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this booking?');
    
    await waitFor(() => {
        expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:3001/api/bookings/1');
    });

    await waitFor(() => {
        expect(screen.getByText(/No upcoming bookings./i)).toBeInTheDocument();
    });
  });

  test('does not call delete when delete button is clicked and not confirmed', async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    mockedAxios.get.mockResolvedValue({ data: [mockBookings[0]] });
    render(<UpcomingBookings onUpdate={mockOnUpdate} />);

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    });

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this booking?');
    expect(mockedAxios.delete).not.toHaveBeenCalled();
  });

  test('shows alert on delete failure', async () => {
    mockedAxios.get.mockResolvedValue({ data: [mockBookings[0]] });
    mockedAxios.delete.mockRejectedValue(new Error('Network Error'));
    window.alert = jest.fn();

    render(<UpcomingBookings onUpdate={mockOnUpdate} />);

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to delete booking. Please try again.');
    });
  });
});