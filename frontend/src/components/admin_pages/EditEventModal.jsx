// EditEventModal.jsx
import { Dialog, DialogTitle, DialogActions, Button, TextField, Box } from "@mui/material";
import { useState } from "react";

function EditEventModal({ open, onClose, event, onSave }) {
    const [eventName, setEventName] = useState(event?.eventName || "");
    const [type, setType] = useState(event?.type || "");
    const [startDate, setStartDate] = useState(event?.startDate || "");
    const [endDate, setEndDate] = useState(event?.endDate || "");

    const handleSubmit = () => {
        const updatedEvent = { ...event, eventName, type, startDate, endDate };
        onSave(updatedEvent); // Calls the `handleEditEventSuccess` in `AdminEventsDashboard`
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Event</DialogTitle>
            <Box sx={{ padding: "20px" }}>
                <TextField label="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} fullWidth />
                <TextField label="Type" value={type} onChange={(e) => setType(e.target.value)} fullWidth />
                <TextField label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} fullWidth />
                <TextField label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} fullWidth />
            </Box>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditEventModal;  // Default export
