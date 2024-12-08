import { useState, useEffect } from "react";
import OrganizerSidebar from "./OrganizerSidebar.jsx";
import TemplateComponent from "../TemplateComponent.jsx";
import BookingService from "../../services/BookingService.jsx";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import '../../components/organizer_pages/styles/OrganizerBookings.css';

function OrganizerBookings() {
    const [rows, setRows] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [checker, checked] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null); // To track the row to delete

    const columns = [
        { field: 'booking', headerName: 'Booking' },
        { field: 'customerName', headerName: 'Customer Name', flex: 1 },
        { field: 'event', headerName: 'Event', flex: 1 },
        { field: 'tickets', headerName: 'Tickets', type: 'number', align: 'left', headerAlign: 'left' },
        { field: 'totalPrice', headerName: 'Total Price', type: 'number', align: 'left', headerAlign: 'left' },
        {
            field: 'dateBooked',
            headerName: 'Date Booked',
            width: 200,
            type: 'date',
            valueFormatter: (params) => {
                const date = new Date(params);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <div style={{ color: params.row.status === "Pending" ? "red" : "green", display: "flex", alignItems: "center" }}>
                    {params.row.status === "Confirmed" ? <CheckCircleIcon sx={{ height: "18px" }} /> : <ReportGmailerrorredIcon sx={{ height: "18px" }} />}
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
                                onClick={() => handleDeleteModalOpen(params)}
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
                return null;
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
        try {
            const updatedBooking = await BookingService.updateTicketQuantity(data.row.booking);
            const statusUpdatedBooking = await BookingService.updateBookingStatus(data.row.booking);

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
            await BookingService.deleteBooking(selectedRow.booking);
            setRows((prevRows) => prevRows.filter((row) => row.booking !== selectedRow.booking));
            handleDeleteModalClose();
        } catch (error) {
            console.error("Error deleting booking:", error);
        }
    };

    return (
        <>
            <TemplateComponent
                SidebarComponent={OrganizerSidebar}
                title="Bookings"
                tabs={["All", "Confirmed", "Pending"]}
                fetchRows={rows}
                columns={columns}
                onEditClick={handleAcceptClick}
                onDeleteClick={handleDeleteModalOpen}
                setActiveTab={setActiveTab}
                searchLabel={"Search bookings by name..."}
            />

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
        </>
    );
}

export default OrganizerBookings;
