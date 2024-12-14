import React, { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel, Typography, Box, Tabs, Tab, Button, Grid, TextField, Autocomplete, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Rating, Pagination, LinearProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import OrganizerSidebar from "./OrganizerSidebar";
import CustomAppBar from "../CustomAppBar";
import EventService from "../../services/EventService";
import FeedbackServices from "../../services/FeedbackServices";
import VenueService from "../../services/VenueService.jsx";
import UserService from "../../services/UserService.jsx";
import { getAuth } from "../../utils/AuthContext.jsx";
import CustomSnackbar from "../CustomSnackbar";

import "./styles/FontStyle.css";
import ViewTicketById from "./ViewTicketById";
import ViewBookingById from "./ViewBookingById";

import format from 'date-fns/format';

function ViewEventPage() {
    const nav = useNavigate();
    const { currentUser, toggleOrganizer } = getAuth();
    const { eventId } = useParams();

    const [event, setEvent] = useState(null);
    const [venues, setVenues] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState('/assets/placeholders/1280x720-image-placeholder.png');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isFormEdited, setIsFormEdited] = useState(false);

    const [venueOptions, setVenueOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const feedbacksPerPage = 5;

    const [selectedRating, setSelectedRating] = useState("");


    useEffect(() => {
        if (!currentUser) {
            nav('/');
        } else if (currentUser.accountType === "user") {
            nav("/home");
        } else if (currentUser.accountType === "admin") {
            nav("/admin/dashboard");
        } else {
            fetchEvent();
            fetchVenues();
            if (tabValue === 3) {
                fetchFeedbacks();
            }
        }
    }, [currentUser, eventId, tabValue, nav]);

    const handleRatingChange = (event) => {
        setSelectedRating(event.target.value);
    };

    const filteredFeedbacks = selectedRating
        ? feedbacks.filter(feedback => feedback.rating === parseInt(selectedRating))
        : feedbacks;

    const fetchEvent = async () => {
        try {
            const response = await EventService.getEvent(eventId);
            if (!response.data || response.data.organizer.organizerId !== currentUser.userID) {
                nav("/organizer/events");
                return;
            }

            setEvent(response.data);

            if (response.data.coverPhoto) {
                const coverPhotoResponse = await EventService.getCoverPhoto(response.data.coverPhoto);
                if (coverPhotoResponse && coverPhotoResponse.data) {
                    setCoverPhotoPreview(URL.createObjectURL(coverPhotoResponse.data));
                }
            }
        } catch (error) {
            console.error("Error fetching event:", error);
            nav("/organizer/events");
        }
    };

    const fetchVenues = async () => {
        try {
            const response = await VenueService.getAllVenue();
            setVenueOptions(response);
        } catch (error) {
            console.error("Error fetching venues:", error);
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const feedbacksResponse = await FeedbackServices.getFeedbacksByEvent(eventId);
            const feedbacksWithProfilePictures = await Promise.all(feedbacksResponse.map(async feedback => {
                if (feedback.user.profilePicture) {
                    const profilePictureUrl = await UserService.getProfilePicture(feedback.user.profilePicture);
                    return { ...feedback, user: { ...feedback.user, profilePictureUrl } };
                }
                return feedback;
            }));
            setFeedbacks(feedbacksWithProfilePictures);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleCoverPhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSize = 15 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('File size must be under 15MB.');
                return;
            }
            setCoverPhoto(file);
            setCoverPhotoPreview(URL.createObjectURL(file));
            setIsFormEdited(true);
        }
    };

    const handleInputChange = (e) => {
        setEvent({ ...event, [e.target.name]: e.target.value });
        setIsFormEdited(true);
    };

    const handleUpdateEvent = async () => {
        try {
            const tempVenueId = event.venue.venueId;
            await EventService.updateEvent(eventId, event);
            if (coverPhoto) {
                await EventService.uploadCoverPhoto(eventId, coverPhoto);
                const coverPhotoResponse = await EventService.getCoverPhoto(event.coverPhoto);
                setCoverPhotoPreview(URL.createObjectURL(coverPhotoResponse.data));
            }
            setSnackbarMessage("Event details updated successfully!");
            setOpenSnackbar(true);
            setIsFormEdited(false);
            fetchEvent();
        } catch (error) {
            console.error("Error updating event:", error);
            setSnackbarMessage("Failed to update event details.");
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const indexOfLastFeedback = currentPage * feedbacksPerPage;
    const indexOfFirstFeedback = indexOfLastFeedback - feedbacksPerPage;
    const currentFeedbacks = feedbacks.slice(indexOfFirstFeedback, indexOfLastFeedback);

    const averageRating = feedbacks.length ? (feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0) / feedbacks.length).toFixed(1) : 0;
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: feedbacks.filter(feedback => feedback.rating === star).length
    }));

    return (
        <div className="template-page">
            <OrganizerSidebar />
            <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
                <CustomAppBar title={event?.name || "View Event"} sx={{ justifyContent: "space-between" }} />
                <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3", height: "100%" }}>
                    <Box sx={{ display: "flex", flexGrow: 1, backgroundColor: "#FFFFFF", width: "100%", height: "100%" }}>
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
                                    <Box sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
                                        <Box sx={{ mr: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2}}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <div style={{
                                                        width: '320px',
                                                        height: '180px',
                                                        overflow: 'hidden',
                                                        borderRadius: '10px',
                                                        flexShrink: 0,
                                                        marginBottom: '15px'
                                                    }}>
                                                        <img
                                                            src={coverPhotoPreview}
                                                            alt="cover-photo-preview"
                                                            style={{ width: '320px', height: '180px', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                        sx={{
                                                            backgroundColor: "#C63f47",
                                                            color: "#FFFFFF",
                                                            textTransform: 'none',
                                                            borderRadius: "0",
                                                            width: "100%"
                                                        }}
                                                    >
                                                        <Typography>
                                                            <span>Upload Cover Photo</span>
                                                        </Typography>
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept="image/png, image/jpeg"
                                                            onChange={handleCoverPhotoChange}
                                                        />
                                                    </Button>
                                                </div>
                                            </Box>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body1"><strong>Event Name:</strong></Typography>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={event?.name || ""}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px",
                                                        marginTop: "4px",
                                                        fontSize: "16px",
                                                        boxSizing: "border-box"
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="body1"><strong>Event Description:</strong></Typography>
                                                <textarea
                                                    name="description"
                                                    value={event?.description || ""}
                                                    onChange={handleInputChange}
                                                    style={{ width: "100%", padding: "8px", marginTop: "4px", fontSize: "16px", boxSizing: "border-box", height: "100px", resize: "none" }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1" sx={{ mb: 2 }} ><strong>Event Schedule:</strong></Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Start Date & Time"
                                                    type="datetime-local"
                                                    value={event?.startDateTime || ""}
                                                    onChange={(e) => handleInputChange({ target: { name: 'startDateTime', value: e.target.value } })}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    inputProps={{
                                                        max: event?.endDateTime || "",
                                                    }}
                                                    sx={{ mb: 3 }}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="End Date & Time"
                                                    type="datetime-local"
                                                    value={event?.endDateTime || ""}
                                                    onChange={(e) => handleInputChange({ target: { name: 'endDateTime', value: e.target.value } })}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    inputProps={{
                                                        min: event?.startDateTime || "",
                                                    }}
                                                    required
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1"><strong>Event Type:</strong></Typography>
                                        <select
                                            name="type"
                                            value={event?.type || "Public"}
                                            onChange={handleInputChange}
                                            style={{ width: "100%", padding: "8px", marginTop: "4px", fontSize: "16px", boxSizing: "border-box" }}
                                        >
                                            <option value="Public">Public</option>
                                            <option value="Private">Private</option>
                                        </select>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1"><strong>Venue:</strong></Typography>
                                        <Autocomplete
                                            options={venueOptions}
                                            getOptionLabel={(option) => option.name}
                                            value={venueOptions.find(option => option.venueId === event?.venue?.venueId) || null}
                                            onChange={(event, newValue) => {
                                                setEvent(prevEvent => ({
                                                    ...prevEvent,
                                                    venue: newValue ? { venueId: newValue.venueId, name: newValue.name } : null
                                                }));
                                                setIsFormEdited(true);
                                            }}
                                            renderInput={(params) => <TextField {...params}/>}
                                            noOptionsText="No Venues Found"
                                            style={{ width: "100%", padding: "8px", marginTop: "4px", fontSize: "16px", boxSizing: "border-box" }}
                                        />
                                    </Box>
                                    <Button
                                        variant="contained"
                                        onClick={handleUpdateEvent}
                                        sx={{ backgroundColor: "#C63f47", width: "23%", borderRadius: 0 }}
                                        disabled={!isFormEdited}
                                    >
                                        Save Changes
                                    </Button>
                                </Box>
                            )}
                            {tabValue === 1 && <ViewTicketById eventId={eventId}/>}
                            {tabValue === 2 && <ViewBookingById eventId={eventId}/>}
                            {tabValue === 3 && (
                                <Box>
                                    <Grid container spacing={2} sx={{ height: "100%" }}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6" sx={{ marginBottom: 1 }}>Feedbacks</Typography>
                                                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                                                    <InputLabel>Rating</InputLabel>
                                                    <Select
                                                        value={selectedRating}
                                                        onChange={handleRatingChange}
                                                        label="Rating"
                                                    >
                                                        <MenuItem value="">
                                                            <em>All</em>
                                                        </MenuItem>
                                                        {[5, 4, 3, 2, 1].map(star => (
                                                            <MenuItem key={star} value={star}>{star} Stars</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <List sx={{ height: '575px', bgcolor: 'background.paper', padding: '20px', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#F3F3F3', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                {filteredFeedbacks.length === 0 ? (
                                                    <Typography variant="body1" sx={{ color: "darkgray", textAlign: 'center', marginTop: 2 }}>No feedbacks added...</Typography>
                                                ) : (
                                                    filteredFeedbacks.map((feedback, index) => (
                                                        <React.Fragment key={feedback.feedbackId}>
                                                            <ListItem alignItems="flex-start" sx={{ padding: '10px' }}>
                                                                <ListItemAvatar>
                                                                    <Avatar alt={feedback.user.firstName} src={feedback.user.profilePictureUrl || `/assets/placeholders/avatar-photo-placeholder.png`} />
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={`${feedback.user.firstName} ${feedback.user.lastName}`}
                                                                    primaryTypographyProps={{ sx: { fontSize: '1.2rem', fontWeight: 'bold', color: '#000000' } }}
                                                                    secondary={
                                                                        <Box>
                                                                            <Rating name="rating" value={feedback.rating} readOnly size="small" />
                                                                            <Typography component="span" variant="body2" sx={{ color: 'text.primary', display: 'block', fontSize: '1.2em' }}>
                                                                                {feedback.comment}
                                                                            </Typography>
                                                                            <Typography component="span" variant="body2" sx={{ color: '#736565', display: 'block', fontSize: '0.9em' }}>
                                                                                {format(new Date(feedback.datetime_created), 'MMMM d, yyyy h:mm a')}
                                                                            </Typography>
                                                                        </Box>
                                                                    }
                                                                />
                                                            </ListItem>
                                                            {index < filteredFeedbacks.length - 1 && <Divider variant="inset" component="li" />}
                                                        </React.Fragment>
                                                    ))
                                                )}
                                            </List>
                                            <Pagination
                                                count={Math.ceil(feedbacks.length / feedbacksPerPage)}
                                                page={currentPage}
                                                onChange={handlePageChange}
                                                sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                                            <Box sx={{ width: "80%" }}>
                                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#C63f47' }}>{averageRating}</Typography>
                                                    <Rating name="average-rating" value={parseFloat(averageRating)} readOnly precision={0.1} size="large" />
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                                        {feedbacks.length} {feedbacks.length === 1 ? 'Feedback' : 'Feedbacks'}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    {ratingDistribution.map(({ star, count }) => (
                                                        <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            <Typography variant="body2" sx={{ width: '10%', fontWeight: 'bold', color: '#C63f47' }}>{star}</Typography>
                                                            <LinearProgress variant="determinate" value={(count / feedbacks.length) * 100} sx={{ width: '80%', mr: 1, height: 10, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#C63f47' } }} />
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />
        </div>
    );
}

export default ViewEventPage;