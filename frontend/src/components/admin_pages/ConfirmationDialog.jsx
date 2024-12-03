import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import EventService from "../../services/EventService";

function ConfirmationDialog({ open, onClose, event, onConfirm, onRefuse }) {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [eventStatus, setEventStatus] = useState('');
    const [confirmationStatus, setConfirmationStatus] = useState('');


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

    const handleApprove = async () => {
        const updatedEvent = {
            name,
            type,
            description,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            eventStatus: eventStatus,
            confirmationStatus: "Confirmed",
        };

        try {
            const response = await EventService.updateEvent(event.eventId, updatedEvent);
            if (response && response.data) {
                onConfirm(response.data); 
                onClose(); 
            } else {
                console.error("Error: Response is not in the expected format");
            }
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const handleRefuse = async () => {
        try {
            await EventService.deleteEvent(event.eventId);
            onRefuse(event.eventId);
            onClose();
        } catch (error) {
            console.error("Error refusing event:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmation Status</DialogTitle>
            <DialogContent>
                <p>Are you sure you want to {event.confirmationStatus === "Pending" ? "approve" : "refuse"} this event?</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleApprove} color="primary" variant="contained">
                    Approve
                </Button>
                <Button onClick={handleRefuse} color="secondary" variant="contained">
                    Refuse
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;
