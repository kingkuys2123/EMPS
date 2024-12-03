import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import BookingService from '../../services/BookingService.jsx';

import UserSidebar from "./UserSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import CustomSnackbar from "../CustomSnackbar.jsx";
import { getAuth } from "../../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import '../styles/FontStyle.css';

function UserBookings() {
    const nav = useNavigate();

    const { currentUser, setCurrentUser } = getAuth();

    const [bookings, setBookings] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (!currentUser) {
            nav('/home');
        }
    }, []);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    }

    const handleDeleteBooking = async (bookingId) => {

    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div className="bookings-page">
            <Box sx={{ display: "flex" }}>

                <UserSidebar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    <CustomAppBar title={"Bookings"} />

                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Box sx={{ backgroundColor: "#FFFFFF", width: "100%", height: "100%", boxShadow: "5px 5px 5px #aaaaaa", position: "relative", overflowY: "auto" }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="booking tabs">
                                <Tab label="Upcoming" />
                                <Tab label="Pending" />
                                <Tab label="Past" />
                                <Tab label="Cancelled" />
                            </Tabs>
                            <Box sx={{ padding: "50px" }}>
                                {tabValue === 0 && <div>Upcoming Bookings</div>}
                                {tabValue === 1 && <div>Pending Bookings</div>}
                                {tabValue === 2 && <div>Past Bookings</div>}
                                {tabValue === 3 && <div>Cancelled Bookings</div>}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />
            </Box>
        </div>
    );
}

export default UserBookings;