import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    AppBar,
    Link
} from "@mui/material";
import React, {useContext, useState} from "react";
import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../utils/AuthContext.jsx";
import ConfirmDialog from "../ConfirmDialog.jsx";

function AdminSidebar() {
    const nav = useNavigate();

    const { currentUser, setCurrentUser } = getAuth();

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
            nav("/");
        }
    };

    const handleNavigation = (path) => {
        nav(path);
    };

    return (
        <div className="admin-side-bar">
            <Drawer sx={{ width: 200, flexShrink: 0, "& .MuiDrawer-paper": {width: 200, boxSizing: "border-box", color: "white", backgroundColor: "#A72F36", overflow: "hidden" } }} variant="permanent" anchor="left">
                <AppBar sx={{ backgroundColor: '#A72F36', color: '#000000', boxShadow: 'none' }} position="static">
                    <Box>
                        <Toolbar disableGutters sx={{ height: '80px', alignItems: 'center'}}>
                            <Typography variant="h6">
                                <Box sx={{ flex: 1, display: "flex", justifyContent: "center", overflow: "hidden", padding: "30px" }}>
                                    <img className="drawer-wild-up-events-white" src="/assets/images/wild-up-events-white.png" alt="homepage-image" style={{width: '150px'}}/>
                                </Box>
                            </Typography>
                        </Toolbar>
                        <hr style={{ width: '100%', margin: '0 auto' }}/>
                    </Box>
                </AppBar>
                <List sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <ListItem>
                        <ListItemButton component={Link} to="/admin/dashboard">
                            <ListItemText>
                                <span>DASHBOARD</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} to="/admin/users">
                            <ListItemText>
                                <span>USERS</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} to="/admin/organizers">
                            <ListItemText>
                                <span>ORGANIZERS</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} to="/admin/events">
                            <ListItemText>
                                <span>EVENTS</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} to="/admin/venues">
                            <ListItemText>
                                <span>VENUES</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <hr style={{ width: '100%', margin: '0 auto', marginTop: 'auto' }}/>
                    <ListItem>
                        <ListItemButton onClick={handleClickLogoutButton} sx={{ paddingTop: '0', paddingBottom: '0'}}>
                            <ListItemText>
                                <span>LOG OUT</span>
                            </ListItemText>
                        </ListItemButton>
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
        </div>
    );
}

export default AdminSidebar;
