import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, TextField, Button, Link } from "@mui/material";

import CustomSnackbar from "../CustomSnackbar.jsx";
import UserService from "../../services/UserService.jsx";

import '../styles/FontStyle.css'

function RegisterModal({ open, onClose, switchModal, label }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!open) {
            setFirstName('');
            setLastName('');
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setErrors({});
        }
    }, [open]);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validErrors = {};

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            if (!firstName) validErrors.firstName = true;
            if (!lastName) validErrors.lastName = true;
            if (!email) validErrors.email = true;
            if (!username) validErrors.username = true;
            if (!password) validErrors.password = true;
            if (!confirmPassword) validErrors.confirmPassword = true;

            setErrors(validErrors);
            setSnackbarMessage('Please fill out all fields.');
            setOpenSnackbar(true);
            return;
        }

        if (!emailRegex.test(email)) {
            validErrors.email = true;
            setErrors(validErrors);
            setSnackbarMessage('Invalid email address.');
            setOpenSnackbar(true);
            return;
        }

        if (password !== confirmPassword) {
            validErrors.password = true;
            validErrors.confirmPassword = true;
            setErrors(validErrors);
            setSnackbarMessage('Passwords do not match!');
            setOpenSnackbar(true);
            return;
        }

        await handleRegister();
    };

    const handleRegister = async () => {
        try {
            await UserService.registerUser({ firstName, lastName, username, email, password });
            setSnackbarMessage('Registration successful!');
            setOpenSnackbar(true);
            onClose();
        }
        catch (e) {
            const validErrors = {};

            if (e === 'Username already taken!') {
                validErrors.username = true;
                setErrors(validErrors);

                setSnackbarMessage(e);
                setOpenSnackbar(true);
            } else if (e === 'Email already taken!') {
                validErrors.email = true;
                setErrors(validErrors);

                setSnackbarMessage(e);
                setOpenSnackbar(true);
            } else {
                setSnackbarMessage('An unexpected error occurred. Please try again.');
                setOpenSnackbar(true);
            }
        }
    }

    return (
        <div className="register-modal">
            <Modal open={open} onClose={onClose}>
                <Box sx={{ flex: 1, display: 'flex', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 750, height: '500px', backgroundColor: '#F3F3F3', boxShadow: 24, padding: 4}}>
                    <Box sx={{ display: 'flex', alignContent: 'center' }}>
                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                            <Typography variant="h6" component="h2">
                                <span>{label}</span>
                            </Typography>

                            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                                <Box sx={{ flex: 1,  display: 'flex',  flexDirection: 'row', justifyContent: 'center', gap: 2, width: '100%' }}>
                                    <Box sx={{ flex: 1 }}>
                                        <TextField label="First Name" fullWidth variant="outlined" value={firstName} error={!!errors.firstName} onChange={(e) => setFirstName(e.target.value)}/>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <TextField label="Last Name" fullWidth variant="outlined" value={lastName} error={!!errors.lastName} onChange={(e) => setLastName(e.target.value)}/>
                                    </Box>
                                </Box>
                                <TextField fullWidth label="Username" variant="outlined" value={username} error={!!errors.username} onChange={(e) => setUsername(e.target.value)} margin="normal"/>
                                <TextField fullWidth label="Email" variant="outlined" value={email} error={!!errors.email} onChange={(e) => setEmail(e.target.value)} margin="normal"/>
                                <TextField fullWidth label="Password" type="password" variant="outlined" value={password} error={!!errors.password} onChange={(e) => setPassword(e.target.value)} margin="normal"/>
                                <TextField fullWidth label="Confirm Password" type="password" variant="outlined" value={confirmPassword} error={!!errors.confirmPassword} onChange={e => setConfirmPassword(e.target.value)} margin="normal"/>

                                <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: '#C63f47', borderRadius: 0 }}>
                                    <span>Add User</span>
                                </Button>
                            </form>
                        </Box>
                        <Box sx={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img className="register-modal-logo" src='/assets/images/register-modal-image.png' alt="homepage-image"/>
                        </Box>
                    </Box>
                </Box>
            </Modal>
            <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar}/>
        </div>
    );
}

export default RegisterModal;
