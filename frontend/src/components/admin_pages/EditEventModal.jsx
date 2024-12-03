import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import EventService from "../../services/EventService.jsx"; 

const EditEventModal = ({ open, onClose, event, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [eventStatus, setEventStatus] = useState('');
  const [confirmationStatus, setConfirmationStatus] = useState('');

  // When the event prop changes or modal opens, populate the form fields with event data
  useEffect(() => {
    if (event) {
      setName(event.name || '');
      setType(event.type || '');
      setDescription(event.description || '');
      setStartDateTime(event.startDateTime || '');
      setEndDateTime(event.endDateTime || '');
      setEventStatus(event.eventStatus || '');
      setConfirmationStatus(event.confirmationStatus || '');
    }
  }, [event, open]);

  const handleEditEvent = async () => {
    const updatedEvent = {
      name,
      type,
      description,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      eventStatus: eventStatus,
      confirmationStatus: confirmationStatus,
    };

    try {
      const response = await EventService.updateEvent(event.eventId, updatedEvent);
      if (response && response.data) {
        onSave(response.data); // Callback to parent component to update state
        onClose(); // Close the modal
      } else {
        console.error("Error: Response is not in the expected format");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Event</DialogTitle>
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirmation Status"
              value={confirmationStatus}
              onChange={(e) => setConfirmationStatus(e.target.value)}
              select
            >
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleEditEvent} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventModal;
