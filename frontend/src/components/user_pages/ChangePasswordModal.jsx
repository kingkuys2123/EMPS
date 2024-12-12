import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

import CustomSnackbar from "../CustomSnackbar.jsx";
import UserService from "../../services/UserService.jsx";
import { getAuth } from "../../utils/AuthContext.jsx";

import "../styles/FontStyle.css";

function ChangePasswordModal({ open, onClose }) {
    const { currentUser, setCurrentUser } = getAuth();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [errors, setErrors] = useState({});

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpenSnackbar(false);
    };

    useEffect(() => {
        if (!open) {
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrors({});
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validErrors = {};

        if (!oldPassword) {
            validErrors.oldPassword = true;
            setSnackbarMessage("Please enter your current password.");
        }

        if (!newPassword) {
            validErrors.newPassword = true;
            setSnackbarMessage("Please enter a new password.");
        }
        else if (newPassword.length < 8) {
            validErrors.newPassword = true;
            setSnackbarMessage("New password must be at least 8 characters long.");
        }

        if (!confirmPassword) {
            validErrors.confirmPassword = true;
            setSnackbarMessage("Please confirm your new password.");
        }
        else if (newPassword !== confirmPassword) {
            validErrors.confirmPassword = true;
            setSnackbarMessage("Passwords do not match.");
        }

        if (Object.keys(validErrors).length > 0) {
            setErrors(validErrors);
            setOpenSnackbar(true);
            return;
        }

        await handleChangePassword();
    };

    const handleChangePassword = async () => {
        try {
            await UserService.changePassword(currentUser.userID, oldPassword, newPassword);
            const updatedUser = await UserService.getUser(currentUser.userID);

            localStorage.setItem("user", JSON.stringify(updatedUser));

            setSnackbarMessage("Password changed successfully.");
            setOpenSnackbar(true);
            onClose();
        } catch (error) {
            if(error){
                setSnackbarMessage(error);
                setOpenSnackbar(true);
            }
            else{
                setSnackbarMessage("Error changing password. Please try again.");
                setOpenSnackbar(true);
            }
        }
    };

    return (
        <div className="change-password-modal">
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 450,
                        height: "325px",
                        backgroundColor: "#F3F3F3",
                        boxShadow: 24,
                        padding: 4,
                        borderRadius: 5,
                    }}
                >
                    <Box sx={{ display: "flex", alignContent: "center", width: "100%" }}>
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
                                <span>Change Password</span>
                            </Typography>
                            <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Current Password"
                                    variant="outlined"
                                    value={oldPassword}
                                    error={!!errors.oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="New Password"
                                    variant="outlined"
                                    value={newPassword}
                                    error={!!errors.newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    margin="normal"
                                />
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Confirm Password"
                                    variant="outlined"
                                    value={confirmPassword}
                                    error={!!errors.confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    margin="normal"
                                />
                                <Box sx={{ display: "flex", marginTop: "10px", gap: "10px" }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            sx={{ backgroundColor: "#7F7F7F", borderRadius: 0 }}
                                            onClick={onClose}
                                        >
                                            <span>Cancel</span>
                                        </Button>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            sx={{ backgroundColor: "#C63f47", borderRadius: 0 }}
                                            type="submit"
                                        >
                                            <span>Submit</span>
                                        </Button>
                                    </Box>
                                </Box>
                            </form>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                onClose={handleCloseSnackbar}
            />
        </div>
    );
}

export default ChangePasswordModal;
