import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import BookingService from '../../services/BookingService.jsx';

import UserSidebar from "./UserSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import CustomSnackbar from "../CustomSnackbar.jsx";
import { getAuth } from "../../utils/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";

import '../styles/FontStyle.css';
import EventService from "../../services/EventService.jsx";

function UserViewEvent() {
    const nav = useNavigate();
    const { currentUser } = getAuth();
    const { eventId } = useParams();

    const [event, setEvent] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            if (!currentUser) {
                nav('/home');
                return;
            }
            try {
                const response = await EventService.getEvent(eventId);
                setEvent(response.data);
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        fetchEvent();
    }, [currentUser, eventId, nav]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <div className="bookings-page">
            <Box sx={{ display: "flex" }}>
                <UserSidebar />
                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
                    <CustomAppBar title={event ? event.name : "Event"} />
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Box sx={{ backgroundColor: "#FFFFFF", width: "100%", height: "100%", boxShadow: "5px 5px 5px #aaaaaa", position: "relative", overflowY: "auto" }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="booking tabs">
                                <Tab label="About" />
                                <Tab label="Schedule" />
                                <Tab label="Venue" />
                                <Tab label="Feedback" />
                            </Tabs>
                            <Box sx={{ padding: "50px" }}>
                                {tabValue === 0 && event && (
                                    <div>
                                        <Typography variant="h6">Event Details</Typography>
                                        <Typography variant="body1"><strong>Name:</strong> {event.name}</Typography>
                                        <Typography variant="body1"><strong>Type:</strong> {event.type}</Typography>
                                        <Typography variant="body1"><strong>Description:</strong> {event.description}</Typography>
                                        <Typography variant="body1"><strong>Organizer:</strong> {event.organizer.user.firstName} {event.organizer.user.lastName}</Typography>
                                        <Typography variant="body1"><strong>Confirmation Status:</strong> {event.confirmationStatus}</Typography>
                                        <Typography variant="body1"><strong>Event Status:</strong> {event.eventStatus}</Typography>
                                        <Typography variant="body1"><strong>Start Date and Time:</strong> {new Date(event.startDatetime).toLocaleString()}</Typography>
                                        <Typography variant="body1"><strong>End Date and Time:</strong> {new Date(event.endDatetime).toLocaleString()}</Typography>
                                    </div>
                                )}
                                {tabValue === 1 && event && (
                                    <div>
                                        <Typography variant="h6">Schedule Details</Typography>
                                        <Typography variant="body1"><strong>Start Date and Time:</strong> {new Date(event.startDatetime).toLocaleString()}</Typography>
                                        <Typography variant="body1"><strong>End Date and Time:</strong> {new Date(event.endDatetime).toLocaleString()}</Typography>
                                    </div>
                                )}
                                {tabValue === 2 && event && (
                                    <div>
                                        <Typography variant="h6">Venue Details</Typography>
                                        <Typography variant="body1"><strong>Name:</strong> {event.venue.name}</Typography>
                                        <Typography variant="body1"><strong>Description:</strong> {event.venue.description}</Typography>
                                        <Typography variant="body1"><strong>Address:</strong> {event.venue.address}</Typography>
                                        <Typography variant="body1"><strong>Capacity:</strong> {event.venue.capacity}</Typography>
                                    </div>
                                )}
                                {tabValue === 3 && <div>Feedbacks</div>}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />
            </Box>
        </div>
    );
}

export default UserViewEvent;