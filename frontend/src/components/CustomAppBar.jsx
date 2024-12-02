import React, { useState } from "react";
import { AppBar, Box, Button, Toolbar, Typography, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../utils/AuthContext";
import "./styles/FontStyle.css";

function CustomAppBar({ title }) {
    const nav = useNavigate();
    const { currentUser } = getAuth();
    const [anchorEl, setAnchorEl] = useState(null);

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
                                        <img src="/assets/placeholders/avatar-photo-placeholder.png" alt="profile-picture" style={{ width: '50px', height: '50px', borderRadius: '50%' }}/>
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