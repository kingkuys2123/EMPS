import './App.css';
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import UserHome from "./components/user_pages/UserHome.jsx";
import UserBookings from "./components/user_pages/UserBookings.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";
import MyAccount from "./components/MyAccount.jsx";
import { AuthProvider } from './utils/AuthContext.jsx';
import Ticket from './components/organizer_pages/Ticket.jsx'
import OrganizerBookings from './components/organizer_pages/OrganizerBookings.jsx';
function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<LandingPage />} />

                <Route path="/home" element={<UserHome />} />
                <Route path="/my_account" element={<MyAccount />} />

                {/* User Routes */}
                <Route path="/user/bookings" element={<UserBookings />} />

                {/* Organizer Routes */}
                <Route path='/organizer/bookings' element={<OrganizerBookings/>} />
                <Route path='/organizer/tickets' element={<Ticket/>} />
                {/* Admin Routes */}


            </Routes>
        </AuthProvider>
    );
}

export default App;
