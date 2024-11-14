import React, { useState, useEffect } from "react";
import { Button, Tabs, Tab } from "@mui/material";
import EventMenu from './EventMenu'; 
import AddEventModal from "./AddEventModal.jsx";
import EditEventModal from "./EditEventModal.jsx";
import ViewEventModal from "./ViewEventModal.jsx";
import AdminSidebar from  "./AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import EventService from '../../services/EventService';

import "../styles/FontStyle.css";
import "./styles/EventList.css";
import LongMenu from "./LongMenu.jsx";

function AdminEventsDashboard() {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const [openAddEventModal, setOpenAddEventModal] = useState(false);
    const [openEditEventModal, setOpenEditEventModal] = useState(false);
    const [openViewEventModal, setOpenViewEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [tabValue, setTabValue] = useState(0); 

    const fetchEvents = async () => {
        try {
            const response = await EventService.getAllEvent();
            setEvents(response.data);
        } catch (error) {
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

    const handleCloseViewEventModal = () => {
        setModalOpen(false);
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
            } else {
                console.error('Failed to update event:', response);
            }
        } catch (error) {
            console.error('Error updating event:', error);
            fetchEvents();
        }
    };

    const handleConfirmEvent = async (eventId) => {
        try {
            const updatedEvent = { confirmationStatus: "Confirmed" };
            await EventService.updateEvent(eventId, updatedEvent);
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event.eventId === eventId ? { ...event, ...updatedEvent } : event
                )
            );
            fetchEvents();
        } catch (error) {
            console.error('Error confirming event:', error);
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

            <div className="content">
                <CustomAppBar title={"My Events"} />

                <div className="event-container">
                    <div className="event-header">
                        <div className="filter-links">
                            <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                                <Tab label="All" />
                                <Tab label="Confirmed" />
                                <Tab label="Pending" />
                            </Tabs>
                        </div>
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
                        >
                            + Add Event
                        </Button>
                    </div>

                    {error && <p>{error}</p>}

                    <table className="event-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" /></th>
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
                                        <LongMenu
                                            onView={() => handleViewEvent(event.eventId)}
                                            onEdit={() => handleEditEvent(event)}
                                            onDelete={() => handleDeleteEvent(event.eventId)}
                                            onConfirmEvent={tabValue === 2 ? () => handleConfirmEvent(event.eventId) : null} // Only show for Pending tab
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
            <ViewEventModal
                open={openViewEventModal}
                onClose={handleCloseViewEventModal}
                event={selectedEvent}
            />
            {selectedEvent && (
                <EditEventModal
                    open={openEditEventModal}
                    onClose={handleCloseEditEventModal}
                    event={selectedEvent}
                    onSave={handleEditEventSuccess}
                />
            )}
        </div>
    );
}

export default AdminEventsDashboard;
