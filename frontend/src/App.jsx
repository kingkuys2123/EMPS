import './App.css';
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import UserHome from "./components/user_pages/UserHome.jsx";
import UserBookings from "./components/user_pages/UserBookings.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";
import MyAccount from "./components/MyAccount.jsx";
import OrganizerDashboard from './components/organizer_pages/OrganizerDashboard.jsx';
import MyEvents from './components/organizer_pages/MyEvents.jsx';
import ViewEventPage from './components/organizer_pages/ViewEventPage.jsx';
import { AuthProvider } from './utils/AuthContext.jsx';
import UserFeedback from './components/user_pages/UserFeedback.jsx';

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
                <Route path="user/feedbacks" element={<UserFeedback />} />

                {/* Organizer Routes */}
                <Route path='/dashboard/' element={<OrganizerDashboard />} />
                <Route path="/myevents" element={<MyEvents />} />
                <Route path="/myevents/:eventId" element={<ViewEventPage />} />

                {/* Admin Routes */}


            </Routes>
        </AuthProvider>
    );
}

export default App;
