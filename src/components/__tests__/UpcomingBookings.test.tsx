import React from 'react';
import { render, screen } from '@testing-library/react';
import UpcomingBookings from '../UpcomingBookings';

describe('UpcomingBookings', () => {
  test('renders no upcoming bookings message when no bookings are present', () => {
    render(<UpcomingBookings bookings={[]} />);
    expect(screen.getByText(/No upcoming bookings./i)).toBeInTheDocument();
  });

  test('renders self-booking details correctly', () => {
    render(<UpcomingBookings bookings={[
      { id: 1, date: '2025-07-10', venue: 'Main Office', building: 'A', floor: '3', seats: [{ id: 12 }], bookingType: 'self' },
    ]} />);

    expect(screen.getByText((content, element) => {
      return (element?.tagName.toLowerCase() === 'li' && element.textContent?.includes('Date: 2025-07-10')) || false;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return (element?.tagName.toLowerCase() === 'li' && element.textContent?.includes('Venue: Main Office')) || false;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return (element?.tagName.toLowerCase() === 'li' && element.textContent?.includes('Building: A')) || false;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return (element?.tagName.toLowerCase() === 'li' && element.textContent?.includes('Floor: 3')) || false;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return (element?.tagName.toLowerCase() === 'li' && element.textContent?.includes('Seats: Seat 12')) || false;
    })).toBeInTheDocument();
  });

  test('renders team-booking details correctly with team members', () => {
    render(<UpcomingBookings bookings={[
      { id: 2, date: '2025-07-15', venue: 'Branch Office', building: 'B', floor: '2', seats: [{ id: 5 }, { id: 6 }], bookingType: 'team', teamMembers: [{ name: 'John Doe', email: 'john@example.com' }, { name: 'Jane Smith', email: 'jane@example.com' }] },
    ]} />);

    expect(screen.getByText((content, element) => {
      return (element?.tagName.toLowerCase() === 'li' && element.textContent?.includes('Date: 2025-07-15')) || false;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return (element?.tagName.toLowerCase() === 'li' && element.textContent?.includes('Venue: Branch Office')) || false;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return (element?.tagName.toLowerCase() === 'li' && element.textContent?.includes('Building: B')) || false;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return (element?.tagName.toLowerCase() === 'li' && element.textContent?.includes('Floor: 2')) || false;
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return (element?.tagName.toLowerCase() === 'li' && element.textContent?.includes('Seats: Seat 5, Seat 6')) || false;
    })).toBeInTheDocument();
    expect(screen.getByText(/John Doe \(john@example.com\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith \(jane@example.com\)/i)).toBeInTheDocument();
  });

  test('does not render team members section when teamMembers is undefined', () => {
    render(<UpcomingBookings bookings={[
      { id: 3, date: '2025-07-20', venue: 'Main Office', building: 'A', floor: '1', seats: [{ id: 1 }], bookingType: 'team', teamMembers: undefined },
    ]} />);
    expect(screen.queryByText(/Team Members:/i)).not.toBeInTheDocument();
  });

  test('does not render team members section when teamMembers is an empty array', () => {
    render(<UpcomingBookings bookings={[
      { id: 4, date: '2025-07-25', venue: 'Remote Office', building: 'C', floor: '4', seats: [{ id: 7 }], bookingType: 'team', teamMembers: [] },
    ]} />);
    expect(screen.queryByText(/Team Members:/i)).not.toBeInTheDocument();
  });

  test('renders default bookings when bookings prop is not provided', () => {
    render(<UpcomingBookings />);
    expect(screen.getByText((content, element) => {
      return !!(element && element.tagName.toLowerCase() === 'li' && element.textContent?.includes('Date: 2025-07-10'));
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return !!(element && element.tagName.toLowerCase() === 'li' && element.textContent?.includes('Venue: Main Office'));
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return !!(element && element.tagName.toLowerCase() === 'li' && element.textContent?.includes('Date: 2025-07-15'));
    })).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return !!(element && element.tagName.toLowerCase() === 'li' && element.textContent?.includes('Venue: Branch Office'));
    })).toBeInTheDocument();
  });
});
