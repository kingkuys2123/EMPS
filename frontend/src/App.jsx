import './App.css';
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import HomePage from "./components/HomePage.jsx";
import BookingsPage from "./components/BookingsPage.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";
import MyAccountPage from "./components/MyAccountPage.jsx";
import { AuthProvider } from './utils/AuthContext.jsx';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/my_account" element={<MyAccountPage />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
