import './App.css';
import { Route, Routes, Navigate  } from 'react-router-dom';
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
import HomeAdmin from './Components/Configuration/Admin1/HomeAdmin';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate replace to="/Home" />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
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
        <Route path="/DeleteUser" element={<DeleteUser />} />
        <Route path="/DeleteMyAdvertisement" element={<DeleteMyAdvertisement />} />
        <Route path="/HomeAdmin" element={<HomeAdmin />} />
      </Routes>
    </div>
  );
}

export default App;