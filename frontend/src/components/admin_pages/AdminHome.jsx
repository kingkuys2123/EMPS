import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Grid from '@mui/material/Grid2';
import AdminSidebar from "./AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import './styles/Dashboard.css';
import "../styles/FontStyle.css";
import OrganizerService from "../../services/OrganizerService.jsx";
import EventService from "../../services/EventService.jsx"; // Import EventService
import { getAuth } from "../../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const nav = useNavigate();
    const { currentUser } = getAuth();

    const [topOrganizers, setTopOrganizers] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);

    const formatter = (data) => data?.map(datum => ({
        ...datum,
        averageTicketsSold: datum?.events?.reduce((sum, event) => sum + event.attendees, 0) / datum?.events?.length / 100,
    }));

    useEffect(() => {
        if (!currentUser) {
            nav('/');
        } else if (currentUser.accountType === "user") {
            nav('/home');
        } else if (currentUser.accountType === "organizer") {
            nav('/organizer/dashboard');
        }
    }, [currentUser, nav]);

    useEffect(() => {
        OrganizerService.getTopOrganizers()
            .then(data => setTopOrganizers(formatter(data)))
            .catch(error => console.error("Error fetching top organizers:", error));
    }, []);

    useEffect(() => {
        EventService.getAllByConfirmationStatusPending()
            .then(response => {
                if (Array.isArray(response.data)) {
                    const eventData = response.data.map(event => ({
                        name: event.name,
                        organizer: `${event.organizer.user.firstName} ${event.organizer.user.lastName}`,
                        status: event.confirmationStatus
                    }));
                    setPendingEvents(eventData);
                } else {
                    console.error("Unexpected response format:", response);
                }
            })
            .catch(error => console.error("Error fetching pending events:", error));
    }, []);

    const handleConfirmEvent = (eventName) => {
        console.log(`Event Confirmed: ${eventName}`);
    };

    return (
        <div className="template-page">
            <Box sx={{ display: "flex", width: "100%" }}>
                <AdminSidebar />
                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
                    <CustomAppBar title={"Dashboard"} />
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Typography component="div" variant="body1">
                            <Grid container spacing={2} className="cont1">
                                <Grid className="inside">
                                    <span>Top 2 Events</span>
                                    <BarChart width={800} height={400} data={topOrganizers}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="organizerName"/>
                                        <YAxis/>
                                        <Tooltip/>
                                        <Legend/>
                                        <Bar dataKey="eventCount" fill="#8884d8" name="Events"/>
                                        <Bar dataKey="averageTicketsSold" fill="#82ca9d" name="Sales"/>
                                        <Bar dataKey="rating" fill="#ffc658" name="Rating"/>
                                    </BarChart>
                                </Grid>
                            </Grid>
                            <Grid container space={2} className="cont2">
                                <Grid className="inside">
                                    <span>Events Pending for Confirmation</span>
                                    <ul>
                                        {pendingEvents.map((event, index) => (
                                            <li key={index} className="pending-event"
                                                onClick={() => handleConfirmEvent(event.name)}
                                                style={{cursor: "pointer"}}>
                                                {event.name} - (Organized by {event.organizer})
                                            </li>
                                        ))}
                                    </ul>
                                </Grid>
                            </Grid>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}