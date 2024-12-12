import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    AppBar
} from "@mui/material";
import React, {useState} from "react";
import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../../utils/AuthContext.jsx";
import ConfirmDialog from "../ConfirmDialog.jsx";
import { Link } from "react-router-dom";

function OrganizerSidebar() {
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

    return (
        <div>
            <Drawer sx={{ width: 200, flexShrink: 0, "& .MuiDrawer-paper": {width: 200, boxSizing: "border-box", color: "white", backgroundColor: "#C63f47", overflow: "hidden" } }} variant="permanent" anchor="left">
                <AppBar sx={{ backgroundColor: '#C63f47', color: '#000000', boxShadow: 'none' }} position="static">
                    <Box>
                        <Toolbar disableGutters sx={{ height: '80px', alignItems: 'center'}}>
                            <Typography variant="h6">
                                <Box sx={{ flex: 1, display: "flex", justifyContent: "center", overflow: "hidden", padding: "30px" }}>
                                    <Link to="/">
                                        <img className="drawer-wild-up-events-white" src="/assets/images/wild-up-events-white.png" alt="homepage-image" style={{width: '150px'}}/>
                                    </Link>
                                </Box>
                            </Typography>
                        </Toolbar>
                        <hr style={{ width: '100%', margin: '0 auto' }}/>
                    </Box>
                </AppBar>
                <List sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <ListItem>
                        <ListItemButton component={Link} to="/organizer/dashboard">
                            <ListItemText>
                                <span>DASHBOARD</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} to="/organizer/events">
                            <ListItemText>
                                <span>MY EVENTS</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} to="/organizer/bookings">
                            <ListItemText>
                                <span>BOOKINGS</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} to="/organizer/tickets">
                            <ListItemText>
                                <span>MY TICKETS</span>
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

export default OrganizerSidebar;
