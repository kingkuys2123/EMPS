import { useState, useEffect } from "react";
import OrganizerSidebar from "./OrganizerSidebar.jsx";
import TemplateComponent from "../TemplateComponent.jsx";
import BookingService from "../../services/BookingService.jsx";
import { Button } from "@mui/material";

function OrganizerBookings() {
    const [rows, setRows] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [checker, checked] = useState(true);
    const columns = [
        { field: 'booking', headerName: 'Booking', minWidth: 80 },
        { field: 'customerName', headerName: 'Customer Name', minWidth: 200, display: "flex", flex: 1 },
        { field: 'event', headerName: 'Event', minWidth: 300, display: "flex", flex: 2 },
        { field: 'tickets', headerName: 'Tickets', minWidth: 80, type: 'number', align: 'left', headerAlign: 'left' },
        { field: 'totalPrice', headerName: 'Total Price', minWidth: 120, type: 'number', align: 'left', headerAlign: 'left', display: "flex", flex: 1 },
        { field: 'date', headerName: 'Date', minWidth: 120, type: 'date', display: "flex", flex: 1 },
        { field: 'status', headerName: 'Status', minWidth: 120, display: "flex", flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            display: "flex",
            flex: 1,
            renderCell: (params) => {
                // Display buttons only for "Pending" bookings
                if (params.row.status === "Pending") {
                    return (
                        <>
                            <Button
                                onClick={() => handleAcceptClick(params)}
                                variant="contained"
                                color="success"
                                size="small"
                            >
                                Accept
                            </Button>
                            <Button
                                onClick={() => handleDeleteClick(params)}
                                variant="contained"
                                color="error"
                                size="small"
                                style={{ marginLeft: 8 }}
                            >
                                Delete
                            </Button>
                        </>
                    );
                }
                return <></>; // Return nothing for other statuses
            },
        },
    ];

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                let bookings;
                if (activeTab === "All") {
                    bookings = await BookingService.getAllBookings();
                } else if (activeTab === "Confirmed") {
                    bookings = await BookingService.getConfirmedBookings();
                } else if (activeTab === "Pending") {
                    bookings = await BookingService.getPendingBookings();
                } else {
                    bookings = [];
                }
                setRows(bookings);
            } catch (error) {
                console.error("Error loading bookings:", error);
            }
        };
        fetchBookings();
    }, [activeTab, checker]);

    const handleAcceptClick = async (data) => {
        console.log("rowStatus is: ", data.row.status);
    
        try {
            // Step 1: Update booking quantity
            const updatedBooking = await BookingService.updateTicketQuantity(data.row.booking);
            console.log("Booking quantity updated successfully:", updatedBooking);
    
            // Step 2: Update booking status
            const statusUpdatedBooking = await BookingService.updateBookingStatus(data.row.booking);
            console.log("Booking status updated to Confirmed:", statusUpdatedBooking);

            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.booking === data.row.booking
                        ? { ...row, status: "Confirmed" }
                        : row
                )
            );
        } catch (error) {
            console.error("Error accepting booking:", error);
        }
    };
    

    const handleDeleteClick = async (data) => {
         try{
            const deleteRow = await BookingService.deleteBooking(data.row.booking);
            checked((prevChecker) => !prevChecker);
        } catch (error) {
            console.error("Error deleting booking: ", error);
        }
    };

    return (
        <TemplateComponent
            SidebarComponent={OrganizerSidebar}
            title="Bookings"
            tabs={["All", "Confirmed", "Pending"]}
            fetchRows={rows}
            columns={columns}
            onEditClick={handleAcceptClick}
            onDeleteClick={handleDeleteClick}
            setActiveTab={setActiveTab}
        />
    );
}

export default OrganizerBookings;
