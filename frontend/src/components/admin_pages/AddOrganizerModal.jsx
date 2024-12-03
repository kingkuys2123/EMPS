import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import CustomSnackbar from "../CustomSnackbar.jsx";
import UserService from "../../services/UserService.jsx";
import OrganizerService from "../../services/OrganizerService.jsx";
import '../styles/FontStyle.css';

function AddOrganizerModal({ open, onClose }) {
    const [userId, setUserId] = useState('');
    const [fetchedUser, setFetchedUser] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) {
            setUserId('');
            setFetchedUser(null);
            setErrors({});
            setSnackbarMessage('');
            setOpenSnackbar(false);
        }
    }, [open]);

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
        setErrors({});
    };

    const fetchUserById = async () => {
        if (!userId) {
            setErrors({ userId: true });
            setSnackbarMessage("User ID is required.");
            setOpenSnackbar(true);
            return;
        }
    
        try {
            const user = await UserService.getUser(userId);
            setFetchedUser(user); // Set the user if found
            setSnackbarMessage("User found!");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error fetching user by ID:", error.message);
            setFetchedUser(null); // Clear any previously fetched user
            setSnackbarMessage(error.message); // Show appropriate error message
            setOpenSnackbar(true);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fetchedUser) {
            setSnackbarMessage("No user selected. Please search for a user first.");
            setOpenSnackbar(true);
            return;
        }

        try {
            // Step 1: Create the user as an organizer
            const newOrganizer = {
                user: { userID: fetchedUser.userID },
                approvalStatus: "Pending",
                datetimeApproved: null,
            };

            await OrganizerService.addOrganizer(newOrganizer);

            // Step 2: Update the user's account type to 'organizer'
            const updatedUser = {
                ...fetchedUser,
                accountType: "organizer",
            };

            await UserService.updateUser(fetchedUser.userID, updatedUser);

            setSnackbarMessage("User successfully added as an organizer!");
            setOpenSnackbar(true);
            onClose();
        } catch (error) {
            console.error("Error during organizer creation or user update:", error);
            setSnackbarMessage("Failed to create organizer or update user.");
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };

    return (
        <div className="add-organizer-modal">
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        backgroundColor: "#F3F3F3",
                        boxShadow: 24,
                        padding: 4,
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            textAlign: "left",
                        }}
                    >
                        <Typography variant="h6" component="h2">
                            Add an Organizer
                        </Typography>
                        <Typography variant="body2" color="textSecondary" style={{ marginBottom: 20 }}>
                            Search for a user and assign them as an organizer.
                        </Typography>

                        <TextField
                            label="User ID"
                            variant="outlined"
                            value={userId}
                            onChange={handleUserIdChange}
                            error={!!errors.userId}
                            helperText={errors.userId && "User ID is required"}
                            margin="normal"
                            fullWidth
                        />
                        <Button
                            onClick={fetchUserById}
                            variant="contained"
                            fullWidth
                            sx={{ marginTop: 2 }}
                        >
                            Search User
                        </Button>

                        {fetchedUser && (
                            <Box sx={{ marginTop: 3 }}>
                                <Typography variant="body1">
                                    <strong>Selected User:</strong>
                                </Typography>
                                <Typography variant="body2">
                                    Name: {fetchedUser.firstName} {fetchedUser.lastName}
                                </Typography>
                                <Typography variant="body2">
                                    Email: {fetchedUser.email}
                                </Typography>
                                <Typography variant="body2">
                                    Account Type: {fetchedUser.accountType}
                                </Typography>
                            </Box>
                        )}

                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginTop: 2 }}
                            disabled={!fetchedUser}
                        >
                            Save as Organizer
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />
        </div>
    );
}

export default AddOrganizerModal;
