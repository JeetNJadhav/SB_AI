import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SeatSelection from './pages/SeatSelection';
import Confirmation from './pages/Confirmation';
import Payment from './pages/Payment';
import TeamMemberDetails from './pages/TeamMemberDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select-seat" element={<SeatSelection />} />
        <Route path="/team-members" element={<TeamMemberDetails />} />
        <Route path="/confirm" element={<Confirmation />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
};

export default App;