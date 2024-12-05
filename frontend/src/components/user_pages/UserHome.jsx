import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import UserSidebar from "./UserSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import EventService from "../../services/EventService.jsx";
import { format, isToday } from 'date-fns';
import { ArrowForward } from "@mui/icons-material";
import "../styles/FontStyle.css";

function UserHome() {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        const fetchFeaturedEvents = async () => {
            try {
                const response = await EventService.getFeaturedEvents();
                setFeaturedEvents(response.data.slice(0, 2)); // Get only 2 featured events
            } catch (error) {
                console.error("Error fetching featured events:", error);
            }
        };

        const fetchUpcomingEvents = async () => {
            try {
                const response = await EventService.getRandomUpcomingEvents();
                setUpcomingEvents(response.data.slice(0, 3)); // Get only 3 upcoming events
            } catch (error) {
                console.error("Error fetching upcoming events:", error);
            }
        };

        fetchFeaturedEvents();
        fetchUpcomingEvents();
    }, []);

    return (
        <div className="home">
            <Box sx={{ display: "flex" }}>
                <UserSidebar />
                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
                    <CustomAppBar title={"Home"} />
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Box sx={{ height: "100%"}}>
                            <Box>
                                <Typography variant="h5">Featured Events</Typography>
                                <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap", paddingTop: "10px" }}>
                                    {featuredEvents.map(event => (
                                        <Card key={event.eventId} sx={{ flex: "1 1 calc(33.333% - 16px)", display: "flex", flexDirection: "column", height: 250 }}>
                                            <CardContent sx={{ display: "flex", flexDirection: "row", padding: 0, height: "100%" }}>
                                                <Box sx={{ flexShrink: 0, width: "auto", height: "100%" }}>
                                                    <img
                                                        src="/assets/placeholders/1280x720-image-placeholder.png"
                                                        alt="Event"
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                </Box>
                                                <Box sx={{ flexGrow: 1, padding: 2 }}>
                                                    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                                        <Typography
                                                            sx={{ paddingBottom: "5px", textTransform: "uppercase", color: "text.secondary", fontSize: "12px" }}
                                                        >
                                                            {isToday(new Date(event.startDatetime))
                                                                ? `Today | ${format(new Date(event.startDatetime), 'p')}`
                                                                : `${format(new Date(event.startDatetime), 'EEE, MMM d | p')}`}
                                                        </Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                                                            {event.name}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ paddingBottom: "15px", fontSize: "14px", whiteSpace: "nowrap" }}>
                                                            {event.venue.name}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                                                            {event.description}
                                                        </Typography>

                                                        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", flexGrow: 1 }}>
                                                            <Typography variant="body2" sx={{ cursor: "pointer", color: "gray" }}>
                                                                <Link to={`/events/${event.eventId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                    More Details
                                                                </Link>
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Box>
                            <Box>
                                <Box sx={{ marginTop: "25px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Typography variant="h5">Upcoming Events</Typography>
                                    <Typography variant="body2" sx={{ cursor: "pointer", color: "black", display: "flex", alignItems: "center" }}>
                                        <Link to="/events" style={{ textDecoration: 'none', color: 'inherit', display: "flex", alignItems: "center" }}>
                                            <Typography sx={{ marginRight: "10px" }} >Explore more events</Typography> <ArrowForward />
                                        </Link>
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap", paddingTop: "10px", height: "100%" }}>
                                    {upcomingEvents.map(event => (
                                        <Card key={event.eventId} sx={{ flex: "1 1 calc(33.333% - 16px)", display: "flex", flexDirection: "column", height: "auto" }}>
                                            <Box sx={{ flexShrink: 0, width: "100%", height: "60%" }}>
                                                <img
                                                    src="/assets/placeholders/1280x720-image-placeholder.png"
                                                    alt="Event"
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            </Box>
                                            <CardContent sx={{ flexGrow: 1, padding: 2 }}>
                                                <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                                    <Typography
                                                        sx={{ paddingBottom: "5px", textTransform: "uppercase", color: "text.secondary", fontSize: "12px" }}
                                                    >
                                                        {isToday(new Date(event.startDatetime))
                                                            ? `Today | ${format(new Date(event.startDatetime), 'p')}`
                                                            : `${format(new Date(event.startDatetime), 'EEE, MMM d | p')}`}
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                                                        {event.name}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ fontSize: "12px", whiteSpace: "nowrap" }}>
                                                        {event.description}
                                                    </Typography>

                                                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", flexGrow: 1 }}>
                                                        <Typography variant="body2" sx={{ cursor: "pointer", color: "gray" }}>
                                                            <Link to={`/events/${event.eventId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                More Details
                                                            </Link>
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default UserHome;