import './App.css';
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import UserHome from "./components/user_pages/UserHome.jsx";
import UserBookings from "./components/user_pages/UserBookings.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";
import Profile from "./components/Profile.jsx";
import OrganizerDashboard from './components/organizer_pages/OrganizerDashboard.jsx';
import MyEvents from './components/organizer_pages/MyEvents.jsx';
import ViewEventPage from './components/organizer_pages/ViewEventPage.jsx';
import AdminDashboard from "./components/admin_pages/AdminHome.jsx"
import AdminUsers from './components/admin_pages/AdminUsers.jsx';
import AdminOrganizer from './components/admin_pages/AdminOrganizer.jsx';
import { AuthProvider } from './utils/AuthContext.jsx';
import AdminVenue from './components/admin_pages/AdminVenue.jsx';
import AdminEventsDashboard from './components/admin_pages/AdminEventsDashboard.jsx';
import UserFeedback from './components/user_pages/UserFeedback.jsx';

import Ticket from './components/organizer_pages/Ticket.jsx'
import OrganizerBookings from './components/organizer_pages/OrganizerBookings.jsx';
import OrganizerEventAnalytics from "./components/organizer_pages/OrganizerEventAnalytics.jsx";
import AboutUs from "./components/AboutUs.jsx";
import MyAccount from "./components/MyAccount.jsx";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<LandingPage />} />

                <Route path="/home" element={<UserHome />} />
                <Route path="/about_us" element={<AboutUs />} />

                {/* Account */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/my_account" element={<MyAccount />} />

                {/* User Routes */}
                <Route path="/user/bookings" element={<UserBookings />} />
                <Route path="/user/feedbacks" element={<UserFeedback />} />

                {/* Organizer Routes */}
                <Route path="/organizer" element={<MyEvents />} />
                <Route path="/organizer/my_events" element={<MyEvents />} />
                <Route path="/organizer/my_events/:eventId" element={<ViewEventPage />} />
                <Route path='/organizer/bookings' element={<OrganizerBookings/>} />
                <Route path='/organizer/tickets' element={<Ticket/>} />
                <Route path='/organizer/dashboard/' element={<OrganizerDashboard />} />
                <Route path='/organizer/dashboard/:eventId' element={<OrganizerEventAnalytics />}/>

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/venues" element={<AdminVenue />} />
                <Route path='/admin/users' element={<AdminUsers/>} />
                <Route path='/admin/organizers' element={<AdminOrganizer/>} />
                <Route path='/admin/events' element={<AdminEventsDashboard/>} />

            </Routes>
        </AuthProvider>
    );
}

export default App;
