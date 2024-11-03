import {Drawer, Box, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, AppBar, Link} from "@mui/material";
import React, {useEffect, useState} from "react";
import "./styles/SideBar.css";
import {useNavigate} from "react-router-dom";
import LoginModal from "./LoginModal.jsx";
import RegisterModal from "./RegisterModal.jsx";

function UserSideBar() {
    const nav = useNavigate();

    const [user, setuser] = React.useState(null);
    const [openModal, setOpenModal] = useState(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if(loggedInUser) {
            setuser(JSON.parse(loggedInUser));
        }
    }, []);

    const handleLoginLogoutButton = () => {
        if(user) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setuser(null);
            nav("/");
        }
        else{
            nav("/");
        }
    }

    const handleOpenModal = (modal) => {
        setOpenModal(modal);
    };

    const handleCloseModal = () => {
        setOpenModal(null);
    };

    return (
        <div>
            <Drawer sx={{ width: 275, flexShrink: 0, "& .MuiDrawer-paper": { width: 275, boxSizing: "border-box", color: "#FFFFFF", backgroundColor: "#C63f47", overflow: "hidden" },}} variant="permanent" anchor="left">
                <AppBar sx={{ backgroundColor: '#C63f47', color: '#000000', boxShadow: 'none' }} position="static">
                    <Box>
                        <Toolbar disableGutters sx={{ height: '105px', alignItems: 'center'}}>
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
                        <ListItemButton component={Link} to="/home">
                            <ListItemText>
                                <span>HOME</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemText>
                                <span>EVENTS</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton component={Link} to="/bookings">
                            <ListItemText>
                                <span>BOOKINGS</span>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <hr style={{ width: '100%', margin: '0 auto', marginTop: 'auto' }}/>
                    <ListItem>
                        { user ? (
                                <>
                                    <ListItemButton onClick={handleLoginLogoutButton}>
                                        <ListItemText>
                                            <span>LOG OUT</span>
                                        </ListItemText>
                                    </ListItemButton>
                                </>
                            ):
                            <>
                                <ListItemButton onClick={() => handleOpenModal('loginModal')}>
                                    <ListItemText>
                                        <span>LOG IN</span>
                                    </ListItemText>
                                </ListItemButton>
                            </>
                        }
                    </ListItem>
                </List>
            </Drawer>
            <LoginModal open={openModal === 'loginModal'} onClose={handleCloseModal} switchModal={() => handleOpenModal('registerModal')} propSetUser={setuser}/>
            <RegisterModal open={openModal === 'registerModal'} onClose={handleCloseModal} switchModal={() => handleOpenModal('loginModal')} label={"Register"}/>
        </div>
    );
}

export default UserSideBar;
