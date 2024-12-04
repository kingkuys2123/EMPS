import React, { useEffect, useState } from "react";
import { Typography, Box, Tabs, Tab, Button } from "@mui/material";
import { useParams } from "react-router-dom";

import OrganizerSidebar from "./OrganizerSidebar";
import CustomAppBar from "../CustomAppBar";
import EventService from "../../services/EventService";
import FeedbackServices from "../../services/FeedbackServices";

import "./styles/FontStyle.css";
import ViewTicketById from "./ViewTicketById";
import ViewBookingById from "./ViewBookingById";
import VenueService from "../../services/VenueService.jsx";

function ViewEventPage() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [venues, setVenues] = useState([]); // State to store available venues
    const [feedbacks, setFeedbacks] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    const fetchEvent = async () => {
        try {
            const response = await EventService.getEvent(eventId);
            setEvent(response.data);
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    };

    // Fetch all venues
    const fetchVenues = async () => {
        try {
            const response = await VenueService.getAllVenue();
            setVenues(response); // Populate venues dropdown
        } catch (error) {
            console.error("Error fetching venues:", error);
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
        fetchVenues(); // Fetch venues when component loads
    }, [eventId]);

    useEffect(() => {
        if (tabValue === 3) {
            fetchFeedbacks();
        }
    }, [tabValue, eventId]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleUpdateEvent = async () => {
        try {
            await EventService.updateEvent(eventId, event);
            alert("Event details updated successfully!");
            fetchEvent();
        } catch (error) {
            console.error("Error updating event:", error);
            console.log(venues);
            alert("Failed to update event details.");
        }
    };

    if (!event) return <p>This Event does not exist!</p>;

    return (
        <div className="template-page">
            <OrganizerSidebar />

            <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                <CustomAppBar title={event.name || "View Event"} sx={{ justifyContent: "space-between" }} />

                <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3", height: "100%" }}>
                    <Box sx={{ display: "flex", flexGrow: 1, backgroundColor: "#FFFFFF", width: "100%", height: "100%"}}>
                        <Box sx={{ minWidth: "150px", backgroundColor: "#CFCFC4", paddingTop: "15px" }}>
                            <Tabs
                                orientation="vertical"
                                value={tabValue}
                                onChange={handleTabChange}
                                textColor="primary"
                                indicatorColor="primary"
                                sx={{ borderRight: 1, borderColor: "divider", textAlign: "left" }}
                            >
                                <Tab label="Details" sx={{ alignItems: "flex-start" }} />
                                <Tab label="Tickets" sx={{ alignItems: "flex-start" }} />
                                <Tab label="Bookings" sx={{ alignItems: "flex-start" }} />
                                <Tab label="Feedbacks" sx={{ alignItems: "flex-start" }} />
                            </Tabs>
                        </Box>

                        <Box sx={{ flexGrow: 1, padding: "50px", backgroundColor: "#FFFFFF", width: "80%", position: 'relative' }}>
                            {tabValue === 0 && (
                                <Box>
                                    {/* Save Changes Button */}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdateEvent}
                                        sx={{
                                            position: "absolute",
                                            top: "20px",
                                            right: "20px",
                                        }}
                                    >
                                        Save Changes
                                    </Button>

                                    {/* Event Fields */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1">
                                            <strong>Event Name:</strong>
                                        </Typography>
                                        <input
                                            type="text"
                                            value={event.name}
                                            onChange={(e) =>
                                                setEvent({ ...event, name: e.target.value })
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                marginTop: "4px",
                                                fontSize: "16px",
                                                boxSizing: "border-box",
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1">
                                            <strong>Event Description:</strong>
                                        </Typography>
                                        <textarea
                                            value={event.description}
                                            onChange={(e) =>
                                                setEvent({ ...event, description: e.target.value })
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                marginTop: "4px",
                                                fontSize: "16px",
                                                boxSizing: "border-box",
                                                height: "100px",
                                                resize: "none",
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1">
                                            <strong>Event Schedule:</strong>
                                        </Typography>
                                        <input
                                            type="datetime-local"
                                            value={event.startDateTime || ""}
                                            onChange={(e) =>
                                                setEvent({
                                                    ...event,
                                                    startDateTime: e.target.value,
                                                })
                                            }
                                            style={{ marginRight: "10px" }}
                                        />
                                        <input
                                            type="datetime-local"
                                            value={event.endDateTime || ""}
                                            onChange={(e) =>
                                                setEvent({
                                                    ...event,
                                                    endDateTime: e.target.value,
                                                })
                                            }
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1">
                                            <strong>Event Type:</strong>
                                        </Typography>
                                        <select
                                            value={event.type || "Public"} // Default to "Public" if undefined
                                            onChange={(e) =>
                                                setEvent({ ...event, type: e.target.value })
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                marginTop: "4px",
                                                fontSize: "16px",
                                                boxSizing: "border-box",
                                            }}
                                        >
                                            <option value="Public">Public</option>
                                            <option value="Private">Private</option>
                                        </select>
                                    </Box>

                                    <Box sx={{mb: 2}}>
                                        <Typography variant="body1">
                                            <strong>Venue:</strong>
                                        </Typography>
                                        <select
                                            value={event.venue || ""}
                                            onChange={(e) =>
                                                setEvent({...event, venue: parseInt(e.target.value, 10) || ""})
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                marginTop: "4px",
                                                fontSize: "16px",
                                                boxSizing: "border-box",
                                            }}
                                        >
                                            <option value="">Select a venue</option>
                                            {venues.map((venue) => (
                                                <option key={venue.venueId} value={venue.venueId}>
                                                    {venue.name}
                                                </option>
                                            ))}
                                        </select>
                                    </Box>
                                </Box>
                            )}

                            {tabValue === 1 && (
                                <ViewTicketById/>
                            )}
                            {tabValue === 2 && (
                                <ViewBookingById/>
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
