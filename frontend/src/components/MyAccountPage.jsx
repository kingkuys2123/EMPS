import './styles/FontStyle.css';
import {Box, Button, TextField, Typography} from "@mui/material";
import UserSideBar from "./UserSideBar.jsx";
import PageAppBar from "./PageAppBar.jsx";
import './styles/FontStyle.css';
import React, {useEffect, useState} from "react";
import UserService from "../services/UserService.jsx";
import CustomSnackbar from "./CustomSnackbar.jsx";
import {useNavigate} from "react-router-dom";

function MyAccountPage() {
    const nav = useNavigate();

    const [currentUser, setCurrentUser] = React.useState({});

    const [username, setUsername] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [email, setEmail] = React.useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [errors, setErrors] = React.useState({});

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    }

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            setCurrentUser(user);
            setUsername(user.username || '');
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setPhoneNumber(user.phoneNumber || '');
            setEmail(user.email || '');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validErrors = {};

        if (!firstName || !lastName || !email ) {
            if (!username) validErrors.username = true;
            if (!firstName) validErrors.firstName = true;
            if (!lastName) validErrors.lastName = true;
            // if (!phoneNumber) validErrors.phoneNumber = true;

            setErrors(validErrors);
            setSnackbarMessage('Please type in all fields.');
            setOpenSnackbar(true);
            return;
        }

        if (phoneNumber) {
            const phoneRegex = /^\d+$/;

            if (!phoneRegex.test(phoneNumber)) {
                validErrors.phoneNumber = true;
                setErrors(validErrors);
                setSnackbarMessage('Phone number must be numbers.');
                setOpenSnackbar(true);
                return;
            }
        }

        await handleUpdateUser();

    };

    const handleUpdateUser = async () => {
        try {
            await UserService.updateProfile(currentUser.userID, { username, firstName, lastName, phoneNumber });

            const updatedUser = { ...currentUser, username, firstName, lastName, phoneNumber };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setSnackbarMessage('User updated successfully.');
            setOpenSnackbar(true);
        } catch (e) {
            setSnackbarMessage(e.message || 'Failed updating user.');
            setOpenSnackbar(true);
        }
    }

    const handleDeleteUser = async () => {
        try{
            await UserService.deleteUser(currentUser.userID);

            setSnackbarMessage('User deleted successfully.');
            setOpenSnackbar(true);

            localStorage.removeItem('token');
            localStorage.removeItem("user");

            nav("/");
        }
        catch(e){
            setSnackbarMessage(e);
            setOpenSnackbar(true);
        }
    }

    const handleChangeEmail = async () => {

    }

    const handleChangePassword = async () => {

    }

    return (
            <Box sx={{ display: "flex" }}>

                <UserSideBar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    <PageAppBar title={"My Account"}/>

                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Box sx={{ backgroundColor: "#FFFFFF", width: "100%", height: "100%", boxShadow: "5px 5px 5px #aaaaaa", position: "relative", overflowY: "auto" }}>
                            <Box sx={{ padding: '25px', display: 'flex' }}>
                                <img src="/assets/placeholders/avatar-photo-placeholder.png" alt="profile-picture" style={{ width: '100px', height: '100px', borderRadius: '50%' }}/>
                                <Box sx={{ paddingLeft: "15px", flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                                    <Box sx={{ fontWeight: 'bold' }}>
                                        <span>Profile Picture</span>
                                    </Box>
                                    <Box sx={{ color: "#7F7F7F" }}>
                                        <span>PNG, JPEG under 15MB</span>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                                    <Box>
                                        <Button variant="contained" sx={{ backgroundColor: "#C63f47", color: "#FFFFFF", textTransform: 'none', borderRadius: "0" }}>
                                            <Typography>
                                                <span>Upload a new picture</span>
                                            </Typography>
                                        </Button>
                                        <Button variant="contained" sx={{ marginLeft: '10px', backgroundColor: "#CFCFC4", color: "#FFFFFF", textTransform: 'none', borderRadius: "0" }}>
                                            <Typography>
                                                <span>Delete</span>
                                            </Typography>
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                                        <Typography component="span" sx={{ fontWeight: "bold" }}>
                                            <span>Username</span>
                                        </Typography>
                                        <TextField fullWidth label="Username" variant="outlined" margin="normal" value={username} error={!!errors.username} onChange={(e) => setUsername(e.target.value)} />

                                        <Typography component="span" sx={{ fontWeight: "bold" }}>
                                            <span>Full Name</span>
                                        </Typography>
                                        <TextField fullWidth label="First Name" variant="outlined" margin="normal" value={firstName} error={!!errors.firstName} onChange={(e) => setFirstName(e.target.value)}/>

                                        <Typography component="span" sx={{ fontWeight: "bold" }}>
                                            <span>Last Name</span>
                                        </Typography>
                                        <TextField fullWidth label="Last Name" variant="outlined" margin="normal" value={lastName} error={!!errors.lastName} onChange={(e) => setLastName(e.target.value)}/>

                                        <Typography component="span" sx={{ fontWeight: "bold" }}>
                                            <span>Phone Number</span>
                                        </Typography>
                                        <TextField fullWidth label="Phone Number" variant="outlined" margin="normal" value={phoneNumber} error={!!errors.phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                                    </Box>

                                    <Box sx={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                                        <Typography component="span" sx={{ fontWeight: "bold" }}>
                                            <span>Email</span>
                                        </Typography>
                                        <TextField fullWidth disabled label="Email" variant="outlined" margin="normal" value={email}/>

                                        <Typography component="span" sx={{ fontWeight: "bold" }}>
                                            <span>Password</span>
                                        </Typography>
                                        <TextField fullWidth disabled label="Password" type="password" value="nothingtoseehere" variant="outlined" margin="normal" />
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '20px 0' }}>
                                    <Box sx={{ display: 'flex', paddingTop: '20px' }}>
                                        <Button variant="contained" onClick={handleSubmit} sx={{ width: "100%", backgroundColor: "#C63f47", color: "#FFFFFF", textTransform: 'none', borderRadius: "0", marginRight: '10px' }}>
                                            <Typography>
                                                <span>Save Changes</span>
                                            </Typography>
                                        </Button>
                                        <Button variant="contained" onClick={handleDeleteUser} sx={{ width: "100%", backgroundColor: "#C63f47", color: "#FFFFFF", textTransform: 'none', borderRadius: "0" }}>
                                            <Typography>
                                                <span>Delete Account</span>
                                            </Typography>
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                </Box>

                <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar}/>
            </Box>
    );
}

export default MyAccountPage;