import React, {useEffect, useState} from "react";
import { Modal, Box, Typography, TextField, Button, Link } from "@mui/material";
import "./styles/FontStyle.css";
import CustomSnackbar from "./CustomSnackbar.jsx";
import UserService from "../services/UserService.jsx";
import {useNavigate} from "react-router-dom";

function LoginModal({ open, onClose, switchModal, propSetUser }) {
    const nav = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [errors, setErrors] = useState({});

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    }

    useEffect(() => {
        if(!open){
            setUsername('');
            setPassword('');
            setErrors({});
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validErrors = {};

        if (!username && !password) {
            if (!username) validErrors.username = true;
            if (!password) validErrors.password = true;

            setErrors(validErrors);
            setSnackbarMessage('Please enter your username and password.');
            setOpenSnackbar(true);
            return false;
        }
        if (!username) {
            if (!username) validErrors.username = true;

            setErrors(validErrors);
            setSnackbarMessage('Please enter your username.');
            setOpenSnackbar(true);
            return false;
        }
        if (!password) {
            if (!username) validErrors.username = true;
            if (!password) validErrors.password = true;

            setErrors(validErrors);
            setSnackbarMessage('Please enter your password.');
            setOpenSnackbar(true);
            return false;
        }

        await handleLogin();
    };

    const handleLogin = async () => {
        try {
            const response = await UserService.loginUser(username, password);
            const { user, token } = response;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            if (typeof propSetUser === 'function') {
                propSetUser(user);
            }

            setSnackbarMessage('Login successful!');
            setOpenSnackbar(true);

            if (window.location.pathname !== "/home") {
                nav("/home");
            } else {
                onClose();
            }
        }
        catch (e) {
            setSnackbarMessage(e);
            setOpenSnackbar(true);
        }
    };


    return (
        <div className="login-modal">
            <Modal open={open} onClose={onClose}>
                <Box sx={{ flex: 1, display: 'flex', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 750, height: '450px', backgroundColor: '#F3F3F3', boxShadow: 24, padding: 4 }}>
                    <Box sx={{ display: 'flex', alignContent: 'center', width: '100%' }}>
                        <Box sx={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img className="login-modal-logo" src='/assets/images/login-modal-image.png' alt="homepage-image"/>
                        </Box>

                        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                            <Typography variant="h6" component="h2">
                                <span>Log In</span>
                            </Typography>

                            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                                <TextField fullWidth label="Username" variant="outlined" value={username} error={!!errors.username} onChange={(e) => setUsername(e.target.value)} margin="normal"/>
                                <TextField fullWidth label="Password" type="password" variant="outlined" value={password} error={!!errors.password} onChange={(e) => setPassword(e.target.value)} margin="normal"/>

                                <Button type="submit" fullWidth variant="contained" sx={{ marginTop: 2, backgroundColor: '#C63f47', borderRadius: 0 }}>
                                    <span>Login</span>
                                </Button>
                            </form>

                            <Box sx={{ textAlign: 'center', marginTop: '10px', cursor: 'pointer' }}>
                              <span>
                                Don't have an account? <Link onClick={switchModal}>Sign Up</Link>
                              </span>
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </Modal>
            <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar}/>
        </div>
    );
}

export default LoginModal;
