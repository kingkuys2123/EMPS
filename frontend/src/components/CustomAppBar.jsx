import React, { useEffect, useState } from "react";
import { AppBar, Box, Toolbar, Typography, Menu, MenuItem, Switch, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../utils/AuthContext";
import UserService from "../services/UserService.jsx";
import OrganizerApplicationModal from "./user_pages/OrganizerApplicationModal.jsx";
import "./styles/FontStyle.css";
import { Link } from 'react-router-dom';

function CustomAppBar({ title, newProfilePicture }) {
    const nav = useNavigate();
    const { currentUser, toggleOrganizer, setToggleOrganizer } = getAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [profilePicture, setProfilePicture] = useState(() => {
        return localStorage.getItem('profilePicture') || '/assets/placeholders/avatar-photo-placeholder.png';
    });
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (path) => {
        handleCloseMenu();
        nav(path);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    useEffect(() => {
        if (currentUser) {
            UserService.getProfilePicture(currentUser.profilePicture)
                .then((url) => {
                    setProfilePicture(url);
                    localStorage.setItem('profilePicture', url);
                })
                .catch(() => {
                });
        }
    }, [currentUser]);

    return (
        <div>
            <AppBar className="custom-appbar" sx={{ backgroundColor: '#FFFFFF', color: 'black', boxShadow: 'none' }} position="static">
                <Box>
                    <Toolbar disableGutters sx={{ height: '80px' }}>
                        <Typography className="project-name" variant="h4" component="div" sx={{ flexGrow: 1, padding: "25px" }}>
                            <span>{title}</span>
                        </Typography>
                        {currentUser ? (
                            <>
                                {currentUser.accountType === "organizer" && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography>{toggleOrganizer ? "Organizer Mode" : "User Mode"}</Typography>
                                        <Switch
                                            checked={toggleOrganizer}
                                            onChange={() => {
                                                setToggleOrganizer(!toggleOrganizer);
                                                nav(toggleOrganizer ? '/home' : '/organizer/dashboard');
                                            }}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#C63F47',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(198, 63, 71, 0.08)',
                                                    },
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#C63F47',
                                                },
                                            }}
                                        />
                                    </Box>
                                )}
                                {currentUser.accountType === "user" && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Button sx={{ color: "maroon" }} onClick={handleOpenModal}>
                                            <Typography>BECOME AN ORGANIZER</Typography>
                                        </Button>
                                    </Box>
                                )}
                            </>
                        ): (
                            <></>
                        )}
                        <Box sx={{ padding: '25px' }}>
                            {currentUser ? (
                                <>
                                    <Button sx={{ borderRadius: '50%' }} onClick={handleOpenMenu} aria-haspopup="true" aria-expanded={Boolean(anchorEl) ? 'true' : 'false'}>
                                        <div style={{ width: '50px', height: '50px', overflow: 'hidden', borderRadius: '50%' }}>
                                            <img src={newProfilePicture ?? profilePicture} alt="profile-picture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    </Button>
                                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                                        <MenuItem onClick={() => handleMenuClick("/profile")}>
                                            <span>Profile</span>
                                        </MenuItem>
                                        <MenuItem onClick={() => handleMenuClick("/account")}>
                                            <span>My Account</span>
                                        </MenuItem>
                                        {currentUser.accountType !== "admin" && (
                                            <MenuItem onClick={() => handleMenuClick("/billing")}>
                                                <span>Billing</span>
                                            </MenuItem>
                                        )}
                                    </Menu>
                                </>
                            ) : (
                                <>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Box>
            </AppBar>
            <OrganizerApplicationModal open={modalOpen} handleClose={handleCloseModal} />
        </div>
    );
}

export default CustomAppBar;