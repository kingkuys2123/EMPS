import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography, Grid, Button, List, ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Rating, TextField, Pagination, LinearProgress } from "@mui/material";
import FeedbackService from "../../services/FeedbackServices.jsx";
import UserService from "../../services/UserService.jsx";
import UserSidebar from "./UserSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import CustomSnackbar from "../CustomSnackbar.jsx";
import { getAuth } from "../../utils/AuthContext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/FontStyle.css';
import EventService from "../../services/EventService.jsx";
import OrganizerService from "../../services/OrganizerService.jsx";
import TicketService from "../../services/TicketService.jsx";
import { format } from 'date-fns';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from "../ConfirmDialog.jsx";
import LoginModal from "../LoginModal.jsx";
import RegisterModal from "../RegisterModal.jsx";
import BookTicketModal from './BookTicketModal.jsx';

function UserViewEvent() {
    const nav = useNavigate();
    const { currentUser, toggleOrganizer } = getAuth();
    const { eventId } = useParams();

    const [event, setEvent] = useState(null);
    const [organizer, setOrganizer] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);

    const [feedbackError, setFeedbackError] = useState(false);
    const [currentFeedback, setCurrentFeedback] = useState(null);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);

    const [openConfirmLoginDialog, setOpenConfirmLoginDialog] = useState(false);

    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openRegisterModal, setOpenRegisterModal] = useState(false);
    const [openBookTicketModal, setOpenBookTicketModal] = useState(false);

    const feedbacksPerPage = 5;

    useEffect(() => {
        if(currentUser){
            if(currentUser.accountType === "organizer"){
                if(toggleOrganizer) {
                    nav('/organizer/dashboard');
                }
            }
            else if(currentUser.accountType === "admin"){
                nav("/admin/dashboard");
            }
        }
    }, []);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await EventService.getEvent(eventId);
                const event = response.data;
                if (!event || event.eventId.toString() !== eventId.toString()) {
                    nav("/events");
                    return;
                }
                if(!event || event.confirmationStatus === "Pending"){
                    nav("/events");
                    return;
                }
                if (event.coverPhoto) {
                    const coverPhotoResponse = await EventService.getCoverPhoto(event.coverPhoto);
                    event.coverPhotoUrl = URL.createObjectURL(coverPhotoResponse.data);
                }
                setEvent(event);

                const organizerResponse = await OrganizerService.getOrganizerWithUser(event.organizer.organizerId);
                setOrganizer(organizerResponse);

                const ticketsResponse = await TicketService.getTicketsByEventId(eventId);
                const ticketsWithRemainingQuantity = await Promise.all(ticketsResponse.map(async (ticket) => {
                    const remainingQuantityResponse = await TicketService.getRemainingTicketQuantity(ticket.ticketId);
                    return { ...ticket, remainingQuantity: remainingQuantityResponse.remainingQuantity };
                }));
                setTickets(ticketsWithRemainingQuantity);

                const feedbacksResponse = await FeedbackService.getFeedbacksByEvent(eventId);
                const feedbacksWithProfilePictures = await Promise.all(feedbacksResponse.map(async feedback => {
                    if (feedback.user.profilePicture) {
                        const profilePictureUrl = await UserService.getProfilePicture(feedback.user.profilePicture);
                        return { ...feedback, user: { ...feedback.user, profilePictureUrl } };
                    }
                    return feedback;
                }));
                setFeedbacks(feedbacksWithProfilePictures);

                if (currentUser) {
                    const feedbackExists = await FeedbackService.findByUserIdAndEventId(currentUser.userID, eventId);
                    if (feedbackExists) {
                        const userFeedback = await FeedbackService.getFeedbackByUserAndEvent(currentUser.userID, eventId);
                        setCurrentFeedback(userFeedback);
                        setNewComment(userFeedback.comment);
                        setNewRating(userFeedback.rating);
                    } else {
                        setCurrentFeedback(null);
                        setNewComment('');
                        setNewRating(0);
                    }
                }
            } catch (error) {
                console.error("Error fetching event, organizer, tickets, or feedbacks:", error);
                nav("/events");
            }
        };

        fetchEvent();
    }, [currentUser, eventId, nav]);

    const handleBookTicketClick = () => {
        if (!currentUser) {
            setOpenConfirmLoginDialog(true);
        } else {
            if (event.eventStatus.toLowerCase() === "ongoing") {
                setSnackbarMessage("You can't book anymore as the event is currently happening.");
                setOpenSnackbar(true);
            } else if (event.eventStatus.toLowerCase() === "completed") {
                setSnackbarMessage("You can't book anymore because the event has already happened.");
                setOpenSnackbar(true);
            } else if (event.eventStatus.toLowerCase() === "cancelled") {
                setSnackbarMessage("You can't book anymore because the event has been cancelled.");
                setOpenSnackbar(true);
            } else {
                setOpenBookTicketModal(true);
            }
        }
    };

    const handleCloseBookTicketModal = () => {
        setOpenBookTicketModal(false);
    };

    const handleConfirmLoginDialogClose = (confirm) => {
        if (confirm) {
            setOpenLoginModal(true);
        }
        setOpenConfirmLoginDialog(false);
    };

    const handleCloseLoginModal = () => {
        setOpenLoginModal(false);
    };

    const handleCloseRegisterModal = () => {
        setOpenRegisterModal(false);
    };

    const handleDeleteFeedback = (feedback) => {
        setFeedbackToDelete(feedback);
        setOpenConfirmDialog(true);
    };

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'ongoing':
            case 'completed':
                return { color: '#006400', backgroundColor: '#e0f7e0', padding: '5px', borderRadius: "5px", width: "85px", textAlign: 'center' };
            case 'upcoming':
                return { color: '#FFD700', backgroundColor: '#fff9e0', padding: '5px', borderRadius: "5px", width: "85px", textAlign: 'center' };
            case 'cancelled':
                return { color: '#8B0000', backgroundColor: '#f7e0e0', padding: '5px', borderRadius: "5px", width: "85px", textAlign: 'center' };
            default:
                return {};
        }
    };

    const confirmDeleteFeedback = async (confirm) => {
        if (confirm && feedbackToDelete) {
            try {
                await FeedbackService.deleteFeedback(feedbackToDelete.feedbackId);
                setSnackbarMessage('Feedback deleted successfully!');
                setFeedbacks(feedbacks.filter(fb => fb.feedbackId !== feedbackToDelete.feedbackId));
            } catch (error) {
                setSnackbarMessage('Error deleting feedback: ' + error);
            }
            setOpenSnackbar(true);
        }

        setNewRating(0);
        setNewComment('');
        setCurrentFeedback(null);

        setOpenConfirmDialog(false);
        setFeedbackToDelete(null);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleUpdateTicketQuantity = (ticketId, newQuantity) => {
        setTickets((prevTickets) =>
            prevTickets.map((ticket) =>
                ticket.ticketId === ticketId ? { ...ticket, remainingQuantity: newQuantity } : ticket
            )
        );
    };

    const handleSubmitFeedback = async () => {
        if (!newComment.trim()) {
            setSnackbarMessage('Feedback cannot be empty.');
            setOpenSnackbar(true);
            setFeedbackError(true);
            return;
        }

        if (newRating === 0) {
            setSnackbarMessage('Please select a rating.');
            setOpenSnackbar(true);
            return;
        }

        setFeedbackError(false);

        if (newComment && newRating) {
            try {
                const feedbackToCreate = {
                    comment: newComment,
                    rating: newRating
                };
                if (currentFeedback) {
                    await FeedbackService.updateFeedbackByUserAndEvent(currentUser.userID, event.eventId, feedbackToCreate);
                    setSnackbarMessage('Feedback updated successfully!');
                } else {
                    const newFeedback = await FeedbackService.createFeedbackByUserAndEvent(currentUser.userID, event.eventId, feedbackToCreate);
                    setSnackbarMessage('Feedback submitted successfully!');
                    setCurrentFeedback(newFeedback);
                }
                const feedbacksResponse = await FeedbackService.getFeedbacksByEvent(eventId);
                const feedbacksWithProfilePictures = await Promise.all(feedbacksResponse.map(async feedback => {
                    if (feedback.user.profilePicture) {
                        const profilePictureUrl = await UserService.getProfilePicture(feedback.user.profilePicture);
                        return { ...feedback, user: { ...feedback.user, profilePictureUrl } };
                    }
                    return feedback;
                }));
                setFeedbacks(feedbacksWithProfilePictures);
                setOpenSnackbar(true);
            } catch (error) {
                if (error === 'Error creating feedback: You have already submitted a feedback for this event!') {
                    setSnackbarMessage("You have already submitted a feedback for this event!");
                    setOpenSnackbar(true);
                } else {
                    setSnackbarMessage(error);
                    setOpenSnackbar(true);
                }
            }
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const switchModal = () => {
        setOpenLoginModal(!openLoginModal);
        setOpenRegisterModal(!openRegisterModal);
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
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Box>
                                                <Typography sx={{ marginBottom: 1 }} variant="h5"><strong>Description</strong></Typography>
                                                <Typography variant="body1">{event.description}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', marginTop: 2 }}>
                                                <Typography component="span" variant="h5" sx={{ paddingRight: "10px" }}>
                                                    <strong>Status:</strong>
                                                </Typography>
                                                <Typography component="span" variant="body1" sx={getStatusStyles(event.eventStatus)}>
                                                    <span>{event.eventStatus.charAt(0).toUpperCase() + event.eventStatus.slice(1)}</span>
                                                </Typography>
                                            </Box>
                                            <Box sx={{ marginTop: 2.5, paddingRight: "50px" }}>
                                                <Typography sx={{ marginBottom: 1 }} variant="h5"><strong>Tickets</strong></Typography>
                                                {tickets.length > 0 ? (
                                                    <Grid container spacing={1}>
                                                        {tickets.map(ticket => (
                                                            <Grid item xs={12} key={ticket.ticketId}>
                                                                <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                                                                    <Grid container justifyContent="space-between" alignItems="center">
                                                                        <Box>
                                                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#C63f47' }}>{ticket.name}</Typography>
                                                                            <Typography variant="body2" sx={{ color: '#777' }}>{ticket.description}</Typography>
                                                                        </Box>
                                                                        <Box sx={{ textAlign: 'right' }}>
                                                                            {ticket.isAvailable ? (
                                                                                <>
                                                                                    <Typography variant="body1" sx={{ color: '#555' }}>Price: ₱{ticket.price.toFixed(2)}</Typography>
                                                                                    <Typography variant="body2" sx={{ color: '#777' }}>Quantity: {ticket.quantity}</Typography>
                                                                                    <Typography variant="body2" sx={{ color: '#777' }}>Available: {ticket.remainingQuantity}</Typography>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Typography variant="body2" sx={{ color: '#777' }}>Unavailable</Typography>
                                                                                </>
                                                                            )}
                                                                        </Box>
                                                                    </Grid>
                                                                </Box>
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                ) : (
                                                    <Typography variant="body1">No tickets added</Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box>
                                                <Box>
                                                    <img
                                                        src={event.coverPhotoUrl || "/assets/placeholders/1280x720-image-placeholder.png"}
                                                        alt="Event"
                                                        style={{width: "100%", height: "425px", objectFit: "cover"}}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Button variant="contained" color="primary" fullWidth
                                                            sx={{marginTop: 2, backgroundColor: "#C63f47", borderRadius: 0}}
                                                            onClick={handleBookTicketClick}>
                                                        Book Ticket
                                                    </Button>
                                                </Box>
                                            </Box>
                                            {organizer && (
                                                <Box sx={{marginTop: 5, backgroundColor: '#fff'}}>
                                                    <Typography variant="h5" sx={{
                                                        marginBottom: 2,
                                                        fontWeight: 'bold',
                                                        color: '#C63f47'
                                                    }}>Organizer</Typography>
                                                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                                        <Typography
                                                            variant="body1"><strong>Name:</strong> {organizer.user.firstName} {organizer.user.lastName}
                                                        </Typography>
                                                        <Typography
                                                            variant="body1"><strong>Email:</strong> {organizer.user.email}
                                                        </Typography>
                                                        <Typography variant="body1"><strong>Contact
                                                            #:</strong> {organizer.user.phoneNumber}</Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Grid>
                                    </Grid>
                                )}
                                {tabValue === 1 && event && (
                                    <Grid container spacing={2} sx={{ height: "71vh" }}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 2, height: "100%", backgroundColor: '#f3f3f3', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#C63f47' }}>Event Schedule</Typography>
                                                <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>
                                                    <strong>Start Date and Time:</strong> {format(new Date(event.startDatetime), 'MMMM d, yyyy h:mm a')}
                                                </Typography>
                                                <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>
                                                    <strong>End Date and Time:</strong> {format(new Date(event.endDatetime), 'MMMM d, yyyy h:mm a')}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                src="/assets/images/extras/extra-people-dance-6.png"
                                                alt="Schedule"
                                                style={{ width: "75%", objectFit: "cover" }}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                                {tabValue === 2 && event && (
                                    <Grid container spacing={2} sx={{ height: "71vh", padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
                                        <Grid item xs={12} md={6}>
                                            {event.venue ? (
                                                <Box sx={{ padding: 3, backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: 2 }}>
                                                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C63f47', marginBottom: 2 }}>Venue Details</Typography>
                                                    <Typography variant="body1" sx={{ marginBottom: 1 }}><strong>Name:</strong> {event.venue.name}</Typography>
                                                    <Typography variant="body1" sx={{ marginBottom: 1 }}><strong>Description:</strong> {event.venue.description}</Typography>
                                                    <Typography variant="body1" sx={{ marginBottom: 1 }}><strong>Address:</strong> {event.venue.address}</Typography>
                                                </Box>
                                            ) : (
                                                <Typography variant="body1" sx={{ color: 'gray' }}>No venue assigned</Typography>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6}
                                              sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <img
                                                src="/assets/images/extras/extra-people-dance-7.png"
                                                alt="Venue"
                                                style={{ width: "75%", objectFit: "cover" }}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                                {tabValue === 3 && event && (
                                    <Grid container spacing={2} sx={{ height: "100%" }}>
                                        <Grid item xs={12} md={6}>
                                            <Box>
                                                <Typography variant="h6" sx={{ marginBottom: 1 }}>Feedbacks</Typography>
                                            </Box>
                                            <List sx={{ height: '350px', bgcolor: 'background.paper', padding: '20px', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#F3F3F3', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                {currentFeedbacks.length === 0 ? (
                                                    <Typography variant="body1" sx={{ color: "darkgray", textAlign: 'center', marginTop: 2 }}>No feedbacks added...</Typography>
                                                ) : (
                                                    currentFeedbacks.map((feedback, index) => (
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
                                                            {index < currentFeedbacks.length - 1 && <Divider variant="inset" component="li" />}
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
                                            {currentUser && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                                            {currentFeedback ? 'Your Current Feedback' : 'Add A Feedback' }
                                                        </Typography>
                                                        {currentFeedback ? (
                                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFeedback(currentFeedback)}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        ) : (<></>)}
                                                    </Box>
                                                    <TextField
                                                        label="Feedback"
                                                        multiline
                                                        rows={2}
                                                        variant="outlined"
                                                        fullWidth
                                                        value={newComment}
                                                        onChange={(e) => setNewComment(e.target.value)}
                                                        error={feedbackError}
                                                        sx={{ mb: 2 }}
                                                    />
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Rating
                                                            name="new-rating"
                                                            value={newRating}
                                                            onChange={(event, newValue) => setNewRating(newValue)}
                                                            size="large"
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleSubmitFeedback}
                                                            sx={{ backgroundColor: '#C63F47' }}
                                                        >
                                                            {currentFeedback ? 'Update' : 'Submit'}
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            )}
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
                                                <Box sx={{ textAlign: 'center', mb: 2, mt: 3 }}>
                                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 8 }}>
                                                        Ratings and reviews are verified and are from people who use this website.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />

                <ConfirmDialog
                    openDialog={openConfirmDialog}
                    setOpenDialog={setOpenConfirmDialog}
                    onClose={confirmDeleteFeedback}
                    message="Are you sure you want to delete this feedback?"
                    title="Delete Feedback"
                />

                <ConfirmDialog
                    openDialog={openConfirmLoginDialog}
                    setOpenDialog={setOpenConfirmLoginDialog}
                    onClose={handleConfirmLoginDialogClose}
                    message={"You need to login first before proceeding to book tickets. Login now?"}
                    title={"Login Required"}
                />

                <LoginModal open={openLoginModal} onClose={() => setOpenLoginModal(false)} switchModal={() => { setOpenLoginModal(false); setOpenRegisterModal(true); }} />
                <RegisterModal open={openRegisterModal} onClose={() => setOpenRegisterModal(false)} switchModal={() => { setOpenRegisterModal(false); setOpenLoginModal(true); }} label={"Register"} />

                <BookTicketModal
                    open={openBookTicketModal}
                    onClose={handleCloseBookTicketModal}
                    eventId={event?.eventId}
                    onUpdateTicketQuantity={handleUpdateTicketQuantity}
                />

            </Box>

        </div>
    );
}

export default UserViewEvent;