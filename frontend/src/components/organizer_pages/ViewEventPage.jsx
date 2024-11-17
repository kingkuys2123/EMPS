import React, { useEffect, useState } from "react";
import { Typography, Box, Tabs, Tab, Button } from "@mui/material";
import { useParams } from "react-router-dom";

import OrganizerSidebar from "./OrganizerSidebar";
import CustomAppBar from "./CustomAppBar";
import EventService from "../../services/EventService";
import FeedbackServices from "../../services/FeedbackServices";

import "./styles/FontStyle.css";

function ViewEventPage() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);  // State for feedback data
    const [tabValue, setTabValue] = useState(0);

    const fetchEvent = async () => {
        try {
            const response = await EventService.getEvent(eventId);
            setEvent(response.data);
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const allFeedbacks = await FeedbackServices.getAllFeedback();  // Fetch all feedbacks
            const eventFeedbacks = allFeedbacks.filter(feedback => feedback.event.id === eventId);  // Filter by event ID
            setFeedbacks(eventFeedbacks);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    useEffect(() => {
        if (tabValue === 3) {  // Fetch feedbacks when the Feedback tab is selected
            fetchFeedbacks();
        }
    }, [tabValue, eventId]);  // Fetch feedbacks when the tab is selected

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (!event) return <p>This Event does not exist!</p>;

    return (
        <div className="template-page">
            <Box sx={{ display: "flex" }}>
                <OrganizerSidebar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", display: "flex", flexDirection: "column", height: "100vh", width: "1075px" }}>
                    {/* App Bar with Event Name and Account Icon aligned right */}
                    <CustomAppBar title={event.name || "View Event"} sx={{ justifyContent: "space-between" }} />

                    <Box sx={{ display: "flex", flexGrow: 1 }}>
                        {/* Left-side Tabs for Navigation */}
                        <Box sx={{ minWidth: "200px", backgroundColor: "#E0E0E0", paddingTop: "15px" }}>
                            <Tabs
                                orientation="vertical"
                                value={tabValue}
                                onChange={handleTabChange}
                                textColor="primary"
                                indicatorColor="primary"
                                sx={{ borderRight: 1, borderColor: "divider" }}
                            >
                                <Tab label="Details" />
                                <Tab label="Tickets" />
                                <Tab label="Bookings" />
                                <Tab label="Feedbacks" />
                            </Tabs>
                        </Box>

                        {/* Centered Content Area */}
                        <Box sx={{ flexGrow: 1, padding: "50px", backgroundColor: "#FFFFFF", margin: "glex", width: "80%" }}>
                            {tabValue === 0 && (
                                <Box>
                                    <Typography variant="h6">Event Details</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body1"><strong>Description:</strong> {event.description}</Typography>
                                        <Typography variant="body1"><strong>Type:</strong> {event.type}</Typography>
                                        <Typography variant="body1"><strong>Status:</strong> {event.eventStatus}</Typography>
                                        <Typography variant="body1"><strong>Start Date & Time:</strong> {new Date(event.startDatetime).toLocaleString()}</Typography>
                                        <Typography variant="body1"><strong>End Date & Time:</strong> {new Date(event.endDatetime).toLocaleString()}</Typography>
                                        <Typography variant="body1"><strong>Confirmation Status:</strong> {event.confirmationStatus}</Typography>
                                        <Typography variant="body1"><strong>Number of Attendees:</strong> {event.attendees}</Typography>
                                    </Box>
                                </Box>
                            )}

                            {tabValue === 1 && (
                                <Typography variant="body1">Tickets content goes here.</Typography>
                            )}
                            {tabValue === 2 && (
                                <Typography variant="body1">Bookings content goes here.</Typography>
                            )}
                            {tabValue === 3 && (
                                <Box>
                                    <Typography variant="h6">Feedbacks</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        {feedbacks.length > 0 ? (
                                            feedbacks.map((feedback) => (
                                                <Box key={feedback.feedbackId} sx={{ mb: 2 }}>
                                                    <Typography variant="body1"><strong>User:</strong> {feedback.user.name}</Typography>
                                                    <Typography variant="body2"><strong>Comment:</strong> {feedback.comment}</Typography>
                                                    <Typography variant="body2"><strong>Rating:</strong> {feedback.rating}</Typography>
                                                    <Typography variant="body2"><strong>Date:</strong> {new Date(feedback.datetimeCreated).toLocaleString()}</Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography>No feedbacks available for this event.</Typography>
                                        )}
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default ViewEventPage;
