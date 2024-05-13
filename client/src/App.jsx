import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ViewParty from './Components/Pages/ViewParty/ViewParty';
import AddParty from './Components/Pages/AddParty/AddParty';
import AddBill from './Components/Pages/AddBill/AddBill';
import Navbar from './Components/Navbar/Navbar';
import ViewBill from './Components/Pages/ViewBill/ViewBill';
import './App.css'
import Footer from './Components/Footer/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/view-party" element={<ViewParty />} />
        <Route path="/view-bill" element={<ViewBill/>}/>
        <Route path="/add-party" element={<AddParty />} />
        <Route path="/add-weekly-bill" element={<AddBill />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
