import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Paper, Button } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import OrganizerSidebar from "./OrganizerSidebar";
import CustomAppBar from "../CustomAppBar";
import EventService from "../../services/EventService";

import { getAuth } from "../../utils/AuthContext.jsx";

function OrganizerDashboard() {
    const { currentUser, toggleOrganizer } = getAuth();

    const [events, setEvents] = useState([]);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 6;
    const nav = useNavigate();

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
        fetchEvents();
    }, []);

    // Fetch all events and calculate analytics
    const fetchEvents = async () => {
        try {
            const response = await EventService.getEventsByOrganizer(currentUser.userID);
            const events = response.data;

            for (const event of events) {
                if (event.coverPhoto) {
                    const coverPhotoResponse = await EventService.getCoverPhoto(event.coverPhoto);
                    const coverPhotoBlob = new Blob([coverPhotoResponse.data], { type: 'image/jpeg' });
                    event.coverPhotoUrl = URL.createObjectURL(coverPhotoBlob);
                }
            }

            setEvents(events);

            // Example analytics data
            const analytics = calculateAnalytics(events);
            setAnalyticsData(analytics);
        } catch (error) {
            console.error("Error fetching events:", error);
            nav("/organizer/dashboard");
        }
    };

    // Example analytics calculation
    const calculateAnalytics = (events) => {
        const categoryCounts = {
            Confirmed: 0,
            Pending: 0,
        };

        events.forEach((event) => {
            if (event.confirmationStatus === "Confirmed") {
                categoryCounts.Confirmed += 1;
            } else if (event.confirmationStatus === "Pending") {
                categoryCounts.Pending += 1;
            }
        });

        return Object.entries(categoryCounts).map(([name, value]) => ({
            name,
            value,
        }));
    };

    const handleEventClick = (eventId) => {
        nav(`/organizer/dashboard/event/${eventId}`);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    // Calculate the events to display for the current page
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    return (
        <div className="template-page">
            <Box sx={{ display: "flex", width: '100%' }}>
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
                    <CustomAppBar title="Dashboard" />

                    {/* Body Content */}
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        {/* Header */}
                        <Typography variant="h5" sx={{ marginBottom: "20px" }}>
                            Organizer Analytics
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Total Events Card */}
                            <Grid item xs={12} md={4}>
                                <Paper sx={{ padding: "20px", textAlign: "center", height: "300px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                    <Typography variant="h6">Total Events</Typography>
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                                        <Typography variant="h3">{events.length}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Category Breakdown Chart */}
                            <Grid item xs={12} md={8}>
                                <Paper sx={{ padding: "20px", height: "300px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                    <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                                        Confirmed and Pending Events
                                    </Typography>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={analyticsData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                fill="#8884d8"
                                            >
                                                {analyticsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Events List */}
                        <Box sx={{ marginTop: "30px" }}>
                            <Typography variant="h6" gutterBottom>
                                Events
                            </Typography>
                            <Grid container spacing={3}>
                                {currentEvents.map((event) => (
                                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                                        <Paper
                                            sx={{
                                                padding: "16px",
                                                backgroundColor: "#fff",
                                                cursor: "pointer",
                                                transition: "box-shadow 0.2s ease",
                                                "&:hover": {
                                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                },
                                            }}
                                            onClick={() => handleEventClick(event.eventId)}
                                        >
                                            <img
                                                src={event.coverPhotoUrl || "/assets/placeholders/1280x720-image-placeholder.png"}
                                                alt={event.name}
                                                style={{
                                                    width: "100%",
                                                    height: "250px",
                                                    objectFit: "cover",
                                                    borderRadius: "4px",
                                                    marginBottom: "8px",
                                                }}
                                            />
                                            <Typography variant="h6">{event.name}</Typography>
                                            <Typography variant="body2" color="textSecondary">
                                                {event.description.substring(0, 100)}...
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Pagination Controls */}
                            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                                {Array.from({ length: Math.ceil(events.length / eventsPerPage) }, (_, index) => (
                                    <Button
                                        key={index + 1}
                                        onClick={() => handlePageChange(index + 1)}
                                        variant={currentPage === index + 1 ? "contained" : "outlined"}
                                        sx={{
                                            margin: "0 5px",
                                            backgroundColor: currentPage === index + 1 ? "#C63f47" : "transparent",
                                            color: currentPage === index + 1 ? "white" : "#C63f47",
                                            borderColor: "#C63f47"
                                        }}
                                    >
                                        {index + 1}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default OrganizerDashboard;