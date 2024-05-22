import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Home from './Components/home/Home';
import UserProfile from './Components/Configuration/MyProfile/MyProfile';
import MyOffers from './Components/Configuration/MyOffers/MyOffers';
import MyAdvertisements from './Components/Configuration/Advertisement/MyAdvertisements';
import SecuritySettings from './Components/Configuration/Security/SecuritySettings';
import SecuritySettingsAdmin from './Components/Configuration/Admin1/SecuritySettingsAdmin';
import Offer from './Components/Offer/Offer';
import ConfirmOffer from './Components/ConfirmOffer/ConfirmOffer';
import ApplicationConfirmed from './Components/ApplicationConfirmed/ApplicationConfirmed';
import Calendar from './Components/Calendar/Calendar';
import ViewOffer from './Components/ViewOffer/ViewOffer';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import NewPassword from './Components/NewPassword/NewPassword';
import DeleteUser from './Components/Configuration/Admin1/DeleteUser';
import DeleteMyAdvertisement from './Components/Configuration/Admin1/DeleteMyAdvertisement';
import { AuthContext } from './context/AuthContext';
import NavBar from './Components/NavBar/NavBar';
import HomeAdmin from './Components/Configuration/Admin1/HomeAdmin';


function App() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate replace to="/Home" />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Profile" element={user ? <UserProfile /> : <Navigate to="/Login" />} />
        <Route path="/MyOffers" element={user ? <MyOffers /> : <Navigate to="/Login" />} />
        <Route path="/Offer" element={user ? <Offer /> : <Navigate to="/Login" />} />
        <Route path="/ConfirmOffer" element={user ? <ConfirmOffer /> : <Navigate to="/Login" />} />
        <Route path="/MyAdvertisements" element={user ? <MyAdvertisements /> : <Navigate to="/Login" />} />
        <Route path="/SecuritySettings" element={user ? <SecuritySettings /> : <Navigate to="/Login" />} />
        <Route path="/ApplicationConfirmed" element={user ? <ApplicationConfirmed /> : <Navigate to="/Login" />} />
        <Route path="/Calendar" element={user ? <Calendar /> : <Navigate to="/Login" />} />
        <Route path="/Profile" element={<UserProfile />} />
        <Route path="/MyOffers" element={<MyOffers />} />
        <Route path="/Offer" element={<Offer />} />
        <Route path="/ConfirmOffer" element={<ConfirmOffer />} />
        <Route path="/MyAdvertisements" element={<MyAdvertisements />} />
        <Route path="/SecuritySettings" element={<SecuritySettings />} />
        <Route path="/SecuritySettingsAdmin" element={<SecuritySettingsAdmin />} />
        <Route path="/ApplicationConfirmed" element={<ApplicationConfirmed />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/offer/:id" element={<ViewOffer />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/NewPassword" element={<NewPassword />} />
        <Route path="/DeleteUser" element={user ? <DeleteUser /> : <Navigate to="/Login" />} />
        <Route path="/DeleteOffer" element={user ? <DeleteOffer /> : <Navigate to="/Login" />} />
        <Route path="/DeleteMyAdvertisement" element={user ? <DeleteMyAdvertisement /> : <Navigate to="/Login" />} />
        <Route path="/DeleteUser" element={<DeleteUser />} />
        <Route path="/DeleteMyAdvertisement" element={<DeleteMyAdvertisement />} />
        <Route path="/HomeAdmin" element={<HomeAdmin />} />
      </Routes>
    </div>
  );
}

export default App;
