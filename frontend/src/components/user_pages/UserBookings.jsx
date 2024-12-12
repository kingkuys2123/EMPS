import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography, Button, Grid, IconButton } from "@mui/material";
import BookingService from '../../services/BookingService.jsx';
import UserSidebar from "./UserSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import CustomSnackbar from "../CustomSnackbar.jsx";
import EditBookingModal from "./EditBookingModal.jsx"; // Import EditBookingModal
import { getAuth } from "../../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import '../styles/FontStyle.css';

function UserBookings() {
    const nav = useNavigate();
    const { currentUser, toggleOrganizer } = getAuth();

    const [bookings, setBookings] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 8;

    const [editModalOpen, setEditModalOpen] = useState(false); // State for EditBookingModal
    const [selectedBookingId, setSelectedBookingId] = useState(null); // State for selected booking ID

    useEffect(() => {
        if (!currentUser) {
            nav('/');
        } else if (currentUser.accountType === "admin") {
            nav('/admin/dashboard');
        } else if (currentUser.accountType === "organizer") {
            if(toggleOrganizer) {
                nav('/organizer/dashboard');
            }
            fetchUserBookings();
        } else {
            fetchUserBookings();
        }
    }, [currentUser]);

    const fetchUserBookings = async () => {
        try {
            const userBookings = await BookingService.getAllUserBookings(currentUser.userID);
            const uniqueBookings = userBookings.filter((booking, index, self) =>
                index === self.findIndex((b) => b.bookingID === booking.bookingID)
            );
            setBookings(uniqueBookings);
        } catch (error) {
            console.error("Error fetching user bookings:", error);
            setSnackbarMessage("Failed to load bookings.");
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setCurrentPage(1); // Reset to first page when tab changes
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleEditBooking = (bookingId) => {
        setSelectedBookingId(bookingId);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedBookingId(null);
        fetchUserBookings(); // Refresh bookings after editing
    };

    const filterBookings = (status) => {
        switch (status) {
            case "upcoming":
                return bookings.filter(booking => booking.isDeleted !== 1 && booking.ticket.event.eventStatus && booking.ticket.event.eventStatus.toLowerCase() === "upcoming");
            case "ongoing":
                return bookings.filter(booking => booking.isDeleted !== 1 && booking.ticket.event.eventStatus && booking.ticket.event.eventStatus.toLowerCase() === "ongoing");
            case "past":
                return bookings.filter(booking => booking.isDeleted !== 1 && booking.ticket.event.eventStatus && booking.ticket.event.eventStatus.toLowerCase() === "completed");
            case "pending":
                return bookings.filter(booking => booking.isDeleted !== 1 && booking.status && booking.status.toLowerCase() === "pending");
            case "cancelled":
                return bookings.filter(booking => (booking.ticket.event.eventStatus && booking.ticket.event.eventStatus.toLowerCase() === "cancelled") || booking.isDeleted === 1);
            case "paid":
                return bookings.filter(booking => booking.isDeleted !== 1 && booking.status && booking.status.toLowerCase() === "paid");
            default:
                return bookings;
        }
    };

    const renderBookings = (filteredBookings) => {
        const indexOfLastBooking = currentPage * bookingsPerPage;
        const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
        const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

        return (
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        {currentBookings.map(booking => (
                            <Grid item xs={12} md={6} key={booking.bookingID}>
                                <Box sx={{ padding: 3, border: '1px solid #ddd', borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid item xs={12} md={5}>
                                            <Typography variant="body2" sx={{ color: '#777', marginBottom: 0.5 }}>
                                                {format(new Date(booking.ticket.event.startDatetime), 'PPPpp')}
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#C63f47' }}>
                                                {booking.ticket.event.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 0.5 }}>
                                                <Box
                                                    sx={{
                                                        display: 'inline-block',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        color: '#fff',
                                                        backgroundColor:
                                                            booking.ticket.event.eventStatus && booking.ticket.event.eventStatus.toLowerCase() === 'ongoing' ? '#FFA500' :
                                                                booking.ticket.event.eventStatus.toLowerCase() === 'cancelled' ? '#FF0000' :
                                                                    booking.ticket.event.eventStatus.toLowerCase() === 'completed' ? '#0000FF' :
                                                                        booking.ticket.event.eventStatus.toLowerCase() === 'upcoming' ? '#008000' :
                                                                            '#777',
                                                        marginRight: '8px'
                                                    }}
                                                >
                                                    {booking.ticket.event.eventStatus && booking.ticket.event.eventStatus.toLowerCase() === 'ongoing' ? 'Ongoing' :
                                                        booking.ticket.event.eventStatus.toLowerCase() === 'cancelled' ? 'Cancelled' :
                                                            booking.ticket.event.eventStatus.toLowerCase() === 'completed' ? 'Completed' :
                                                                booking.ticket.event.eventStatus.toLowerCase() === 'upcoming' ? 'Upcoming' :
                                                                    booking.ticket.event.eventStatus}
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'inline-block',
                                                        padding: '2px 8px',
                                                        borderRadius: '4px',
                                                        color: '#fff',
                                                        backgroundColor:
                                                            booking.status && booking.status.toLowerCase() === 'paid' ? '#008000' :
                                                                '#777',
                                                        marginRight: '8px'
                                                    }}
                                                >
                                                    {booking.isDeleted === 1 ? 'Cancelled' : booking.status && booking.status.toLowerCase() === 'pending' ? 'Pending Payment' : booking.status.toLowerCase() === 'paid' ? 'Paid' : booking.status}
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                            <Typography variant="body2" sx={{ color: '#777' }}>
                                                Ticket: {booking.ticket.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#777' }}>Quantity: {booking.ticketQuantity}</Typography>
                                            <Typography variant="body2" sx={{ color: '#777', marginBottom: 0.5 }}>Total Price: {booking.totalPrice}</Typography>
                                            <Typography variant="body2" sx={{ color: '#777', marginBottom: 0.5 }}>
                                                Booked on {format(new Date(booking.dateTimeBooked), 'MMM 1, yyyy | p')}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <IconButton color="primary" onClick={() => handleEditBooking(booking.bookingID)}>
                                                <KeyboardArrowRightIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", padding: "20px", marginTop: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        sx={{ marginRight: "10px", backgroundColor: "#C63f47", borderRadius: 0 }}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={indexOfLastBooking >= filteredBookings.length}
                        sx={{ backgroundColor: "#C63f47", borderRadius: 0 }}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        );
    };

    return (
        <div className="bookings-page">
            <Box sx={{ display: "flex", height: "100vh" }}>
                <UserSidebar />
                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", display: "flex", flexDirection: "column" }}>
                    <CustomAppBar title={"Bookings"} />
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3", display: "flex", flexDirection: "column" }}>
                        <Box sx={{ backgroundColor: "#FFFFFF", flexGrow: 1, boxShadow: "5px 5px 5px #aaaaaa", position: "relative", overflow: "auto", display: "flex", flexDirection: "column" }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="booking tabs">
                                <Tab label="All" />
                                <Tab label="Pending" />
                                <Tab label="Paid" />
                                <Tab label="Upcoming" />
                                <Tab label="Ongoing" />
                                <Tab label="Past" />
                                <Tab label="Cancelled" />
                            </Tabs>
                            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                <Box sx={{ padding: "50px", flexGrow: 1 }}>
                                    {tabValue === 0 && renderBookings(bookings)}
                                    {tabValue === 1 && renderBookings(filterBookings("pending"))}
                                    {tabValue === 2 && renderBookings(filterBookings("paid"))}
                                    {tabValue === 3 && renderBookings(filterBookings("upcoming"))}
                                    {tabValue === 4 && renderBookings(filterBookings("ongoing"))}
                                    {tabValue === 5 && renderBookings(filterBookings("past"))}
                                    {tabValue === 6 && renderBookings(filterBookings("cancelled"))}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />
            </Box>
            <EditBookingModal
                open={editModalOpen}
                onClose={handleCloseEditModal}
                bookingId={selectedBookingId}
                onUpdateBooking={fetchUserBookings}
            />
        </div>
    );
}

export default UserBookings;