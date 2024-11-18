import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

import CustomSnackbar from "../CustomSnackbar.jsx";
import UserService from "../../services/UserService.jsx";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../utils/AuthContext.jsx";

import "../styles/FontStyle.css";

function ChangeEmailModal({ open, onClose }) {
    const nav = useNavigate();

    const { currentUser, setCurrentUser } = getAuth();

    const [email, setEmail] = useState("");

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
            setEmail("");
            setErrors({});
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validErrors = {};

        if (!email) {
            validErrors.email = true;
            setErrors(validErrors);
            setSnackbarMessage("Please enter your email.");
            setOpenSnackbar(true);
            return false;
        }

        if (!emailRegex.test(email)) {
            validErrors.email = true;
            setErrors(validErrors);
            setSnackbarMessage('Invalid email address.');
            setOpenSnackbar(true);
            return;
        }

        await handleChangeEmail();
    };

    const handleChangeEmail = async () => {
    };

    return (
        <div className="change-email-modal">
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
                        height: "200px",
                        backgroundColor: "#F3F3F3",
                        boxShadow: 24,
                        padding: 3,
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
                                <span>Change Email</span>
                            </Typography>
                            <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
                                <TextField
                                    fullWidth
                                    label="New Email"
                                    variant="outlined"
                                    value={email}
                                    error={!!errors.email}
                                    onChange={(e) => setEmail(e.target.value)}
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

export default ChangeEmailModal;
