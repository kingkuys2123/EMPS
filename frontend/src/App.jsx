import './App.css';
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import UserHome from "./components/user_pages/UserHome.jsx";
import UserBookings from "./components/user_pages/UserBookings.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";
import MyAccount from "./components/MyAccount.jsx";
import AdminDashboard from "./components/admin_pages/AdminHome.jsx"
import AdminUsers from './components/admin_pages/AdminUsers.jsx';
import AdminOrganizer from './components/admin_pages/AdminOrganizer.jsx';
import { AuthProvider } from './utils/AuthContext.jsx';
import AdminEventsDashboard from './components/admin_pages/AdminEventsDashboard.jsx';

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


                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path='/admin/user' element={<AdminUsers/>} />
                <Route path='/admin/organizer' element={<AdminOrganizer/>} />
                <Route path='/admin/events' element={<AdminEventsDashboard/>} />

            </Routes>
        </AuthProvider>
    );
}

export default App;
