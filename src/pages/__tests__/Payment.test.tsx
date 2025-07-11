import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Payment from '../Payment';

describe('Payment', () => {
  test('renders payment gateway message', () => {
    render(
      <MemoryRouter>
        <Payment />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Payment Gateway/i })).toBeInTheDocument();
    expect(screen.getByText(/^Redirecting to payment gateway...$/i)).toBeInTheDocument();
  });
});
