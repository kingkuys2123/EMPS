import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
    Tabs,
    Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../utils/AuthContext.jsx";
import EventService from "../../services/EventService.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import AdminTable from "./AdminTable.jsx";
import AddEventModal from "./AddEventModal.jsx";
import EditEventModal from "./EditEventModal.jsx";
import "../styles/FontStyle.css";

function AdminEventsDashboard() {
    const nav = useNavigate();
    const { currentUser } = getAuth();

    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [tabValue, setTabValue] = useState(0);  // 0 for All, 1 for Listed, 2 for Pending
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [openAddEventModal, setOpenAddEventModal] = useState(false);
    const [openEditEventModal, setOpenEditEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Fetch events data on mount
    useEffect(() => {
        if (!currentUser) {
            nav("/home");
        }
        const fetchData = async () => {
            try {
                const data = await EventService.getAllEvents();
                setEvents(data);
                setFilteredEvents(data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            }
        };
        fetchData();
    }, [currentUser, nav]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        filterEventsByTab(newValue);
    };

    const filterEventsByTab = (tab) => {
        let filtered;
        if (tab === 0) {  // All events
            filtered = events;
        } else if (tab === 1) {  // Listed events
            filtered = events.filter(event => event.event_status === "Listed");
        } else if (tab === 2) {  // Pending events
            filtered = events.filter(event => event.event_status === "Pending");
        }
        setFilteredEvents(filtered);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        const filtered = events.filter(
            (event) =>
                event.name.toLowerCase().includes(query) ||
                event.type.toLowerCase().includes(query)
        );
        setFilteredEvents(filtered);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };

    const handleDeleteEvent = async () => {
        try {
            await EventService.deleteEvent(eventToDelete);
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventToDelete));
            setFilteredEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventToDelete));
            setSnackbarMessage("Event has been deleted successfully.");
            setOpenSnackbar(true);
            setOpenDeleteDialog(false);
        } catch (e) {
            setSnackbarMessage("Failed to delete event.");
            setOpenSnackbar(true);
            setOpenDeleteDialog(false);
        }
    };

    const handleEditEventSuccess = (updatedEvent) => {
        setEvents((prevEvents) =>
            prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
        );
        setFilteredEvents((prevEvents) =>
            prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
        );
        setSnackbarMessage("Event has been updated successfully.");
        setOpenSnackbar(true);
        setOpenEditEventModal(false);
    };

    const columns = [
        { field: "eventId", headerName: "ID", width: 90 },
        { field: "name", headerName: "Event Name", width: 200 },
        { field: "type", headerName: "Type", width: 150 },
        { field: "start_dateTime", headerName: "Start Date", width: 180 },
        { field: "end_dateTime", headerName: "End Date", width: 180 },
        { field: "event_status", headerName: "Status", width: 150 },
        { field: "actions", headerName: "Actions", width: 200, sortable: false, renderCell: (params) => (
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditEventClick(params.row)}
                    sx={{ marginRight: 1 }}
                >
                    Edit
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteEventClick(params.row.id)}
                >
                    Delete
                </Button>
            </Box>
        )}
    ];
    
    const rows = filteredEvents.map((event, index) => {
        console.log(event);  // Log the event before returning the object
        return {
            id: event.eventId,  // Use event_code or generate one using index
            name: event.name,
            type: event.type,
            start_dateTime: event.start_datetime,
            end_dateTime: event.end_datetime,
            event_status: event.event_status,
        };
    });
    
    
    
    

    const handleEditEventClick = (event) => {
        setSelectedEvent(event);
        setOpenEditEventModal(true);
    };

    const handleDeleteEventClick = (eventId) => {
        setEventToDelete(eventId);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setEventToDelete(null);
    };

    return (
        <div className="template-page">
            <Box sx={{ display: "flex", width: "100vw", maxWidth: "100%" }}>
                <AdminSidebar />
                <Box component="main" sx={{
                    flexGrow: 1,
                    backgroundColor: "#F3F3F3",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    overflowX: "hidden",
                }}>
                    <CustomAppBar title={"Events"} />
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Box sx={{ display: "flex", marginBottom: "30px", justifyContent: "space-between" }}>
                            <Tabs value={tabValue} onChange={handleTabChange} sx={{ marginBottom: "20px" }}>
                                <Tab label="All" />
                                <Tab label="Listed" />
                                <Tab label="Pending" />
                            </Tabs>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    label="Search"
                                    variant="outlined"
                                    size="small"
                                    onChange={handleSearch}
                                    sx={{ marginRight: "10px", backgroundColor: "#FFFFFF" }}
                                />
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#D32F2F",
                                        color: "#FFFFFF",
                                        "&:hover": { backgroundColor: "#B71C1C" },
                                    }}
                                    onClick={() => setOpenAddEventModal(true)}
                                >
                                    + Add Event
                                </Button>
                            </Box>
                        </Box>
                        <Box sx={{
                            backgroundColor: "#FFFFFF",
                            width: "auto",
                            height: "100%",
                            boxShadow: "5px 5px 5px #aaaaaa",
                            position: "relative",
                            overflowY: "auto"
                        }}>
                            <AdminTable rows={rows} columns={columns} />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <AddEventModal
                open={openAddEventModal}
                onClose={() => setOpenAddEventModal(false)}
                onSuccess={(newEvent) => {
                    setEvents((prevEvents) => [...prevEvents, newEvent]);
                    filterEventsByTab(tabValue);
                    setSnackbarMessage("Event has been added successfully.");
                    setOpenSnackbar(true);
                    setOpenAddEventModal(false);
                }}
            />

            <EditEventModal
                open={openEditEventModal}
                onClose={() => setOpenEditEventModal(false)}
                event={selectedEvent}
                onSuccess={handleEditEventSuccess}
            />

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete Event?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleDeleteEvent}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={snackbarMessage} />
        </div>
    );
}

export default AdminEventsDashboard;
