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

function Billing() {
    const nav = useNavigate();
    const { currentUser, setCurrentUser } = getAuth();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [errors, setErrors] = useState({});

    const [openConfirmDeleteUserDialog, setOpenConfirmDeleteUserDialog] = useState(false);

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
            setErrors({});
        }
    }, []);


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

                    <CustomAppBar title={"Billing"}/>

                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Box sx={{ backgroundColor: "#FFFFFF", width: "100%", height: "100%", boxShadow: "5px 5px 5px #aaaaaa", position: "relative", overflowY: "auto" }}>
                            <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, height: "95%" }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1 }}>
                                    <Box sx={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ marginBottom: '20px' }}>
                                            <Typography sx={{ color: "#7F7F7F", marginTop: '10px' }}>
                                                You can add your payment details either GCash or Credit card and manage them like edit them or delete them.
                                            </Typography>
                                            <Typography sx={{ color: "#7F7F7F", marginTop: '10px' }}>
                                                Please note that deleting your payment details is irreversible and all your data will be permanently lost.
                                            </Typography>
                                        </Box>
                                        <Box sx={{ marginBottom: '20px' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#333" }}>
                                                Your Payment Details
                                            </Typography>
                                            <Typography sx={{ color: "#7F7F7F" }}>
                                                Add, update or remove your payment method and details.
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                            ADD REMOVE OR UPDATE PAYMENT DETAILS
                                        </Box>
                                        <Box sx={{ marginBottom: '20px' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: "#333" }}>
                                                Transaction History
                                            </Typography>
                                            <Typography sx={{ color: "#7F7F7F" }}>
                                                Listed here is your transaction history.
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                            SHOW PAYED BOOKINGS DIRI
                                        </Box>
                                    </Box>

                                    <Box sx={{ width: '48%', display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{padding: 2, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            <img src="/assets/images/extras/extra-people-dance-4.png" alt="People Dancing" style={{borderRadius: '10px', maxWidth: '100%', height: 'auto'}} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

            </Box>

            <CustomSnackbar open={openSnackbar} message={snackbarMessage} onClose={handleCloseSnackbar} />
        </div>
    );
}

export default Billing;
