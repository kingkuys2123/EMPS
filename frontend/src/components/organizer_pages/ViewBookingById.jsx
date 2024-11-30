import React, { useEffect, useState } from 'react';
import { getAuth } from '../../utils/AuthContext';
import BookingService from '../../services/BookingService';
import './styles/ViewBooking.css';

const ViewBookingById = () => {
    const { currentUser } = getAuth();
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const bookingId = 1; // Replace with the desired ID
                const data = await BookingService.getBookingById(bookingId);
                console.log("Fetched booking data:", data);

                // Map the response data to match the required fields
                const mappedBooking = {
                    id: data.bookingID,
                    name: data.user.firstName, // Assuming `firstName` exists in `user`
                    dateBooked: data.dateTimeBooked,
                    datePaid: data.dateTimePaid,
                    status: data.status,
                    quantity: data.ticketQuantity,
                };

                setBooking(mappedBooking);
            } catch (err) {
                console.error("Failed to fetch booking:", err);
                setError(err);
            }
        };

        fetchBooking();
    }, []);

    // Function to format date as "November 19, 2024"
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (error) {
        return <div className="error">Error: {error.message || error}</div>;
    }

    if (!booking) {
        return <div className="loading">Loading booking...</div>;
    }

    return (
        <div className="mainBookingDisplay">
            <div className="bookingLabels">
                <p className="bookingId">ID</p>
                <p className="bookingName">NAME</p>
                <p className="bookingDateBooked">DATE BOOKED</p>
                <p className="bookingDatePaid">DATE PAID</p>
                <p className="bookingStatus">STATUS</p>
                <p className="bookingQuantity">QUANTITY</p>
            </div>

            <div className="bookingDisplay" key={booking.id}>
                <p className="bookingId">{booking.id}</p>
                <p className="bookingName">{booking.name || "N/A"}</p>
                <p className="bookingDateBooked">{formatDate(booking.dateBooked)}</p>
                <p className="bookingDatePaid">{formatDate(booking.datePaid)}</p>
                <p className="bookingStatus">{booking.status}</p>
                <p className="bookingQuantity">{booking.quantity}</p>
            </div>
        </div>
    );
};

export default ViewBookingById;
