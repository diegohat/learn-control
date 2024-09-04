import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Digital from './pages/Digital';
import Continuous from './pages/Continuous';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/digital" element={<Digital />} />
        <Route path="/continuo" element={<Continuous />} />
      </Routes>
    </Router>
  );
}

export default App;
