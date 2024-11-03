import './App.css';
import { Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage.jsx";
import HomePage from "./components/HomePage.jsx";
import BookingsPage from "./components/BookingsPage.jsx";
import PageNotFound from "./components/PageNotFound.jsx";
import MyAccountPage from "./components/MyAccountPage.jsx";

function App() {
    return (
        <Routes>
            <Route>
                <Route path="*" element={<PageNotFound />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/my_account" element={<MyAccountPage />} />
            </Route>
        </Routes>
    );
}

export default App;
