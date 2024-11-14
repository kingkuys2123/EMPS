import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Link } from "@mui/material";
import OrganizerSidebar from "./OrganizerSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import FilterListIcon from '@mui/icons-material/FilterList';
import "../styles/FontStyle.css";
import BookingTable from "./BookingTable.jsx";
import BookingService from "../../services/BookingService.jsx";

function OrganizerBookings() {
    const [activeTab, setActiveTab] = useState("All");
    const [rows, setRows] = useState([]); // State to store bookings data

    // Define the columns for the DataGrid
    const columns = [
        { field: 'booking', headerName: 'Booking', width: 150 },
        { field: 'customerName', headerName: 'Customer Name', width: 200 },
        { field: 'event', headerName: 'Event', width: 200 },
        { field: 'tickets', headerName: 'Tickets', width: 120, type: 'number', align: 'left', headerAlign: 'left' },
        { field: 'totalPrice', headerName: 'Total Price', width: 150, type: 'number', align: 'left', headerAlign: 'left' },
        { field: 'date', headerName: 'Date', width: 180, type: 'date' },
        { field: 'status', headerName: 'Status', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button 
                        onClick={() => handleEditClick(params)} 
                        variant="contained"
                        color="primary"
                        size="small"
                    >
                        Edit
                    </Button>
                    <Button 
                        onClick={() => handleDeleteClick(params.row.id)} 
                        variant="contained"
                        color="secondary"
                        size="small"
                        style={{ marginLeft: 8 }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    // Fetch bookings data when the component mounts
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookings = await BookingService.getAllBookings();
                setRows(bookings); // Set the fetched data to rows
            } catch (error) {
                console.error("Error loading bookings:", error);
            }
        };
        fetchBookings();
    }, []);

    // Define what happens on Edit
    const handleEditClick = (row) => {
        console.log('Edit clicked:', row);
        // You can open a modal or navigate to an edit page, for instance
    };

    // Define what happens on Delete
    const handleDeleteClick = (userID) => {
        console.log('Delete clicked for user ID:', userID);
        // You might trigger a deletion confirmation or perform the delete operation here
    };

    return (
        <div className="template-page" style={{ boxSizing: "border-box" }}>
            <Box sx={{ display: "flex", boxSizing: "border-box" }}>
                <OrganizerSidebar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
                    <CustomAppBar title={"Bookings"} />

                    <Box sx={{ flexGrow: 1, margin: "10px 20px", boxSizing: "border-box" }}>
                        <Box sx={{
                            display: "flex", flexGrow: 1,
                            height: "7vh", boxSizing: "border-box", marginBottom: "10px",
                            justifyContent: "space-between", alignItems: "flex-end"
                        }}>
                            <Box sx={{ display: "flex", boxSizing: "border-box", width: "200px", justifyContent: "space-between" }}>
                                <Link href="#" underline="hover" className="TabBookingButtons" onClick={() => setActiveTab("All")}>All</Link>
                                <p>|</p>
                                <Link href="#" underline="hover" className="TabBookingButtons" onClick={() => setActiveTab("Confirmed")}>Confirmed</Link>
                                <p>|</p>
                                <Link href="#" underline="hover" className="TabBookingButtons" onClick={() => setActiveTab("Pending")}>Pending</Link>
                            </Box>

                            <Box sx={{ display: "flex", boxSizing: "border-box" }}>
                                <TextField id="outlined-size-small" label="Search bookings..." type="search" size="small" sx={{ width: "300px" }} />
                                <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ height: "40px", backgroundColor: "#CFCFC4", border: "#000", color: "#000" }}>
                                    Filter
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{
                            display: "flex", flexGrow: 1, flex: 1, flexDirection: "column", boxSizing: "border-box",
                            height: 'calc(100vh - 230px)'
                        }}>
                            <BookingTable
                                boxPadding={"0px"}
                                rows={rows}
                                columns={columns}
                                onEditClick={handleEditClick}
                                onDeleteClick={handleDeleteClick}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default OrganizerBookings;
