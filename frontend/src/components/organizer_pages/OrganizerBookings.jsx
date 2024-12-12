import { useState, useEffect } from "react";
import OrganizerSidebar from "./OrganizerSidebar.jsx";
import TemplateComponent from "../TemplateComponent.jsx";

import BookingService from "../../services/BookingService.jsx";
import { Button } from "@mui/material";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import '../../components/organizer_pages/styles/OrganizerBookings.css'

import { getAuth } from "../../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function OrganizerBookings() {
    const nav = useNavigate();
    const { currentUser, setCurrentUser, toggleOrganizer } = getAuth();

    const [rows, setRows] = useState([]);
    const [activeTab, setActiveTab] = useState("All");
    const [checker, checked] = useState(true);

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
        { field: 'booking', headerName: 'Booking'},
        { field: 'customerName', headerName: 'Customer Name', display: "flex", flex: 1},
        { field: 'event', headerName: 'Event', display: "flex", flex: 1},
        { field: 'tickets', headerName: 'Tickets', type: 'number', align: 'left', headerAlign: 'left'},
        { field: 'totalPrice', headerName: 'Total Price', type: 'number', align: 'left', headerAlign: 'left'},
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
            field: 'status', headerName: 'Status', width: 150,
            renderCell: (params) => {
                return (
                    <div style={{ color: params.row.status === "Pending" ? "red" : "green", display: "flex", alignItems: "center" }}>
                        {params.row.status === "Confirmed" ? <CheckCircleIcon sx={{ height: "18px" }} /> : <ReportGmailerrorredIcon sx={{ height: "18px" }} />}
                        {params.row.status}
                    </div>
                )
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
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
        try {
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
            searchLabel={"Search bookings by name..."}
        />
    );
}

export default OrganizerBookings;
