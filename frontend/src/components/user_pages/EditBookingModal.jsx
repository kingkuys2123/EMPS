import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Grid, IconButton } from '@mui/material';
import { Add, Remove, Close, LocationOn, Event } from '@mui/icons-material';
import BookingService from '../../services/BookingService';
import TicketService from '../../services/TicketService';
import CustomSnackbar from "../CustomSnackbar.jsx";
import ConfirmDialog from "../ConfirmDialog.jsx";
import { format } from 'date-fns';
import PaymentMethodService from "../../services/PaymentMethodService.jsx";
import { useNavigate } from 'react-router-dom';

import { getAuth } from "../../utils/AuthContext.jsx";

const EditBookingModal = ({ open, onClose, bookingId, onUpdateBooking }) => {
    const { currentUser, setCurrentUser } = getAuth();
    const nav = useNavigate();

    const [bookingDetails, setBookingDetails] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [remainingQuantity, setRemainingQuantity] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmUpdateBookingDialogOpen, setConfirmUpdateBookingDialogOpen] = useState(false);
    const [confirmPayBookingDialogOpen, setConfirmPayBookingDialogOpen] = useState(false);
    const [confirmPayBookingDialogMessage, setConfirmPayBookingDialogMessage] = useState('');
    const [confirmCancelBookingDialogOpen, setConfirmCancelBookingDialogOpen] = useState(false);
    const [confirmCancelBookingDialogMessage, setConfirmCancelBookingDialogMessage] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(null);

    useEffect(() => {
        if (open && bookingId) {
            BookingService.getBookingById(bookingId)
                .then(response => {
                    setBookingDetails(response);
                    setQuantity(response.ticketQuantity);
                    setPrice(response.ticket.price);
                    return TicketService.getRemainingTicketQuantity(response.ticket.ticketId);
                })
                .then(response => {
                    setRemainingQuantity(response.remainingQuantity);
                })
                .catch(error => console.error('Error fetching booking details:', error));
        }
    }, [open, bookingId]);

    const handleIncrease = () => {
        if (quantity < remainingQuantity) {
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

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleUpdateBooking = async () => {
        if (quantity === bookingDetails.ticketQuantity && (price * quantity).toFixed(2) === bookingDetails.totalPrice) {
            onClose();
        } else {
            setConfirmUpdateBookingDialogOpen(true);
        }
    };

    const handleCancelBooking = async () => {
        setConfirmCancelBookingDialogMessage("Are you sure you want to cancel this booking?");
        setConfirmCancelBookingDialogOpen(true);
    };

    const handleConfirmUpdate = async (confirm) => {
        setConfirmUpdateBookingDialogOpen(false);
        if (confirm) {
            const updatedData = {
                status: bookingDetails.status,
                dateTimeBooked: bookingDetails.dateTimeBooked,
                isDeleted: bookingDetails.isDeleted,
                isPaid: bookingDetails.isPaid,
                ticketQuantity: quantity,
                totalPrice: (price * quantity).toFixed(2)
            };

            try {
                await BookingService.updateBooking(bookingId, updatedData);
                setSnackbarMessage('Successfully updated booking!');
                setSnackbarOpen(true);
                onClose();
                onUpdateBooking();
            } catch (error) {
                console.error('Error updating booking:', error);
                setSnackbarMessage(`Error: ${error.message || error}`);
                setSnackbarOpen(true);
            }
        }
    };

    const handlePayBooking = async () => {
        const fetchPaymentMethod = async () => {
            try {
                const data = await PaymentMethodService.getUserPaymentMethod(currentUser.userID);
                if (!data) {
                    setConfirmPayBookingDialogMessage("You have no Payment Method set up yet, wanna set up your payment methods?");
                    setConfirmPayBookingDialogOpen(true);
                } else {
                    setPaymentMethod(data);
                    setConfirmPayBookingDialogMessage("Do you want to proceed with the payment?");
                    setConfirmPayBookingDialogOpen(true);
                }
            } catch (error) {
                console.error("Error fetching payment method:", error);
                setSnackbarMessage(`Error: ${error.message || error}`);
                setSnackbarOpen(true);
            }
        };

        await fetchPaymentMethod();
    };

    const handleConfirmPayBooking = async (confirm) => {
        setConfirmPayBookingDialogOpen(false);
        if (confirm) {
            if (!paymentMethod) {
                nav('/billing');
            } else {
                try {
                    await BookingService.payBooking(bookingId);
                    setSnackbarMessage("Paid successfully");
                    setSnackbarOpen(true);
                    onClose();
                } catch (error) {
                    setSnackbarMessage(`Error: ${error.message || error}`);
                    setSnackbarOpen(true);
                }
            }
        }
    };

    const handleConfirmCancelBooking = async (confirm) => {
        setConfirmCancelBookingDialogOpen(false);
        if (confirm) {
            try {
                await BookingService.deleteBooking(bookingId);
                setSnackbarMessage('Successfully cancelled booking');
                setSnackbarOpen(true);
                onClose();
                onUpdateBooking();
            } catch (error) {
                console.error('Error cancelling booking:', error);
                setSnackbarMessage(`Error: ${error.message || error}`);
                setSnackbarOpen(true);
            }
        }
    };

    const shouldHideButtons = bookingDetails?.status.toLowerCase() === 'paid' ||
        bookingDetails?.ticket.event.eventStatus.toLowerCase() === 'cancelled' ||
        bookingDetails?.ticket.event.eventStatus.toLowerCase() === 'completed' ||
        bookingDetails?.isDeleted === 1;

    const isDeleted = bookingDetails?.isDeleted === 1;

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
                        <Typography variant="h6">Edit Booking</Typography>
                        <IconButton onClick={onClose}>
                            <Close />
                        </IconButton>
                    </Grid>

                    {bookingDetails && (
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={12} md={6}>
                                <img
                                    src={bookingDetails.ticket.event.image || "/assets/placeholders/1280x720-image-placeholder.png"}
                                    alt="Event"
                                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                        <Box>
                                            <Typography variant="h6" color="textPrimary" sx={{ mb: 1 }}>
                                                {bookingDetails.ticket.event.name || 'Event Name'}
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <LocationOn sx={{ mr: 1 }} /> {bookingDetails.ticket.event.venue.name || 'Venue'}
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Event sx={{ mr: 1 }} /> {format(new Date(bookingDetails.ticket.event.startDateTime), 'MMMM d, yyyy h:mm a')}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 0.5 }}>
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    color: '#fff',
                                                    backgroundColor:
                                                        bookingDetails.status && bookingDetails.status.toLowerCase() === 'paid' ? '#008000' :
                                                            '#777',
                                                    marginRight: '8px'
                                                }}
                                            >
                                                {bookingDetails?.isDeleted === 1 ? 'Cancelled' : bookingDetails.status && bookingDetails.status.toLowerCase() === 'pending' ? 'Pending Payment' : bookingDetails.status.toLowerCase() === 'paid' ? 'Paid' : bookingDetails.status}                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    color: '#fff',
                                                    backgroundColor:
                                                        bookingDetails.ticket.event.eventStatus && bookingDetails.ticket.event.eventStatus.toLowerCase() === 'ongoing' ? '#FFA500' :
                                                            bookingDetails.ticket.event.eventStatus.toLowerCase() === 'cancelled' ? '#FF0000' :
                                                                bookingDetails.ticket.event.eventStatus.toLowerCase() === 'completed' ? '#0000FF' :
                                                                    bookingDetails.ticket.event.eventStatus.toLowerCase() === 'upcoming' ? '#008000' :
                                                                        '#777',
                                                    marginRight: '8px'
                                                }}
                                            >
                                                {bookingDetails.ticket.event.eventStatus && bookingDetails.ticket.event.eventStatus.toLowerCase() === 'ongoing' ? 'Ongoing' :
                                                    bookingDetails.ticket.event.eventStatus.toLowerCase() === 'cancelled' ? 'Cancelled' :
                                                        bookingDetails.ticket.event.eventStatus.toLowerCase() === 'completed' ? 'Completed' :
                                                            bookingDetails.ticket.event.eventStatus.toLowerCase() === 'upcoming' ? 'Upcoming' :
                                                                bookingDetails.ticket.event.eventStatus}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    <Grid
                        container
                        spacing={2}
                        sx={{ borderTop: 1, borderBottom: 1, borderColor: 'grey.300', py: 2 }}
                    >
                        <Grid item xs={2}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>Ticket Type</Typography>
                            <Box sx={{ height: "50px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography>{bookingDetails?.ticket.name}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>Price</Typography>
                            <Box sx={{ height: "50px", display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                <Typography sx={{ textAlign: 'center' }}>₱ {price.toFixed(2)}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>Available</Typography>
                            <Box sx={{ height: "50px", display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                <Typography sx={{ textAlign: 'center' }}>{remainingQuantity}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>Quantity</Typography>
                            <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: "50px", flexGrow: 1 }}>
                                {bookingDetails && bookingDetails.status.toLowerCase() !== "paid" && bookingDetails.ticket.event.eventStatus.toLowerCase() !== "completed" && bookingDetails.status.toLowerCase() !== "cancelled"  ? (
                                    <>
                                        <IconButton onClick={handleDecrease}>
                                            <Remove />
                                        </IconButton>
                                        <Typography>{quantity}</Typography>
                                        <IconButton onClick={handleIncrease}>
                                            <Add />
                                        </IconButton>
                                    </>
                                ) : (
                                    <Typography>{quantity}</Typography>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>Total Price</Typography>
                            <Box sx={{ height: "50px", display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
                                <Typography sx={{ textAlign: 'center' }}>₱ {(price * quantity).toFixed(2)}</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {!shouldHideButtons && (
                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        onClick={handleCancelBooking}
                                    >
                                        CANCEL BOOKING
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        onClick={handleUpdateBooking}
                                    >
                                        UPDATE BOOKING
                                    </Button>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        onClick={handlePayBooking}
                                    >
                                        PAY BOOKING
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Box>
            </Modal>
            <CustomSnackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbarMessage}
            />
            <ConfirmDialog
                openDialog={confirmUpdateBookingDialogOpen}
                setOpenDialog={setConfirmUpdateBookingDialogOpen}
                onClose={handleConfirmUpdate}
                message="Are you sure you want to update this booking?"
                title="Confirm Update"
            />
            <ConfirmDialog
                openDialog={confirmPayBookingDialogOpen}
                setOpenDialog={setConfirmPayBookingDialogOpen}
                onClose={handleConfirmPayBooking}
                message={confirmPayBookingDialogMessage}
                title="Confirm Payment"
            />
            <ConfirmDialog
                openDialog={confirmCancelBookingDialogOpen}
                setOpenDialog={setConfirmCancelBookingDialogOpen}
                onClose={handleConfirmCancelBooking}
                message={confirmCancelBookingDialogMessage}
                title="Confirm Cancel"
            />
        </div>
    );
};

export default EditBookingModal;