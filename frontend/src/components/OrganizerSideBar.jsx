import {Drawer, Box, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, AppBar} from "@mui/material";
import React, {useEffect, useState} from "react";
import "./styles/SideBar.css";
import {useNavigate} from "react-router-dom";

function UserSideBar() {
    const nav = useNavigate();

    const handleLogOutButton = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        nav("/home");
    }

    return (
        <div>
            <Drawer sx={{ width: 200, flexShrink: 0, "& .MuiDrawer-paper": {width: 200, boxSizing: "border-box", color: "white", backgroundColor: "#C63f47", overflow: "hidden" } }} variant="permanent" anchor="left">
                <AppBar sx={{ backgroundColor: '#C63f47', color: '#000000', boxShadow: 'none' }} position="static">
                    <Box>
                        <Toolbar disableGutters sx={{ height: '80px', alignItems: 'center'}}>
                            <Typography variant="h6">
                                <Box sx={{ flex: 1, display: "flex", justifyContent: "center", overflow: "hidden", padding: "30px" }}>
                                    <img className="drawer-wild-up-events-white" src="/assets/images/wild-up-events-white.png" alt="homepage-image"/>
                                </Box>
                            </Typography>
                        </Toolbar>
                        <hr style={{ width: '100%', margin: '0 auto' }}/>
                    </Box>
                </AppBar>
                <List sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <ListItem>
                        <ListItemButton>
                            <ListItemText>
                                <span>DASHBOARD</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemText>
                                <span>MY EVENTS</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <hr style={{ width: '100%', margin: '0 auto', marginTop: 'auto' }}/>
                    <ListItem>
                        <ListItemButton onClick={handleLogOutButton} sx={{ paddingTop: '0', paddingBottom: '0'}}>
                            <ListItemText>
                                <span>LOG OUT</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}

export default UserSideBar;
