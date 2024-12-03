import React, {useEffect, useState} from "react";
import { AppBar, Box, Button, Toolbar, Typography, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../utils/AuthContext";
import "./styles/FontStyle.css";
import UserService from "../services/UserService.jsx";

function CustomAppBar({ title, newProfilePicture }) {
    const nav = useNavigate();
    const { currentUser } = getAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const { profilePicture, setProfilePicture } = getAuth();

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

    return (
        <div>
            <AppBar className="custom-appbar" sx={{ backgroundColor: '#FFFFFF', color: 'black', boxShadow: 'none' }} position="static">
                <Box>
                    <Toolbar disableGutters sx={{ height: '80px' }}>
                        <Typography className="project-name" variant="h4" component="div" sx={{ flexGrow: 1, padding: "25px" }}>
                            <span>{title}</span>
                        </Typography>
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
                                        <MenuItem onClick={() => handleMenuClick("/my_account")}>
                                            <span>My Account</span>
                                        </MenuItem>
                                        <MenuItem onClick={() => handleMenuClick("/billing")}>
                                            <span>Billing</span>
                                        </MenuItem>
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
        </div>
    );
}

export default CustomAppBar;