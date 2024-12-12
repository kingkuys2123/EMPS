import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

function UserEventsFilterModal({ open, onClose, filters, setFilters }) {
    const handleStatusChange = (event) => {
        setFilters({ ...filters, status: event.target.value });
    };

    const handleTypeChange = (event) => {
        setFilters({ ...filters, type: event.target.value });
    };

    const handleApplyFilters = () => {
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Filter Events</DialogTitle>
            <DialogContent>
                <Box sx={{ minWidth: 120, marginBottom: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select value={filters.status} onChange={handleStatusChange}>
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="Ongoing">Ongoing</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="Upcoming">Upcoming</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select value={filters.type} onChange={handleTypeChange}>
                            <MenuItem value="">None</MenuItem>
                            <MenuItem value="Private">Private</MenuItem>
                            <MenuItem value="Public">Public</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: 'darkgray', borderRadius: "0px" }}>Cancel</Button>
                <Button onClick={handleApplyFilters} variant="contained" sx={{ backgroundColor: '#C63f47', borderRadius: "0px" }}>Apply</Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserEventsFilterModal;