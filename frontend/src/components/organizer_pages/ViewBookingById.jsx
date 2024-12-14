import React, { useEffect, useState } from 'react';
import { getAuth } from '../../utils/AuthContext';
import BookingService from '../../services/BookingService';
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tabs, Tab } from "@mui/material";
import DataTable from "../DataTableComponent";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './styles/ViewBooking.css';

const ViewBookingById = ({ eventId }) => {
    const { currentUser } = getAuth();
    const [rows, setRows] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [activeTab, setActiveTab] = useState("All");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                let bookings;
                if (activeTab === "All") {
                    bookings = await BookingService.getAllBookingsByEventId(parseInt(eventId));
                } else if (activeTab === "Paid") {
                    bookings = await BookingService.getPaidBookingsByEventId(parseInt(eventId));
                } else if (activeTab === "Pending") {
                    bookings = await BookingService.getPendingBookingsByEventId(parseInt(eventId));
                } else {
                    bookings = [];
                }
                setRows(bookings);
            } catch (error) {
                console.error("Error loading bookings:", error);
            }
        };
        fetchBookings();
    }, [activeTab, eventId]);

    const columns = [
        { field: 'bookingID', headerName: 'ID', width: 100 },
        { field: 'customerName', headerName: 'Customer Name', width: 200 },
        { field: 'ticketName', headerName: 'Ticket', width: 200 },
        { field: 'ticketsQuantity', headerName: 'Quantity', type: 'number', width: 100, align: 'left', headerAlign: 'left' },
        { field: 'totalPrice', headerName: 'Total Price', type: 'number', width: 150, align: 'left', headerAlign: 'left' },
        {
            field: 'dateBooked',
            headerName: 'Date Booked',
            width: 250,
            type: 'date',
            valueFormatter: (params) => {
                const date = new Date(params.value);
                return date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                });
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <div style={{ color: params.row.status === "Pending" || params.row.status === "Cancelled" ? "red" : "green", display: "flex", alignItems: "center" }}>
                    {params.row.status === "Paid" ? <CheckCircleIcon sx={{ height: "18px" }} /> : <ReportGmailerrorredIcon sx={{ height: "18px" }} />}
                    {params.row.status}
                </div>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            renderCell: (params) => {
                if (params.row.status === "Pending") {
                    return (
                        <Button
                            onClick={() => handleDeleteModalOpen(params)}
                            variant="contained"
                            color="error"
                            size="small"
                            style={{ marginLeft: 8 }}
                        >
                            Delete
                        </Button>
                    );
                }
                return null;
            },
        },
    ];

    const filteredRows = rows.filter((row) =>
        (row.customerName || "").toLowerCase().includes(searchText.toLowerCase())
    );

    const handleDeleteModalOpen = (data) => {
        setSelectedRow(data.row);
        setDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setSelectedRow(null);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;
        try {
            await BookingService.deleteBooking(selectedRow.bookingID);
            setRows((prevRows) => prevRows.filter((row) => row.bookingID !== selectedRow.bookingID));
            handleDeleteModalClose();
        } catch (error) {
            console.error("Error deleting booking:", error);
        }
    };

    return (
        <div>
            <Box>
                <Box sx={{display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
                    <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                        <Tab label="All" value="All"/>
                        <Tab label="Paid" value="Paid"/>
                        <Tab label="Pending" value="Pending"/>
                    </Tabs>
                    <TextField
                        id="outlined-size-small"
                        label="Search bookings by name..."
                        type="search"
                        size="small"
                        sx={{width: "275px"}}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Box>
                <Box sx={{width: '100%', overflowX: 'auto', overflowY: 'auto'}}>
                    <DataTable
                        boxPadding="20px"
                        checkBox={false}
                        autoHeight
                        rows={filteredRows}
                        columns={columns}
                        onDeleteClick={handleDeleteModalOpen}
                    />
                </Box>
            </Box>
            <Dialog
                open={deleteModalOpen}
                onClose={handleDeleteModalClose}
            >
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this booking?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteModalClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ViewBookingById;