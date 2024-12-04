import React, { useEffect, useState } from "react";
import { Typography, Box, Grid, Paper } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import OrganizerSidebar from "./OrganizerSidebar";
import CustomAppBar from "../CustomAppBar";
import EventService from "../../services/EventService";

function OrganizerDashboard() {
    const [events, setEvents] = useState([]);
    const [analyticsData, setAnalyticsData] = useState([]);
    const navigate = useNavigate();

    // Fetch all events and calculate analytics
    const fetchEvents = async () => {
        try {
            const response = await EventService.getAllEvent();
            setEvents(response.data);

            // Example analytics data
            const analytics = calculateAnalytics(response.data);
            setAnalyticsData(analytics);
        } catch (error) {
            console.error("Error fetching events:", error);
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
    

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEventClick = (eventId) => {
        navigate(`/organizer/dashboard/${eventId}`);
    };

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
                                <Paper sx={{ padding: "20px", textAlign: "center" }}>
                                    <Typography variant="h6">Total Events</Typography>
                                    <Typography variant="h3">{events.length}</Typography>
                                </Paper>
                            </Grid>

                            {/* Category Breakdown Chart */}
                            <Grid item xs={12} md={8}>
                                <Paper sx={{ padding: "20px", height: "300px" }}>
                                    <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                                        Events by Confirmed and Pending
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
                                {events.map((event) => (
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
                                                //src={event.image || "/placeholder-image.png"}
                                                //alt={event.name}
                                                style={{
                                                    width: "100%",
                                                    height: "150px",
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
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default OrganizerDashboard;
