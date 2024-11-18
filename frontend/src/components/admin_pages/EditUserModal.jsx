import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
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

function EditUserModal({ open, onClose, user, onSuccess }) {
    // Initialize local state with the passed user details
    const [accountType, setAccountType] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setAccountType(user.accountType || "");
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setPhoneNumber(user.phoneNumber || "");
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
        if (!firstName || !lastName || !accountType) {
            if (!accountType) validErrors.accountType = true;
            if (!firstName) validErrors.firstName = true;
            if (!lastName) validErrors.lastName = true;
            setErrors(validErrors);
            setSnackbarMessage("Please fill out all required fields.");
            setOpenSnackbar(true);
            return;
        }

        if (phoneNumber) {
            const phoneRegex = /^\d+$/;
            if (!phoneRegex.test(phoneNumber)) {
                validErrors.phoneNumber = true;
                setErrors(validErrors);
                setSnackbarMessage("Phone number must contain numbers only.");
                setOpenSnackbar(true);
                return;
            }
        }

        try {
            const updatedUser = {
                ...user,
                accountType,
                firstName,
                lastName,
                phoneNumber,
            };
            await UserService.updateProfile(user.userID, updatedUser);
            console.log(updatedUser);
            onSuccess(updatedUser);  // Inform the parent component of the successful update
            setSnackbarMessage("User updated successfully.");
            setOpenSnackbar(true);
            onClose(); // Close the modal after successful update
        } catch (e) {
            setSnackbarMessage("Failed updating user.");
            setOpenSnackbar(true);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal" error={!!errors.accountType}>
                    <InputLabel>Account Type</InputLabel>
                    <Select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        label="Account Type"
                    >
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="User">User</MenuItem>
                        <MenuItem value="Organizer">Organizer</MenuItem>
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
