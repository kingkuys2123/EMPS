import React, {useEffect, useState} from "react";
import {Button, Box} from "@mui/material";
import BookingService from '../services/BookingService.jsx';
import UserSideBar from "./UserSideBar.jsx";
import PageAppBar from "./PageAppBar.jsx";
import CustomSnackbar from "./CustomSnackbar.jsx";

function BookingsPage() {
    const [bookings, setBookings] = useState([]);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const data = await BookingService.getAllBookings(token);
                setBookings(data);
            } catch (error) {
                console.error("Failed to fetch bookings.", error);
            }
        };
        fetchData();
    }, []);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    }

    const handleDeleteBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem('token');
            await BookingService.deleteBooking(bookingId, token);

            setBookings((prevBookings) =>
                prevBookings.filter((booking) => booking.bookingID !== bookingId)
            );

            setSnackbarMessage(`Booking has been deleted successfully.`);
            setOpenSnackbar(true);

        } catch (e) {
            setSnackbarMessage("Failed to delete booking.", e);
            setOpenSnackbar(true);
        }
    };

    const handleAddBooking = async () => {

    };

    const handleEditBooking = async (bookingId) => {

    };

    return (
        <div className="home">
            <Box sx={{ display: "flex" }}>

                <UserSideBar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    <PageAppBar title={"Bookings"} />

                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Box sx={{ backgroundColor: "#FFFFFF", width: "100%", height: "100%", boxShadow: "5px 5px 5px #aaaaaa", position: "relative", overflowY: "auto" }}>
                            <Box sx={{ padding: "50px" }}>
                                <ul style={{ listStyleType: "none", padding: 0 }}>
                                    {bookings.map((booking) => (
                                        <li key={booking.bookingID} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", border: "1px solid #CFCFC4", borderRadius: "8px", padding: "10px" }}>
                                            <div>
                                                <Box sx={{ marginBottom: '8px' }}>
                                                    {`Booking ID: ${booking.bookingID}`}
                                                </Box>
                                                <Box sx={{ marginBottom: '8px' }}>
                                                    {`Date Booked: ${new Date(booking.dateTimeBooked).toLocaleString()}`}
                                                </Box>
                                                <Box sx={{ marginBottom: '8px' }}>
                                                    {`Ticket Quantity: ${booking.ticketQuantity}`}
                                                </Box>
                                                <Box sx={{ marginBottom: '8px' }}>
                                                    {`Total Price: $${booking.totalPrice}`}
                                                </Box>
                                                <Box sx={{ marginBottom: '8px' }}>
                                                    {`Payment Status: ${booking.isPaid ? "Paid" : "Not Paid"}`}
                                                </Box>
                                            </div>
                                            <Box>
                                                <Button variant="contained" onClick={() => handleEditBooking(booking.bookingID)} sx={{ borderRadius: '0', backgroundColor: "#C63f47", color: 'white' }}>
                                                    Edit
                                                </Button>
                                                <Button variant="contained" onClick={() => handleDeleteBooking(booking.bookingID)} sx={{ borderRadius: '0', backgroundColor: "#CFCFC4", color: 'white' }}>
                                                    Delete
                                                </Button>
                                            </Box>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                            <Button variant="contained" onClick={handleAddBooking} sx={{ width: "250px", position: "absolute", bottom: "50px", right: "50px", backgroundColor: "#C63f47", borderRadius: "0" }}>
                                <span>Add Booking</span>
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar}/>
            </Box>
        </div>
    );
}

export default BookingsPage;
