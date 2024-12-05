import React, { useState } from "react";
import { Drawer, Box, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, AppBar } from "@mui/material";
import { useNavigate } from "react-router-dom";

import LoginModal from "../LoginModal.jsx";
import RegisterModal from "../RegisterModal.jsx";
import { getAuth } from "../../utils/AuthContext.jsx";

import '../styles/FontStyle.css';
import "../styles/Sidebar.css";
import ConfirmDialog from "../ConfirmDialog.jsx";

import { Link } from "react-router-dom";

function UserSidebar() {
    const nav = useNavigate();

    const { currentUser, setCurrentUser } = getAuth();
    const [openModal, setOpenModal] = useState(null);

    const { profilePicture, setProfilePicture } = getAuth();

    const [openConfirmLogoutDialog, setOpenConfirmLogoutDialog] = useState(false);

    const handleClickLogoutButton = () => {
        setOpenConfirmLogoutDialog(true);
    }

    const handleConfirmLogoutDialogClose = (confirm) => {
        if (confirm) {
            handleLogout();
        }
        setOpenConfirmLogoutDialog(false);
    };

    const handleLogout = () => {
        if (currentUser) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setCurrentUser(null);
            setProfilePicture(null);
            nav("/");
        }
    };

    const handleOpenModal = (modal) => {
        setOpenModal(modal);
    };

    const handleCloseModal = () => {
        setOpenModal(null);
    };

    return (
        <div className="user-side-bar">
            <Drawer
                sx={{
                    width: 200,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": { width: 200, boxSizing: "border-box", color: "#FFFFFF", backgroundColor: "#C63f47", overflow: "hidden" },
                }}
                variant="permanent"
                anchor="left"
            >
                <AppBar sx={{ backgroundColor: '#C63f47', color: '#000000', boxShadow: 'none' }} position="static">
                    <Box>
                        <Toolbar disableGutters sx={{ height: '80px', alignItems: 'center' }}>
                            <Typography variant="h6">
                                <Box sx={{ flex: 1, display: "flex", justifyContent: "center", overflow: "hidden", padding: "30px" }}>
                                    <Link to="/">
                                        <img className="drawer-wild-up-events-white" src="/assets/images/wild-up-events-white.png" alt="homepage-image" style={{width: '150px'}}/>
                                    </Link>
                                </Box>
                            </Typography>
                        </Toolbar>
                        <hr style={{ width: '100%', margin: '0 auto' }} />
                    </Box>
                </AppBar>
                <List sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <ListItem>
                        <ListItemButton component={Link} to="/home">
                            <ListItemText>
                                <span>HOME</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} to="/events">
                            <ListItemText>
                                <span>EVENTS</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    { currentUser ? (
                        <>
                            <ListItem>
                                <ListItemButton component={Link} to="/user/bookings">
                                    <ListItemText>
                                        <span>BOOKINGS</span>
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </>
                    ):(
                        <>
                        </>
                    )}
                    <hr style={{ width: '100%', margin: '0 auto', marginTop: 'auto' }} />
                    <ListItem>
                        {currentUser ? (
                            <ListItemButton onClick={handleClickLogoutButton} sx={{ paddingTop: '0', paddingBottom: '0' }}>
                                <ListItemText>
                                    <span>LOG OUT</span>
                                </ListItemText>
                            </ListItemButton>
                        ) : (
                            <ListItemButton onClick={() => handleOpenModal('loginModal')} sx={{ paddingTop: '0', paddingBottom: '0' }}>
                                <ListItemText>
                                    <span>LOG IN</span>
                                </ListItemText>
                            </ListItemButton>
                        )}
                    </ListItem>
                </List>
            </Drawer>

            <ConfirmDialog
                openDialog={openConfirmLogoutDialog}
                setOpenDialog={setOpenConfirmLogoutDialog}
                onClose={handleConfirmLogoutDialogClose}
                message={"Are you sure you want to log out?"}
                title={"Confirm Logout"}
            />

            <LoginModal open={openModal === 'loginModal'} onClose={handleCloseModal} switchModal={() => handleOpenModal('registerModal')} />
            <RegisterModal open={openModal === 'registerModal'} onClose={handleCloseModal} switchModal={() => handleOpenModal('loginModal')} label={"Register"} />
        </div>
    );
}

export default UserSidebar;
