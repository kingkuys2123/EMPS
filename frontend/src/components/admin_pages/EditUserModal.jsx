import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import CustomSnackbar from "../CustomSnackbar.jsx";
import UserService from "../../services/UserService.jsx";
import OrganizerService from "../../services/OrganizerService.jsx"

function EditUserModal({ open, onClose, user, onSuccess }) {
    // Initialize local state with the passed user details
    const [accountType, setAccountType] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUserName] = useState(""); 
    const [dateTimeCreated, setDateTimeCreated] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            // Ensure all fields are properly initialized
            console.log("User passed to modal:", user); // Add this to inspect the data
            setAccountType(user.accountType || "");
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setPhoneNumber(user.phoneNumber || "");
            setEmail(user.email || "");   
            setPassword(user.password || "");
            setUserName(user.username || ""); 
            setDateTimeCreated(user.dateTimeCreated || "");
        }
    }, [user]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validErrors = {};
    
        // Validate required fields
        if (!firstName || !lastName || !accountType) {
            if (!accountType) validErrors.accountType = true;
            if (!firstName) validErrors.firstName = true;
            if (!lastName) validErrors.lastName = true;
    
            setErrors(validErrors);
            setSnackbarMessage("Please fill out all required fields.");
            setOpenSnackbar(true);
            return;
        }
    
        // Validate phone number
        if (phoneNumber) {
            const phoneRegex = /^\d+$/; // Regex for numeric values only
            if (!phoneRegex.test(phoneNumber)) {
                validErrors.phoneNumber = true;
                setErrors(validErrors);
                setSnackbarMessage("Phone number must contain numbers only.");
                setOpenSnackbar(true);
                return;
            }
        }
    
        try {
            // Prepare the updated user object
            const updatedUser = {
                ...user,
                firstName,
                lastName,
                phoneNumber,
                email,
                password,
                username,
                dateTimeCreated,
                accountType,
            };
    
            // Create a new organizer only if accountType is 'organizer' and was not already set
            if (accountType === 'organizer' && user.accountType !== 'organizer') {
                const newOrganizer = {
                    user: { userID: user.userID },
                    approvalStatus: 'approved',
                };
                
    
                console.log("Organizer Data Sent to API:", newOrganizer);
                await OrganizerService.addOrganizer(newOrganizer);
                console.log("New organizer created", newOrganizer);
            }
    
            // Update user details
            await UserService.updateUser(user.userID, updatedUser);
            onSuccess(updatedUser); // Notify parent component of success
    
            // Show success feedback
            setSnackbarMessage("User updated successfully.");
            setOpenSnackbar(true);
            onClose(); // Close the modal or form
        } catch (error) {
            // Log the error for debugging
            console.error("Error updating user:", error);
    
            // Show error feedback
            setSnackbarMessage("Failed updating user.");
            setOpenSnackbar(true);
        }
    };
   

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Account Type</InputLabel>
                    <Select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        label="Account Type"
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="organizer">Organizer</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    margin="normal"
                    value={firstName}
                    error={!!errors.firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    margin="normal"
                    value={lastName}
                    error={!!errors.lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    margin="normal"
                    value={phoneNumber}
                    error={!!errors.phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    error={!!errors.email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    value={username}
                    error={!!errors.username}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">
                    Save Changes
                </Button>
            </DialogActions>
            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                onClose={handleCloseSnackbar}
            />
        </Dialog>
    );
}

export default EditUserModal;
