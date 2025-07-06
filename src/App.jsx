import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import WalletPage from './pages/Wallet';
import FAQ from './pages/FAQ';
import Support from './pages/Support';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>
        <BottomNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </Router>
  );
}

export default App;
