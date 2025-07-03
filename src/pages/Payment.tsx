import React from 'react';
import { Link } from 'react-router-dom';

const Payment: React.FC = () => {
  return (
    <div className="container mt-4">
      <h2>Payment Gateway</h2>
      <p>Redirecting to payment gateway...</p>
      {/* In a real application, you would integrate with a payment gateway here */}
      <p>Your booking has been processed.</p>
      <Link to="/" className="btn btn-primary">Go to Home</Link>
    </div>
  );
};

export default Payment;
