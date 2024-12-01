import React, { useState, useEffect } from "react";
import { Button, Tabs, Tab, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EventMenu from './EventMenu';
import AddEventModal from "./AddEventModal.jsx";
import EditEventModal from "./EditEventModal.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import EventService from '../../services/EventService';


import "../styles/FontStyle.css";
import "./styles/EventList.css";

function AdminEventsDashboard() {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const [openAddEventModal, setOpenAddEventModal] = useState(false);
    const [openEditEventModal, setOpenEditEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const response = await EventService.getAllEvent();
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Error fetching events. Please try again later');
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredEvents = events.filter(
        (event) =>
            (event.name && event.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (event.type && event.type.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenAddEventModal = () => {
        setOpenAddEventModal(true);
    };

    const handleCloseAddEventModal = () => {
        setOpenAddEventModal(false);
    };

    const handleAddEventSuccess = (newEvent) => {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        setOpenAddEventModal(false);
        fetchEvents();
    };

    const handleViewEvent = async (eventId) => {
        navigate(`/organizer/my_events/${eventId}`);
    };

    const handleUpdateEvent = async (eventId, updatedEvent) => {
        try {
            const response = await EventService.updateEvent(eventId, updatedEvent);
            if (response.status === 200) {
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.eventId === eventId ? { ...event, ...updatedEvent } : event
                    )
                );
                fetchEvents();
                //navigate(`/myevents/${eventId}`);
            } else {
                console.error('Failed to update event:', response);
            }
        } catch (error) {
            console.error('Error updating event:', error);
            fetchEvents();
        }
    };

    const handleOpenEditEventModal = (event) => {
        setSelectedEvent(event);
        setOpenEditEventModal(true);
    };

    const handleCloseEditEventModal = () => {
        setOpenEditEventModal(false);
        setSelectedEvent(null);
    };

    const handleEditEventSuccess = (updatedEvent) => {
        handleUpdateEvent(updatedEvent.eventId, updatedEvent);
        handleCloseEditEventModal();
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            setEvents((prevEvents) => prevEvents.filter((event) => event.eventId !== eventId));
            await EventService.deleteEvent(eventId);
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            fetchEvents();
        }
    };

    const tabFilteredEvents = filteredEvents.filter((event) => {
        if (tabValue === 0) return true;
        if (tabValue === 1) return event.confirmationStatus === "Confirmed";
        if (tabValue === 2) return event.confirmationStatus === "Pending";
        return true;
    });

    return (
        <div className="template-page">
            <AdminSidebar />
            <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>

                    <CustomAppBar title={"My Events"} />
                    <div className="content">
                        <div className="event-container">
                            <div className="event-header">
                                <div className="filter-links">
                                    <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary"
                                        sx={{
                                            "& .MuiTab-root.Mui-selected": {
                                                backgroundColor: "#FFFFFF",
                                                color: "#000000",
                                                borderRadius: "5px",
                                            },
                                        }}>
                                        <Tab label="All" />
                                        <Tab label="Confirmed" />
                                        <Tab label="Pending" />
                                    </Tabs>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder="Search events..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="search-bar"
                                    />
                                    <Button
                                        className="add-event-button"
                                        variant="contained"
                                        color="primary"
                                        onClick={handleOpenAddEventModal}
                                        sx={{ backgroundColor: '#B71C1C', marginLeft: "20px" }}
                                    >
                                        + Add Event
                                    </Button>
                                </div>
                            </div>

                            {error && <p>{error}</p>}

                            <table className="event-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Event Name</th>
                                        <th>Type</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Status</th>
                                        <th>Confirmation</th>
                                        <th>Number of Attendees</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tabFilteredEvents.map((event) => (
                                        <tr key={event.eventId}>
                                            <td><input type="checkbox" /></td>
                                            <td>{event.name}</td>
                                            <td><span className={`badge ${event.type?.toLowerCase()}`}>{event.type}</span></td>
                                            <td>{new Date(event.startDateTime).toLocaleString()}</td>
                                            <td>{new Date(event.endDateTime).toLocaleString()}</td>
                                            <td><span className={`badge ${event.eventStatus?.toLowerCase()}`}>{event.eventStatus}</span></td>
                                            <td><span className={`badge ${event.confirmationStatus?.toLowerCase()}`}>{event.confirmationStatus}</span></td>
                                            <td>{event.attendees}</td>
                                            <td>
                                                <EventMenu
                                                    onView={() => handleViewEvent(event.eventId)}
                                                    onEdit={() => handleOpenEditEventModal(event)}
                                                    onDelete={() => handleDeleteEvent(event.eventId)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <AddEventModal
                        open={openAddEventModal}
                        onClose={handleCloseAddEventModal}
                        onEventAdded={handleAddEventSuccess}
                    />
                    {selectedEvent && (
                        <EditEventModal
                            open={openEditEventModal}
                            onClose={handleCloseEditEventModal}
                            event={selectedEvent}
                            onSave={handleEditEventSuccess}
                        />
                    )}
                </Box>

            </Box>
        </div>
    );
}

export default AdminEventsDashboard;
