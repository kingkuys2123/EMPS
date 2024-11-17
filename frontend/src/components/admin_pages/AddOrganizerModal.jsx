import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button, Autocomplete } from "@mui/material";
import CustomSnackbar from "../CustomSnackbar.jsx";
import UserService from "../../services/UserService.jsx"; // Assuming this service fetches users
import '../styles/FontStyle.css';

function AddOrganizerModal({ open, onClose, switchModal, label }) {
    const [username, setUsername] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [userOptions, setUserOptions] = useState([]);
    const [allUsers, setAllUsers] = useState([]); // Store all users here

    // Fetch all users when modal opens
    useEffect(() => {
        if (open) {
            const fetchUsers = async () => {
                try {
                    const users = await UserService.getAllUsers(); // Fetch all users
                    setAllUsers(users); // Store all users
                    setUserOptions(users); // Populate options in autocomplete
                } catch (error) {
                    console.error("Error fetching users:", error);
                    setSnackbarMessage('Error fetching users. Please try again.');
                    setOpenSnackbar(true);
                }
            };
            fetchUsers();
        }

        if (!open) {
            setUsername('');
            setErrors({});
            setUserOptions([]); // Reset user options when modal closes
        }
    }, [open]);

    // Close the snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    // Handle username input change
    const handleUsernameChange = (event) => {
        const value = event.target.value;
        setUsername(value);

        // Filter the users as the user types
        if (value) {
            const filteredUsers = allUsers.filter(user =>
                user.username && user.username.toLowerCase().includes(value.toLowerCase())
            );
            setUserOptions(filteredUsers); // Update autocomplete options
        } else {
            setUserOptions(allUsers); // Show all users when input is cleared
        }
    };

    // Handle form submission to update user accountType to "Organizer"
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if username is set
        if (!username) {
            setErrors({ username: true });
            setSnackbarMessage('Please select a user.');
            setOpenSnackbar(true);
            return;
        }
    
        try {
            // Find the user from allUsers based on the selected username
            const user = allUsers.find((user) => user.username.trim().toLowerCase() === username.trim().toLowerCase());
    
            if (user) {
                // Debugging: Log user data being sent to the backend
                console.log('Sending user to update:', user);
    
                const updatedUser = { ...user, accountType: 'Organizer' };
    
                // Call the UserService to update the user's accountType in the database
                const response = await UserService.updateUser(updatedUser); // Assuming UserService handles the API call
                
                // Check the response from the API call
                console.log('API Response:', response);
    
                if (response?.status === 200) {
                    setSnackbarMessage('User account updated to Organizer!');
                    setOpenSnackbar(true);
                    onClose(); // Close the modal
                } else {
                    setSnackbarMessage('An error occurred while updating the user.');
                    setOpenSnackbar(true);
                }
            } else {
                setSnackbarMessage('User not found.');
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error('Error during user update:', error);
            setSnackbarMessage('An error occurred while updating the user.');
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
                            <span style={{ color: '#7F7F7F' }}>Assign a user to become an organizer</span>
                        </Typography>

                        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                            <Autocomplete
                                options={userOptions}
                                getOptionLabel={(option) => option.username || ''}
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
                                isOptionEqualToValue={(option, value) => option.username === value.username}
                                getOptionSelected={(option, value) => option.username === value.username}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ marginTop: 2, backgroundColor: '#C63f47', borderRadius: 0 }}
                            >
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
