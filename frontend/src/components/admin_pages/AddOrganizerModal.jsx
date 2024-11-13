import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button, Autocomplete } from "@mui/material";

import CustomSnackbar from "../CustomSnackbar.jsx";
import UserService from "../../services/UserService.jsx";
import OrganizerService from "../../services/OrganizerService.jsx";

import '../styles/FontStyle.css'

function AddOrganizerModal({ open, onClose, switchModal, label }) {
    const [username, setUsername] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [userOptions, setUserOptions] = useState([]);

    useEffect(() => {
        if (!open) {
            setUsername('');
            setErrors({});
        }
    }, [open]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleUsernameChange = async (event) => {
        const value = event.target.value;
        setUsername(value);

        // Fetch users with the matching username
        if (value) {
            try {
                const users = await UserService.searchUsers(value); // Assuming UserService has a searchUsers method
                setUserOptions(users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        } else {
            setUserOptions([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username) {
            setErrors({ username: true });
            setSnackbarMessage('Please select a user.');
            setOpenSnackbar(true);
            return;
        }

        // Proceed with assigning the user as an organizer
        try {
            await OrganizerService.assignOrganizer({ username });
            setSnackbarMessage('Organizer assigned successfully!');
            setOpenSnackbar(true);
            onClose();
        } catch (e) {
            setSnackbarMessage('An unexpected error occurred. Please try again.');
            setOpenSnackbar(true);
        }
    };

    return (
        <div className="add-organizer-modal">
            <Modal open={open} onClose={onClose}>
                <Box sx={{ flex: 1, display: 'flex', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, backgroundColor: '#F3F3F3', boxShadow: 24, padding: 4 }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                        <Typography variant="h6" component="h2">
                            <span>Add an Organizer</span>
                        </Typography>
                        <Typography variant="h6" component="h6">
                        <span style={{color: '#7F7F7F'}}>Assign a user to become an organizer</span>
                        </Typography>

                        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                            <Autocomplete
                                options={userOptions}
                                getOptionLabel={(option) => option.username || ""}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Username"
                                        variant="outlined"
                                        value={username}
                                        onChange={handleUsernameChange}
                                        error={!!errors.username}
                                        margin="normal"
                                    />
                                )}
                                onChange={(event, newValue) => setUsername(newValue?.username || '')}
                                freeSolo
                            />

                            <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: '#C63f47', borderRadius: 0 }}>
                                <span>Save</span>
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Modal>
            <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />
        </div>
    );
}

export default AddOrganizerModal;
