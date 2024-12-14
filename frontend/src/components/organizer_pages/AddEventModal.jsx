import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid, MenuItem, Select, FormControl, InputLabel, Typography } from '@mui/material';
import EventService from "../../services/EventService.jsx"; // Service to handle adding event
import { getAuth } from '../../utils/AuthContext.jsx'

const AddEventModal = ({ open, onClose, onEventAdded }) => {
    const { currentUser } = getAuth();
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [eventStatus, setEventStatus] = useState('');
    const [confirmationStatus, setConfirmationStatus] = useState('');
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState('/assets/placeholders/1280x720-image-placeholder.png');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCoverPhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSize = 15 * 1024 * 1024;
            if (file.size > maxSize) {
                setSnackbarMessage('File size must be under 15MB.');
                setOpenSnackbar(true);
                return;
            }
            setCoverPhoto(file);
            setCoverPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleAddEvent = async (event) => {
        event.preventDefault();
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
            const response = await EventService.createEventWithOrganizer(currentUser.userID, eventData);
            if (response && response.data) {
                if (coverPhoto) {
                    await EventService.uploadCoverPhoto(response.data.eventId, coverPhoto);
                }
                onEventAdded(response.data);
                handleClose();
            } else {
                console.error("Error: Response is not in the expected format");
            }
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    const handleClose = () => {
        setName('');
        setType('');
        setDescription('');
        setStartDateTime('');
        setEndDateTime('');
        setEventStatus('');
        setConfirmationStatus('');
        setCoverPhoto(null);
        setCoverPhotoPreview('/assets/placeholders/1280x720-image-placeholder.png');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add Event</DialogTitle>
            <DialogContent>
                <form onSubmit={handleAddEvent}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <div style={{
                                    width: '320px',
                                    height: '180px',
                                    overflow: 'hidden',
                                    borderRadius: '10px',
                                    flexShrink: 0
                                }}>
                                    <img
                                        src={coverPhotoPreview}
                                        alt="cover-photo-preview"
                                        style={{width: '320px', height: '180px', objectFit: 'cover'}}
                                    />
                                </div>
                                <div style={{display: 'flex', justifyContent: 'center', paddingLeft: '15px'}}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{
                                            backgroundColor: "#C63f47",
                                            color: "#FFFFFF",
                                            textTransform: 'none',
                                            borderRadius: "0"
                                        }}
                                    >
                                        <Typography>
                                            <span>Upload Cover Photo</span>
                                        </Typography>
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/png, image/jpeg"
                                            onChange={handleCoverPhotoChange}
                                        />
                                    </Button>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Event Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
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
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Event Type</InputLabel>
                                <Select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    label="Event Type"
                                    required
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
                                required
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
                                inputProps={{
                                    max: endDateTime,
                                }}
                                required
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
                                inputProps={{
                                    min: startDateTime,
                                }}
                                required
                            />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button onClick={handleClose} sx={{ backgroundColor: '#B71C1C', color: "white" }}>
                            Cancel
                        </Button>
                        <Button type="submit" sx={{ backgroundColor: '#B71C1C', color: "white" }}>
                            Add Event
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddEventModal;