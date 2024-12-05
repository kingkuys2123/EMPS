import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import UserSidebar from "./user_pages/UserSidebar.jsx";
import CustomAppBar from "./CustomAppBar.jsx";
import CustomSnackbar from "./CustomSnackbar.jsx";
import UserService from "../services/UserService.jsx";
import { getAuth } from "../utils/AuthContext.jsx";

import './styles/FontStyle.css';
import ConfirmDialog from "./ConfirmDialog.jsx";
import AdminSidebar from "./admin_pages/AdminSidebar.jsx";
import OrganizerSidebar from "./organizer_pages/OrganizerSidebar.jsx";

function Profile() {
    const nav = useNavigate();
    const { currentUser, setCurrentUser, displayPicture } = getAuth();

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');

    const { profilePicture, setProfilePicture } = getAuth();

    const [newProfilePicture, setNewProfilePicture] = useState(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [errors, setErrors] = useState({});

    const [openConfirmChangesDialog, setOpenConfirmChangesDialog] = useState(false);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    useEffect(() => {
        if (!currentUser) {
            nav("/");
        } else {
            setUsername(currentUser.username);
            setFirstName(currentUser.firstName);
            setLastName(currentUser.lastName);
            setPhoneNumber(currentUser.phoneNumber);
            setEmail(currentUser.email);
            setErrors({});
        }
    }, [currentUser, nav]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validErrors = {};

        if (!firstName || !lastName || !email ) {
            if (!firstName) validErrors.firstName = true;
            if (!lastName) validErrors.lastName = true;

            setErrors(validErrors);
            setSnackbarMessage('Please fill out all required fields.');
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

        setOpenConfirmChangesDialog(true);
    };

    const handleUpdateUser = async () => {
        try {
            await UserService.updateProfile(currentUser.userID, { firstName, lastName, phoneNumber });
            const updatedUser = { ...currentUser, firstName, lastName, phoneNumber };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);

            setSnackbarMessage('User updated successfully.');
            setOpenSnackbar(true);
            setErrors({});
        } catch (e) {
            setSnackbarMessage(e.message || 'Failed updating user.');
            setOpenSnackbar(true);
        }
    };

    const handleConfirmChangesDialogClose = (confirm) => {
        if (confirm) {
            handleUpdateUser();
        }
        setOpenConfirmChangesDialog(false);
    };

    const Sidebars = {
        user: <UserSidebar />,
        admin: <AdminSidebar />,
        organizer: <OrganizerSidebar />
    };

    const handleProfilePictureChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSize = 15 * 1024 * 1024; // 15MB in bytes
            if (file.size > maxSize) {
                setSnackbarMessage('File size must be under 15MB.');
                setOpenSnackbar(true);
                return;
            }
            const newProfilePictureUrl = URL.createObjectURL(file);
            setNewProfilePicture(newProfilePictureUrl);
            try {
                const updatedUser = await UserService.uploadProfilePicture(currentUser.userID, file);
                setCurrentUser(updatedUser);
                setSnackbarMessage('Profile picture updated successfully.');
                setOpenSnackbar(true);
            } catch (error) {
                setSnackbarMessage(error.message || 'Failed to upload profile picture.');
                setOpenSnackbar(true);
            }
        }
    };

    return (
        <div className="my-account-page">
            <Box sx={{ display: "flex" }}>

                {Sidebars[currentUser.accountType] || null}

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    <CustomAppBar title={"Profile"} newProfilePicture={newProfilePicture} />

                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Box sx={{ backgroundColor: "#FFFFFF", width: "100%", height: "100%", boxShadow: "5px 5px 5px #aaaaaa", position: "relative", overflowY: "auto" }}>
                            <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, height: "95%" }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1 }}>
                                    <Box sx={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ padding: '25px', display: 'flex' }}>
                                            <div style={{
                                                width: '100px',
                                                height: '100px',
                                                overflow: 'hidden',
                                                borderRadius: '50%'
                                            }}>
                                                <img
                                                    src={newProfilePicture ?? displayPicture}
                                                    alt="profile-picture"
                                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                                />
                                            </div>
                                            <Box sx={{
                                                paddingLeft: "15px",
                                                flexGrow: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                textAlign: 'left'
                                            }}>
                                                <Box sx={{ fontWeight: 'bold' }}>
                                                    <span>Profile Picture</span>
                                                </Box>
                                                <Box sx={{ color: "#7F7F7F" }}>
                                                    <span>PNG, JPEG under 15MB</span>
                                                </Box>
                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                textAlign: 'left'
                                            }}>
                                                <Box>
                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                        sx={{
                                                            backgroundColor: "#C63f47",
                                                            color: "#FFFFFF",
                                                            textTransform: 'none',
                                                            borderRadius: "0"
                                                        }}
                                                    >
                                                        <Typography>
                                                            <span>Upload a new picture</span>
                                                        </Typography>
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept="image/png, image/jpeg"
                                                            onChange={handleProfilePictureChange}
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            marginLeft: '10px',
                                                            backgroundColor: "#CFCFC4",
                                                            color: "#FFFFFF",
                                                            textTransform: 'none',
                                                            borderRadius: "0"
                                                        }}
                                                    >
                                                        <Typography>
                                                            <span>Delete</span>
                                                        </Typography>
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Typography component="span" sx={{ fontWeight: "bold" }}>
                                            <span>Username</span>
                                        </Typography>
                                        <Typography sx={{ color: "#7F7F7F", marginBottom: '10px' }}>
                                            Your desired username. This will be visible to other users.
                                        </Typography>
                                        <TextField fullWidth label="Username" variant="outlined" margin="normal"
                                                   value={username} error={!!errors.username}
                                                   onChange={(e) => setUsername(e.target.value)} disabled />

                                        <Typography component="span" sx={{ fontWeight: "bold" }}>
                                            <span>Full Name</span>
                                        </Typography>
                                        <Typography sx={{ color: "#7F7F7F", marginBottom: '10px' }}>
                                            Your first and last name. This information will be used for your profile.
                                        </Typography>
                                        <TextField fullWidth label="First Name" variant="outlined" margin="normal" value={firstName} error={!!errors.firstName} onChange={(e) => setFirstName(e.target.value)} />
                                        <TextField fullWidth label="Last Name" variant="outlined" margin="normal" value={lastName} error={!!errors.lastName} onChange={(e) => setLastName(e.target.value)} />

                                        <Typography component="span" sx={{ fontWeight: "bold" }}>
                                            <span>Phone Number</span>
                                        </Typography>
                                        <Typography sx={{ color: "#7F7F7F", marginBottom: '10px' }}>
                                            Your phone number. This will be used for direct contact.
                                        </Typography>
                                        <TextField fullWidth label="Phone Number" variant="outlined" margin="normal" value={phoneNumber} error={!!errors.phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

                                        <Button variant="contained" onClick={handleSubmit} sx={{ width: "100%", backgroundColor: "#C63f47", color: "#FFFFFF", textTransform: 'none', borderRadius: "0", marginRight: '10px', marginTop: '25px' }}>
                                            <Typography>
                                                <span>Save Changes</span>
                                            </Typography>
                                        </Button>
                                    </Box>

                                    <Box sx={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{padding: 2, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <img src="/assets/images/extras/extra-people-dance-5.png" alt="People Dancing" style={{borderRadius: '10px', maxWidth: '100%', height: 'auto'}} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

            </Box>

            <ConfirmDialog
                openDialog={openConfirmChangesDialog}
                setOpenDialog={setOpenConfirmChangesDialog}
                onClose={handleConfirmChangesDialogClose}
                message={"Are you sure you want to save changes?"}
                title={"Confirm Changes"}
            />

            <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />
        </div>
    );
}

export default Profile;