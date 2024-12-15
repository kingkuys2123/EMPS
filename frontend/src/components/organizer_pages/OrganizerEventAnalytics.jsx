import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Paper, Grid, CircularProgress, Rating, LinearProgress } from "@mui/material";
import OrganizerSidebar from "./OrganizerSidebar";
import CustomAppBar from "../CustomAppBar";
import EventService from "../../services/EventService";
import BookingService from "../../services/BookingService";
import FeedbackService from "../../services/FeedbackServices";
import { getAuth } from "../../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import FeedbackServices from "../../services/FeedbackServices.jsx";
import UserService from "../../services/UserService.jsx";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function OrganizerEventAnalytics() {
    const nav = useNavigate();
    const { currentUser, toggleOrganizer } = getAuth();
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0); // Initialize as a number
    const [totalTicketsSold, setTotalTicketsSold] = useState(0); // Initialize as a number

    useEffect(() => {
        if (!currentUser) {
            nav('/');
        } else if (currentUser.accountType === "user") {
            nav("/home");
        } else if (currentUser.accountType === "admin") {
            nav("/admin/dashboard");
        } else if (currentUser.accountType === "organizer") {
            if (!toggleOrganizer) {
                nav('/home');
            }
        }
    }, []);

    useEffect(() => {
        const fetchEventAnalytics = async () => {
            try {
                const eventResponse = await EventService.getEvent(parseInt(eventId));
                if (!eventResponse.data || eventResponse.data.organizer.organizerId !== currentUser.userID) {
                    nav("/organizer/dashboard");
                    return;
                }

                const feedbacksResponse = await FeedbackServices.getFeedbacksByEvent(eventId);
                const feedbacksWithProfilePictures = await Promise.all(feedbacksResponse.map(async feedback => {
                    if (feedback.user.profilePicture) {
                        const profilePictureUrl = await UserService.getProfilePicture(feedback.user.profilePicture);
                        return { ...feedback, user: { ...feedback.user, profilePictureUrl } };
                    }
                    return feedback;
                }));

                setFeedbacks(feedbacksWithProfilePictures);

                const totalRevenueResponse = await BookingService.getTotalPaidPriceSumByEvent(parseInt(eventId));
                setTotalRevenue(totalRevenueResponse);

                const totalTicketsSoldResponse = await BookingService.getTotalPaidTicketQuantitySumByEvent(parseInt(eventId));
                setTotalTicketsSold(totalTicketsSoldResponse);

                const bookingResponse = await BookingService.getAllBookingsByEventId(parseInt(eventId));
                setBookings(bookingResponse);

                setEventDetails(eventResponse.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching event analytics:", error);
                setLoading(false);
            }
        };

        fetchEventAnalytics();
    }, [eventId]);

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

    const averageRating = feedbacks.length ? (feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacks.length).toFixed(1) : 0;
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: feedbacks.filter(feedback => feedback.rating === star).length
    }));

    return (
        <div className="template-page">
            <Box sx={{ display: "flex", width: "100%" }}>
                <OrganizerSidebar />
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
                    <CustomAppBar title="Event Analytics" />
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        {eventDetails && (
                            <Paper sx={{ padding: "20px", marginBottom: "20px" }}>
                                <Typography variant="h5">{eventDetails.name}</Typography>
                                <Typography>{eventDetails.description}</Typography>
                            </Paper>
                        )}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ padding: "20px", textAlign: "center" }}>
                                    <Typography variant="h6">Total Bookings</Typography>
                                    <Typography variant="h3">{bookings.length}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ padding: "20px", textAlign: "center" }}>
                                    <Typography variant="h6">Total Revenue</Typography>
                                    <Typography variant="h3">Php {totalRevenue || 0 }.00</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ padding: "20px", textAlign: "center" }}>
                                    <Typography variant="h6">Total Tickets Sold</Typography>
                                    <Typography variant="h3">{totalTicketsSold || 0}</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Box sx={{ marginTop: "30px" }}>
                            <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                                Feedbacks
                            </Typography>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                                <Box sx={{ width: "80%" }}>
                                    <Box sx={{ mt: 4 }}>
                                        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>Rating Trend</Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={feedbacks.map(feedback => ({ date: feedback.datetime_created, rating: feedback.rating }))}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
                                                <YAxis domain={[0, 5]} />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="rating" stroke="#C63f47" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Box>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default OrganizerEventAnalytics;