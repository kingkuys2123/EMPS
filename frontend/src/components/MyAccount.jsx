import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import UserSidebar from "./user_pages/UserSidebar.jsx";
import CustomAppBar from "./CustomAppBar.jsx";
import CustomSnackbar from "./CustomSnackbar.jsx";
import UserService from "../services/UserService.jsx";
import { getAuth } from "../utils/AuthContext.jsx";
import ChangeEmailModal from "./user_pages/ChangeEmailModal.jsx";
import ChangePasswordModal from "./user_pages/ChangePasswordModal.jsx";

import './styles/FontStyle.css';
import ConfirmDialog from "./ConfirmDialog.jsx";
import AdminSidebar from "./admin_pages/AdminSidebar.jsx";
import OrganizerSidebar from "./organizer_pages/OrganizerSidebar.jsx";

function MyAccount() {
    const nav = useNavigate();
    const { currentUser, setCurrentUser } = getAuth();
    const { profilePicture, setProfilePicture } = getAuth();

    const [email, setEmail] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [errors, setErrors] = useState({});

    const [openConfirmDeleteUserDialog, setOpenConfirmDeleteUserDialog] = useState(false);

    const [openChangeEmailModal, setOpenChangeEmailModal] = useState(false);
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

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
            setEmail(currentUser.email);
            setErrors({});
        }
    }, []);

    const handleClickDeleteAccount = () => {
        setOpenConfirmDeleteUserDialog(true);
    }

    const handleChangeEmail = () => {
        setOpenChangeEmailModal(true);
    }

    const handleChangePassword = () => {
        setOpenChangePasswordModal(true);
    }

    const handleDeleteUser = async () => {
        try {
            await UserService.deleteUser(currentUser.userID);

            setSnackbarMessage('User deleted successfully.');
            setOpenSnackbar(true);

            localStorage.removeItem('token');
            localStorage.removeItem("user");
            setCurrentUser(null);
            setProfilePicture(null);

            nav("/");
        } catch (e) {
            setSnackbarMessage(e);
            setOpenSnackbar(true);
        }
    };

    const handleConfirmDeleteUserClose = (confirm) => {
        if (confirm) {
            handleDeleteUser();
        }
        setOpenConfirmDeleteUserDialog(false);
    };

    const Sidebars = {
        user: <UserSidebar />,
        admin: <AdminSidebar />,
        organizer: <OrganizerSidebar />
    };

    return (
        <div className="my-account-page">
            <Box sx={{ display: "flex" }}>

                {Sidebars[currentUser.accountType] || null}

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>

                    <CustomAppBar title={"My Account"}/>

                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Box sx={{ backgroundColor: "#FFFFFF", width: "100%", height: "100%", boxShadow: "5px 5px 5px #aaaaaa", position: "relative", overflowY: "auto" }}>
                            <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, height: "95%" }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1 }}>
                                    <Box sx={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ marginBottom: '20px' }}>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: "#333" }}>
                                                Settings
                                            </Typography>
                                            <Typography sx={{ color: "#7F7F7F", marginTop: '10px' }}>
                                                Manage your personal information, update your email address, and change your password to ensure your account remains secure. You can also delete your account if you no longer wish to use our services.
                                            </Typography>
                                            <Typography sx={{ color: "#7F7F7F", marginTop: '10px' }}>
                                                Please note that deleting your account is irreversible and all your data will be permanently lost. Use the options provided to make any necessary changes to your account settings.
                                            </Typography>
                                        </Box>
                                        <Box sx={{ marginBottom: '20px' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#333" }}>
                                                Email Address
                                            </Typography>
                                            <Typography sx={{ color: "#7F7F7F" }}>
                                                Update the email associated with your account to stay connected.
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                            <TextField
                                                fullWidth
                                                disabled
                                                label="Email"
                                                variant="outlined"
                                                margin="normal"
                                                value={email}
                                                sx={{ flexGrow: 1 }}
                                            />
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: "#C63f47", color: "white", textTransform: 'none', borderRadius: "0", marginLeft: '10px', height: '70%' }}
                                                onClick={handleChangeEmail}
                                            >
                                                <Typography>Change</Typography>
                                            </Button>
                                        </Box>
                                        <Box sx={{ marginBottom: '20px' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#333" }}>
                                                Password and Authentication
                                            </Typography>
                                            <Typography sx={{ color: "#7F7F7F" }}>
                                                Secure your account by updating your password.
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                            <TextField
                                                fullWidth
                                                disabled
                                                label="Password"
                                                type="password"
                                                value="nothingtoseehere"
                                                variant="outlined"
                                                margin="normal"
                                                sx={{ flexGrow: 1 }}
                                            />
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: "#C63f47", color: "white", textTransform: 'none', borderRadius: "0", marginLeft: '10px', height: '70%' }}
                                                onClick={handleChangePassword}
                                            >
                                                <Typography>Change</Typography>
                                            </Button>
                                        </Box>
                                        <Box sx={{ marginBottom: '20px' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#333" }}>
                                                Account Removal
                                            </Typography>
                                            <Typography sx={{ color: "#7F7F7F" }}>
                                                Permanently delete your account. This action is irreversible, and all your data will be lost.
                                            </Typography>
                                        </Box>
                                        <Button variant="contained" onClick={handleClickDeleteAccount} sx={{ width: "100%", backgroundColor: "#C63f47", color: "#FFFFFF", textTransform: 'none', borderRadius: "0" }}>
                                            <Typography>
                                                <span>Delete Account</span>
                                            </Typography>
                                        </Button>
                                    </Box>

                                    <Box sx={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{padding: 2, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <img src="/assets/images/extras/extra-people-dance-6.png" alt="People Dancing" style={{borderRadius: '10px', maxWidth: '100%', height: 'auto'}} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

            </Box>

            <ConfirmDialog
                openDialog={openConfirmDeleteUserDialog}
                setOpenDialog={setOpenConfirmDeleteUserDialog}
                onClose={handleConfirmDeleteUserClose}
                message={"Are you sure you want to delete your account?"}
                title={"Confirm Delete Account"}
            />

            <ChangeEmailModal
                open={openChangeEmailModal}
                onClose={() => setOpenChangeEmailModal(false)}
                oldEmail={setEmail}
            />

            <ChangePasswordModal
                open={openChangePasswordModal}
                onClose={() => setOpenChangePasswordModal(false)}
            />

            <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />
        </div>
    );
}

export default MyAccount;
