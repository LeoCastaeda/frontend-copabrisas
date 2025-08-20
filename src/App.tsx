import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import NewCustomer from './components/NewCustomer';
import EditCustomer from './components/EditCustomer';
import VehicleList from './pages/VehicleList';
import CityList from './pages/CityList';
import ServiceList from './pages/ServiceList';
import BookingList from './pages/BookingList';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/new" element={<NewCustomer />} />
        <Route path="/customers/edit/:id" element={<EditCustomer />} />
        <Route path="/vehicles" element={<VehicleList />} />
        <Route path="/cities" element={<CityList />} />
        <Route path="/services" element={<ServiceList />} />
        <Route path="/bookings" element={<BookingList />} />
      </Routes>
    </BrowserRouter>
  );
}
