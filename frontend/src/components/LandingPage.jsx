import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Container, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

import LoginModal from "./LoginModal.jsx";
import RegisterModal from "./RegisterModal.jsx";
import { getAuth } from '../utils/AuthContext.jsx';

import './styles/LandingPage.css';
import './styles/FontStyle.css';
import ConfirmDialog from "./ConfirmDialog.jsx";

function LandingPage() {
    const { currentUser, setCurrentUser } = getAuth();

    const [openModal, setOpenModal] = useState(null);
    const [registerModalLabel, setRegisterModalLabel] = useState("Register");

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

    const handleOpenModal = (modal, event) => {
        setOpenModal(modal);
        if (event?.target.id === 'get-started-btn') {
            setRegisterModalLabel("Get Started");
        } else {
            setRegisterModalLabel('Register');
        }
    };

    const handleLogout = () => {
        if (currentUser) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setCurrentUser(null);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(null);
    };

    return (
        <div className="landing-page">
            <header>
                <AppBar sx={{ backgroundColor: '#C63f47', boxShadow: 'none' }} position="static">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters sx={{ paddingLeft: "8px", paddingRight: '25px' }}>
                            <Typography className="project-name" variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: 2 }}>
                                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'left' }}>
                                    <img className="landing-page-wild-up-events-white" src='/assets/images/wild-up-events-white.png' alt="homepage-image" style={{ width: '150px' }} />
                                </Box>
                            </Typography>
                            { !currentUser ? (
                                <>
                                    <Button variant="text" onClick={(event) => handleOpenModal('loginModal', event)} sx={{ marginRight: 2, borderRadius: '0px', textTransform: 'none' }}>
                                        <Typography color="white">
                                            <span>Login</span>
                                        </Typography>
                                    </Button>
                                    <Button variant="contained" onClick={(event) => handleOpenModal('registerModal', event)} sx={{ backgroundColor: "white", width: "125px", borderRadius: '0px', textTransform: 'none' }}>
                                        <Typography color="#9D182D">
                                            <span>Register</span>
                                        </Typography>
                                    </Button>
                                </>
                            ) : (
                                <Button variant="text" onClick={handleClickLogoutButton} sx={{ marginRight: 2, borderRadius: '0px', textTransform: 'none' }}>
                                    <Typography color="white">
                                        <span>Log Out</span>
                                    </Typography>
                                </Button>
                            )}
                        </Toolbar>
                    </Container>
                </AppBar>
            </header>

            <main>
                <Container maxWidth="xl" sx={{ minHeight: '91vh', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, spacing: 2, alignContent: 'center' }}>
                        <Box sx={{ flex: 1, padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                            <Typography variant="h4" gutterBottom>
                                <span>
                                    { currentUser ? (
                                        <>
                                            Welcome back to the
                                        </>
                                    ):(
                                        <>
                                            Welcome to the
                                        </>
                                    )}
                                    <br />
                                    <span style={{ color: '#EDBC41' }}>
                                        <strong>Event Management and Planner System</strong>
                                    </span>!
                                </span>
                            </Typography>
                            <Typography variant="h5" sx={{ textAlign: 'justify', marginTop: '10px' }} gutterBottom>
                                <span>Your one-stop solution for events.</span>
                            </Typography>
                            <Typography variant="h5" sx={{ textAlign: 'justify', marginTop: '10px' }}>
                                <span>Whether you are planning a small gathering, a corporate event, or a grand wedding, our system provides you with the tools and features you need to ensure everything runs smoothly.</span>
                            </Typography>
                            <Link to="/home" style={{ textDecoration: 'none' }}>
                                <Box sx={{ marginTop: '30px', width: '100%' }}>
                                    <Button variant="contained" id='get-started-btn' sx={{ backgroundColor: '#C63f47', borderRadius: '0', width: '100%', height: '55px' }}>
                                        <span>
                                            { currentUser ? (
                                                <>
                                                    Continue
                                                </>
                                            ):(
                                                <>
                                                    Get Started
                                                </>
                                            )}
                                        </span>
                                    </Button>
                                </Box>
                            </Link>
                        </Box>
                        <Box sx={{ flex: 1, marginLeft: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img className="emps-logo" src='/assets/images/landing-page-image.png' alt="homepage-image" />
                        </Box>
                    </Box>
                </Container>
            </main>

            <ConfirmDialog
                openDialog={openConfirmLogoutDialog}
                setOpenDialog={setOpenConfirmLogoutDialog}
                onClose={handleConfirmLogoutDialogClose}
                message={"Are you sure you want to log out?"}
                title={"Confirm Logout"}
            />

            <LoginModal open={openModal === 'loginModal'} onClose={handleCloseModal} switchModal={() => handleOpenModal('registerModal')} />
            <RegisterModal open={openModal === 'registerModal'} onClose={handleCloseModal} switchModal={() => handleOpenModal('loginModal')} label={registerModalLabel} />
        </div>
    );
}

export default LandingPage;
