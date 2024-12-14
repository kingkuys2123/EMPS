import { useState, useEffect } from "react";
import OrganizerSidebar from "./OrganizerSidebar.jsx";
import TemplateComponent from "../TemplateComponent.jsx";

import BookingService from "../../services/BookingService.jsx";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import '../../components/organizer_pages/styles/OrganizerBookings.css'

import { getAuth } from "../../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import '../../components/organizer_pages/styles/OrganizerBookings.css';

function OrganizerBookings() {
    const nav = useNavigate();
    const { currentUser, setCurrentUser, toggleOrganizer } = getAuth();

    const [rows, setRows] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [checker, checked] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null); // To track the row to delete


    useEffect(() => {
        if (!currentUser) {
            nav('/');
        }
        else if(currentUser.accountType === "user"){
            nav("/home")
        }
        else if(currentUser.accountType === "admin"){
            nav("/admin/dashboard");
        }
        else if (currentUser.accountType === "organizer") {
            if(!toggleOrganizer) {
                nav('/home');
            }
        }
    }, []);

    const columns = [
        { field: 'bookingID', headerName: 'ID' },
        { field: 'customerName', headerName: 'Customer Name', flex: 1 },
        { field: 'ticketName', headerName: 'Ticket', flex: 1 },
        { field: 'ticketsQuantity', headerName: 'Quantity', type: 'number', align: 'left', headerAlign: 'left', flex: 1 },
        { field: 'totalPrice', headerName: 'Total Price', type: 'number', align: 'left', headerAlign: 'left', flex: 1 },
        {
            field: 'eventName',
            headerName: 'Event',
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            renderCell: (params) => (
                <a href={`/organizer/events/view/${params.row.eventID}`} style={{ textDecoration: 'none', color: 'blue' }}>
                    {params.row.eventName ? params.row.eventName : 'N/A'}
                </a>
            )
        },
        {
            field: 'dateBooked',
            headerName: 'Date Booked',
            width: 250,
            type: 'date',
            valueFormatter: (params) => {
                const date = new Date(params);
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
            flex: 1
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
            flex: 1
        },
    ];

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                let bookings;
                if (activeTab === "All") {
                    bookings = await BookingService.getAllBookings(currentUser.userID);
                } else if (activeTab === "Paid") {
                    bookings = await BookingService.getPaidBookings(currentUser.userID);
                } else if (activeTab === "Pending") {
                    bookings = await BookingService.getPendingBookings(currentUser.userID);
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
            checked(!checker);
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
                tabs={["All", "Paid", "Pending"]}
                fetchRows={rows}
                columns={columns}
                onEditClick={handleAcceptClick}
                onDeleteClick={handleDeleteModalOpen}
                setActiveTab={setActiveTab}
                searchLabel={"Search bookings by event name..."}
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
