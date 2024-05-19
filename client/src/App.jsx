import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ViewParty from './Components/Pages/ViewParty/ViewParty';
import AddParty from './Components/Pages/AddParty/AddParty';
import AddBill from './Components/Pages/AddBill/AddBill';
import Navbar from './Components/Navbar/Navbar';
import ViewBill from './Components/Pages/ViewBill/ViewBill';
import './App.css'
import Footer from './Components/Footer/Footer';
import ManageParty from './Components/Pages/ManageParty/ManageParty';
import Dashboard from './Components/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path="/view-party" element={<ViewParty />} />
        <Route path="/view-bill" element={<ViewBill/>}/>
        <Route path="/add-party" element={<AddParty />} />
        <Route path="/add-weekly-bill" element={<AddBill />} />
        <Route path="/manage-party" element={<ManageParty />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
