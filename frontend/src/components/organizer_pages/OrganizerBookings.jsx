import { useState, useEffect } from "react";
import OrganizerSidebar from "./OrganizerSidebar.jsx";
import TemplateComponent from "../TemplateComponent.jsx";
import BookingService from "../../services/BookingService.jsx";
import { Button } from "@mui/material";
const columns = [
    { field: 'booking', headerName: 'Booking', minWidth: 80 },
    { field: 'customerName', headerName: 'Customer Name', minWidth: 200, display: "flex", flex: 1  },
    { field: 'event', headerName: 'Event', minWidth: 300, display: "flex", flex: 2 },
    { field: 'tickets', headerName: 'Tickets', minWidth: 80, type: 'number', align: 'left', headerAlign: 'left' },
    { field: 'totalPrice', headerName: 'Total Price', minWidth: 120, type: 'number', align: 'left', headerAlign: 'left',display: "flex", flex: 1     },
    { field: 'date', headerName: 'Date', minWidth: 120, type: 'date', display: "flex", flex: 1  },
    { field: 'status', headerName: 'Status', minWidth: 120, display: "flex", flex: 1  },
    {
        field: 'actions',
        headerName: 'Actions',
        width: 180,
        display: "flex", flex: 1, 
        renderCell: (params) => (
            <>
                <Button onClick={() => onEditClick(params)} variant="contained" color="success" size="small">
                    Accept
                </Button>
                <Button onClick={() => onDeleteClick(params.row.id)} variant="contained" color="error" size="small" style={{ marginLeft: 8 }}>
                    Delete
                </Button>
            </>
        ),
    },
];
function OrganizerBookings() {
    const [rows, setRows] = useState([]);
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

    const handleEditClick = (row) => {
        console.log('Accepted clicked:', row);
    };

    const handleDeleteClick = (userID) => {
        console.log('Delete clicked for user ID:', userID);
    };

    return (
        <TemplateComponent
            SidebarComponent={OrganizerSidebar}
            title="Bookings"
            tabs={["All", "Confirmed", "Pending"]}
            fetchRows={rows}
            columns={columns}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
        />
    );
}

export default OrganizerBookings;
