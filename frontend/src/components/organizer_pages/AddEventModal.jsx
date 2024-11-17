import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid, MenuItem, Select, FormControl, InputLabel, Menu } from '@mui/material';
import EventService from "../../services/EventService.jsx"; // Service to handle adding event

const AddEventModal = ({ open, onClose, onEventAdded }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [eventStatus, setEventStatus] = useState('');
    const [confirmationStatus, setConfirmationStatus] = useState('');

    const handleAddEvent = async () => {
        const eventData = {
            name,
            type,
            description,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            eventStatus: eventStatus,
            confirmationStatus: "Pending"
        };

        try {
            const response = await EventService.createEvent(eventData); // Assuming your service call
            if (response && response.data) {
                onEventAdded(response.data); // This should call the function passed from the parent
                onClose(); // Close the modal
            } else {
                console.error("Error: Response is not in the expected format");
            }
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Event</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Event Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Event Type</InputLabel>
                            <Select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                label="Event Type"
                            >
                                <MenuItem value="Public">Public</MenuItem>
                                <MenuItem value="Private">Private</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Event Status"
                            value={eventStatus}
                            onChange={(e) => setEventStatus(e.target.value)}
                            select
                        >
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="Upcoming">Upcoming</MenuItem>
                            <MenuItem value="Ongoing">Ongoing</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Start Date & Time"
                            type="datetime-local"
                            value={startDateTime}
                            onChange={(e) => setStartDateTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="End Date & Time"
                            type="datetime-local"
                            value={endDateTime}
                            onChange={(e) => setEndDateTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{backgroundColor: '#B71C1C', color: "white"}}>
                    Cancel
                </Button>
                <Button onClick={handleAddEvent} sx={{backgroundColor: '#B71C1C', color: "white"}}>
                    Add Event
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddEventModal;
