import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Grid, Select, MenuItem, IconButton } from '@mui/material';
import { Add, Remove, Close, LocationOn, Event } from '@mui/icons-material';
import EventService from '../../services/EventService';
import TicketService from '../../services/TicketService';
import BookingService from '../../services/BookingService'; // Import BookingService
import { format, isValid } from 'date-fns';
import { getAuth } from "../../utils/AuthContext.jsx";
import CustomSnackbar from "../CustomSnackbar.jsx";
import ConfirmDialog from "../ConfirmDialog.jsx"; // Import ConfirmDialog

const BookTicketModal = ({ open, onClose, eventId, onUpdateTicketQuantity }) => {
    const { currentUser } = getAuth();

    const [quantity, setQuantity] = useState(2);
    const [eventDetails, setEventDetails] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState('');
    const [price, setPrice] = useState(0);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // State for ConfirmDialog
    const totalPrice = (price * quantity).toFixed(2);

    useEffect(() => {
        if (open && eventId) {
            EventService.getEvent(eventId)
                .then(response => setEventDetails(response.data))
                .catch(error => console.error('Error fetching event details:', error));

            TicketService.getTicketsByEventId(eventId)
                .then(async (response) => {
                    const ticketsWithRemainingQuantity = await Promise.all(response.map(async (ticket) => {
                        const remainingQuantityResponse = await TicketService.getRemainingTicketQuantity(ticket.ticketId);
                        return { ...ticket, remainingQuantity: remainingQuantityResponse.remainingQuantity };
                    }));
                    setTickets(ticketsWithRemainingQuantity);

                    if (ticketsWithRemainingQuantity.length > 0) {
                        const firstTicket = ticketsWithRemainingQuantity[0];
                        setSelectedTicket(firstTicket.ticketId);
                        setPrice(firstTicket.price);
                        setAvailableQuantity(firstTicket.remainingQuantity);
                        setQuantity(1);
                    } else {
                        setSelectedTicket('None');
                        setPrice(0);
                        setAvailableQuantity(0);
                        setQuantity(0);
                    }
                })
                .catch(error => console.error('Error fetching tickets:', error));
        }
    }, [open, eventId]);

    const handleIncrease = () => {
        if (quantity < availableQuantity) {
            setQuantity((prev) => prev + 1);
        } else {
            setSnackbarMessage('No available tickets left');
            setSnackbarOpen(true);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleTicketChange = (event) => {
        const selectedTicketId = event.target.value;
        if (selectedTicketId === 'None') {
            setSelectedTicket('None');
            setPrice(0);
            setAvailableQuantity(0);
            setQuantity(0);
        } else {
            const ticket = tickets.find(ticket => ticket.ticketId === selectedTicketId);
            setSelectedTicket(selectedTicketId);
            setPrice(ticket ? ticket.price : 0);
            setAvailableQuantity(ticket ? ticket.remainingQuantity : 0);
            setQuantity(1);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleBookTickets = async () => {
        setConfirmDialogOpen(true); // Open the confirm dialog
    };

    const handleConfirmBooking = async (confirm) => {
        setConfirmDialogOpen(false);
        if (confirm) {
            const bookingData = {
                ticketQuantity: quantity,
                totalPrice: totalPrice
            };

            try {
                await BookingService.createBookingByUserAndTicket(currentUser.userID, selectedTicket, bookingData);
                setSnackbarMessage('Successfully booked!');
                setSnackbarOpen(true);
                onClose();

                onUpdateTicketQuantity(selectedTicket, availableQuantity - quantity);
            } catch (error) {
                console.error('Error creating booking:', error);
                setSnackbarMessage(`Error: ${error.message || error}`);
                setSnackbarOpen(true);
            }
        }
    };

    return (
        <div>
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 750,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 5,
                        p: 4,
                    }}
                >
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="h6">Book Tickets</Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Grid>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <img
                                src={eventDetails?.image || "/assets/placeholders/1280x720-image-placeholder.png"}
                                alt="Event"
                                style={{ width: "100%", height: "auto", objectFit: "cover" }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
                                {eventDetails?.name || 'Event Name'}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocationOn sx={{ mr: 1 }} /> {eventDetails?.venue.name || 'Venue'}
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Event sx={{ mr: 1 }} /> {isValid(new Date(eventDetails?.endDatetime)) ? format(new Date(eventDetails.endDatetime), 'MMMM d, yyyy h:mm a') : 'Invalid Date'}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        spacing={2}
                        sx={{ borderTop: 1, borderBottom: 1, borderColor: 'grey.300', py: 2 }}
                    >
                        <Grid item xs={2}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>Ticket Type</Typography>
                            <Box sx={{ height: "50px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Select
                                    value={selectedTicket}
                                    onChange={handleTicketChange}
                                    sx={{
                                        width: "125px",
                                        '& .MuiOutlinedInput-root': {
                                            padding: 0,
                                            margin: 0,
                                        },
                                        '& .MuiSelect-select': {
                                            padding: 0,
                                            margin: 0,
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none',
                                        },
                                    }}
                                >
                                    {tickets.length > 0 ? (
                                        tickets.map(ticket => (
                                            ticket.isAvailable ? (
                                                <MenuItem key={ticket.ticketId} value={ticket.ticketId}>
                                                    {ticket.name}
                                                </MenuItem>
                                            ) : null
                                        ))
                                    ) : (
                                        <MenuItem value="None">None</MenuItem>
                                    )}
                                </Select>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>Price</Typography>
                            <Box sx={{ height: "50px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography sx={{ textAlign: 'center' }}>₱ {price.toFixed(2)}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>Available</Typography>
                            <Box sx={{ height: "50px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography sx={{ textAlign: 'center' }}>{availableQuantity}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>Quantity</Typography>
                            <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: "50px" }}>
                                <IconButton onClick={handleDecrease}>
                                    <Remove />
                                </IconButton>
                                <Typography>{quantity}</Typography>
                                <IconButton onClick={handleIncrease}>
                                    <Add />
                                </IconButton>
                            </Box>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>Total Price</Typography>
                            <Box sx={{ height: "50px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography sx={{ textAlign: 'center' }}>₱ {totalPrice}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        sx={{ mt: 3 }}
                        onClick={handleBookTickets}
                    >
                        SUBMIT BOOKING
                    </Button>
                </Box>
            </Modal>
            <CustomSnackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
            <ConfirmDialog
                openDialog={confirmDialogOpen}
                setOpenDialog={setConfirmDialogOpen}
                onClose={handleConfirmBooking}
                message="Are you sure you want to book these tickets?"
                title="Confirm Booking"
            />
        </div>
    );
};

export default BookTicketModal;