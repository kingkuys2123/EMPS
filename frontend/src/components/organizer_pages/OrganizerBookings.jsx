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
        { field: 'booking', headerName: 'Booking', flex: 1, minWidth: 100  },
        { field: 'customerName', headerName: 'Customer Name', flex: 1, minWidth: 100 },
        { field: 'event', headerName: 'Event', flex: 1, minWidth: 100 },
        { field: 'tickets', headerName: 'Tickets', flex: 1, minWidth: 100, type: 'number', align: 'left', headerAlign: 'left' },
        { field: 'totalPrice', headerName: 'Total Price', flex: 1, minWidth: 100, type: 'number', align: 'left', headerAlign: 'left' },
        { field: 'date', headerName: 'Date', flex: 1, minWidth: 100, type: 'date' },
        { field: 'status', headerName: 'Status', flex: 1, minWidth: 100 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            minWidth: 100,
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
        <div className="template-page">
            <Box sx={{display: "flex", width: "100%" }}>
                <OrganizerSidebar/>
                <Box component="main" sx={{
                    flexGrow: 1,
                    backgroundColor: "#F3F3F3",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    overflowX: "hidden",
                }}>
                    <CustomAppBar title={"Bookings"}/>
                    <Box sx={{flexGrow: 1, padding: "21px", backgroundColor: "#F3F3F3"}}>
                        <Box sx={{
                            display: "flex",
                            flexGrow: 1,
                            height: "5vh",
                            marginBottom: "10px",
                            justifyContent: "space-between",
                            alignItems: "flex-end"
                        }}>
                            <Box sx={{display: "flex", width: "200px", justifyContent: "space-between"}}>
                                <Link href="#" underline="hover" className="TabBookingButtons"
                                      onClick={() => setActiveTab("All")}>All</Link>
                                <p>|</p>
                                <Link href="#" underline="hover" className="TabBookingButtons"
                                      onClick={() => setActiveTab("Confirmed")}>Confirmed</Link>
                                <p>|</p>
                                <Link href="#" underline="hover" className="TabBookingButtons"
                                      onClick={() => setActiveTab("Pending")}>Pending</Link>
                            </Box>
                            <Box sx={{display: "flex"}}>
                                <TextField id="outlined-size-small" label="Search bookings..." type="search"
                                           size="small" sx={{width: "300px"}}/>
                                <Button variant="outlined" startIcon={<FilterListIcon/>} sx={{
                                    height: "40px",
                                    backgroundColor: "#CFCFC4",
                                    border: "#000",
                                    color: "#000"
                                }}>
                                    Filter
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{
                            backgroundColor: "#FFFFFF",
                            width: "auto",
                            boxShadow: "5px 5px 5px #aaaaaa",
                            overflowY: "auto"
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
