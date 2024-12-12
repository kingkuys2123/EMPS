import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Paper, Grid, CircularProgress } from "@mui/material";
import OrganizerSidebar from "./OrganizerSidebar";
import CustomAppBar from "../CustomAppBar";
import EventService from "../../services/EventService";
import BookingService from "../../services/BookingService";
import FeedbackService from "../../services/FeedbackServices";

import { getAuth } from "../../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function OrganizerEventAnalytics() {
    const nav = useNavigate();
    const { currentUser, toggleOrganizer } = getAuth();

    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            nav('/');
        }
        else if(currentUser.accountType === "user"){
            nav("/home")
        }
        else if(currentUser.accountType === "admin"){
            nav("/admin/dashboard");
        }
        else if (currentUser.accountType === "organizer") {
            if(!toggleOrganizer) {
                nav('/home');
            }
        }
    }, []);

    useEffect(() => {
        const fetchEventAnalytics = async () => {
            try {
                // Fetch event details
                const eventResponse = await EventService.getEvent(eventId);
                setEventDetails(eventResponse.data);

                // Fetch bookings for the event
                const bookingResponse = await BookingService.getAllBookings();
                const eventBookings = (bookingResponse.data || []).filter(
                    (booking) => String(booking.eventId) === String(eventId) // Ensure type matching
                );
                setBookings(eventBookings);

                // Fetch feedbacks by eventId
                const feedbackResponse = await FeedbackService.getFeedbackByEventId(eventId);
                setFeedbacks(feedbackResponse.data || []);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching event analytics:", error);
                setLoading(false);
            }
        };

        fetchEventAnalytics();
    }, [eventId]);


    // Calculate total revenue
    const totalRevenue = bookings
        .filter((booking) => booking.is_paid) // Filter only paid bookings
        .reduce((sum, booking) => sum + booking.total_price, 0);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="template-page">
            <Box sx={{ display: "flex", width: "100%" }}>
                {/* Sidebar */}
                <OrganizerSidebar />

                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        backgroundColor: "#F3F3F3",
                        width: "1075px",
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* App Bar */}
                    <CustomAppBar title="Event Analytics" />

                    {/* Body Content */}
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        {eventDetails && (
                            <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
                                <Typography variant="h5">{eventDetails.name}</Typography>
                                <Typography>{eventDetails.description}</Typography>
                            </Paper>
                        )}

                        <Grid container spacing={3}>
                            {/* Bookings Section */}
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ padding: "20px", textAlign: "center" }}>
                                    <Typography variant="h6">Total Bookings</Typography>
                                    <Typography variant="h3">{bookings.length}</Typography>
                                </Paper>
                            </Grid>

                            {/* Revenue Section */}
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ padding: "20px", textAlign: "center" }}>
                                    <Typography variant="h6">Total Revenue</Typography>
                                    <Typography variant="h3">${totalRevenue.toFixed(2)}</Typography>
                                </Paper>
                            </Grid>

                            {/* Tickets Section */}
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ padding: "20px", textAlign: "center" }}>
                                    <Typography variant="h6">Total Tickets Sold</Typography>
                                    <Typography variant="h3">
                                        {bookings.reduce((total, booking) => total + booking.ticketCount, 0)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Feedback Details */}
                        <Box sx={{ marginTop: "30px" }}>
                            <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                                Feedback Details
                            </Typography>
                            {feedbacks.length > 0 ? (
                                feedbacks.map((feedback) => (
                                    <Paper key={feedback.feedbackId} sx={{ padding: "10px", marginBottom: "10px" }}>
                                        <Typography variant="subtitle1">
                                            <strong>User:</strong> {feedback.username}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Rating:</strong> {feedback.rating}/5
                                        </Typography>
                                        <Typography variant="body2">{feedback.comment}</Typography>
                                    </Paper>
                                ))
                            ) : (
                                <Typography>No feedback available for this event.</Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default OrganizerEventAnalytics;
