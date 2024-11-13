import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Typography } from '@mui/material';

const ViewEventModal = ({ open, onClose, event }) => {
    if (!event) return null; // Return null if there's no event data to display

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Event Details</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Event Name:</Typography>
                        <Typography>{event.name}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Description:</Typography>
                        <Typography>{event.description}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Event Type:</Typography>
                        <Typography>{event.type}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Event Status:</Typography>
                        <Typography>{event.eventStatus}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Start Date & Time:</Typography>
                        <Typography>{new Date(event.startDatetime).toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">End Date & Time:</Typography>
                        <Typography>{new Date(event.endDatetime).toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6">Confirmation Status:</Typography>
                        <Typography>{event.confirmationStatus}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Number of Attendees:</Typography>
                        <Typography>{event.attendees}</Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewEventModal;
