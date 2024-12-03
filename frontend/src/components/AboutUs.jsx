import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Container, Box, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal.jsx";
import RegisterModal from "./RegisterModal.jsx";
import { getAuth } from '../utils/AuthContext.jsx';
import ConfirmDialog from "./ConfirmDialog.jsx";

import './styles/LandingPage.css';
import './styles/FontStyle.css';

function AboutUs() {
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

    const handleCloseModal = () => {
        setOpenModal(null);
    };

    const handleLogout = () => {
        if (currentUser) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setCurrentUser(null);
        }
    };

    return (
        <div className="about-us-page">
            <header>
                <AppBar sx={{backgroundColor: '#C63f47', boxShadow: 'none'}} position="static">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters sx={{paddingLeft: "8px", paddingRight: '25px'}}>
                            <Typography className="project-name" variant="h6" component="div"
                                        sx={{flexGrow: 1, marginLeft: 2}}>
                                <Box sx={{flex: 1, display: 'flex', justifyContent: 'left'}}>
                                    <Link to="/" style={{textDecoration: 'none', color: 'white'}}>
                                        <img className="about-us-logo" src='/assets/images/wild-up-events-white.png'
                                             alt="homepage-image" style={{width: '150px'}}/>
                                    </Link>
                                </Box>
                            </Typography>
                            {!currentUser ? (
                                <>
                                    <Button variant="text" onClick={(event) => handleOpenModal('loginModal', event)}
                                            sx={{marginRight: 2, borderRadius: '0px', textTransform: 'none'}}>
                                        <Typography color="white">
                                            <span>Login</span>
                                        </Typography>
                                    </Button>
                                    <Button variant="contained"
                                            onClick={(event) => handleOpenModal('registerModal', event)} sx={{
                                        backgroundColor: "white",
                                        width: "125px",
                                        borderRadius: '0px',
                                        textTransform: 'none'
                                    }}>
                                        <Typography color="#9D182D">
                                            <span>Register</span>
                                        </Typography>
                                    </Button>
                                </>
                            ) : (
                                <Button variant="text" onClick={handleClickLogoutButton}
                                        sx={{marginRight: 2, borderRadius: '0px', textTransform: 'none'}}>
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
                <Box sx={{width: '100%', backgroundColor: '#F3F3F3'}}>
                    <Container maxWidth="xl" sx={{
                        minHeight: '51vh',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        textAlign: 'left'
                    }}>
                        <Box sx={{padding: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                            <Typography variant="h4" gutterBottom>
                                <span>About Us</span>
                            </Typography>
                            <Typography variant="body1" sx={{textAlign: 'justify', marginTop: '10px'}}>
                                <span>Welcome to Wild-Up Events, your ultimate solution for managing and participating in campus events. We understand the challenges students face with current booking and ticketing systems, which often lead to frustration and missed opportunities.</span>
                            </Typography>
                            <Typography variant="body1" sx={{textAlign: 'justify', marginTop: '10px'}}>
                                <span>Our platform is designed to streamline the event management process, offering an intuitive user interface for easy event booking and multiple integrated payment options. Organizers can efficiently manage events, track attendees, and gather valuable feedback.</span>
                            </Typography>
                            <Typography variant="body1" sx={{textAlign: 'justify', marginTop: '10px'}}>
                                <span>With comprehensive analytics, organizers can make informed decisions to enhance attendee engagement and improve future events. Wild-Up Events aims to increase student participation and create a vibrant campus community through well-organized and successful events.</span>
                            </Typography>
                            <Typography variant="body1" sx={{textAlign: 'justify', marginTop: '10px'}}>
                                <span>Thank you for choosing Wild-Up Events. We look forward to helping you create memorable and efficient campus events.</span>
                            </Typography>
                        </Box>
                        <Box sx={{padding: 2, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src="/assets/images/about-us-image-1.png" alt="About Us" style={{borderRadius: '10px', maxWidth: '100%', height: 'auto'}} />
                        </Box>
                    </Container>
                </Box>
                <Container maxWidth="xl" sx={{
                    minHeight: '41vh',
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'left'
                }}>
                    <Box sx={{ padding: 2 }}>
                        <Grid container spacing={2}>
                            {/* Developer 1 */}
                            <Grid item xs={12} md={2.4}>
                                <Box sx={{ textAlign: 'center', padding: 2 }}>
                                    <img
                                        src="/assets/images/developers/developer-busarang.png"
                                        alt="developer-1"
                                        style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                                    />
                                    <Typography variant="h6" sx={{ marginTop: 1 }}>Busarang, Renee Kiara</Typography>
                                </Box>
                            </Grid>

                            {/* Developer 2 */}
                            <Grid item xs={12} md={2.4}>
                                <Box sx={{ textAlign: 'center', padding: 2 }}>
                                    <img
                                        src="/assets/images/developers/developer-dakay.png"
                                        alt="developer-2"
                                        style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                                    />
                                    <Typography variant="h6" sx={{ marginTop: 1 }}>Dakay, Miguel Antonio</Typography>
                                </Box>
                            </Grid>

                            {/* Developer 3 */}
                            <Grid item xs={12} md={2.4}>
                                <Box sx={{ textAlign: 'center', padding: 2 }}>
                                    <img
                                        src="/assets/images/developers/developer-dollano.png"
                                        alt="developer-3"
                                        style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                                    />
                                    <Typography variant="h6" sx={{ marginTop: 1 }}>Dollano, Jericho Sam</Typography>
                                </Box>
                            </Grid>

                            {/* Developer 4 */}
                            <Grid item xs={12} md={2.4}>
                                <Box sx={{ textAlign: 'center', padding: 2 }}>
                                    <img
                                        src="/assets/images/developers/developer-hortezano.png"
                                        alt="developer-4"
                                        style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                                    />
                                    <Typography variant="h6" sx={{ marginTop: 1 }}>Hortezano, Abram John</Typography>
                                </Box>
                            </Grid>

                            {/* Developer 5 */}
                            <Grid item xs={12} md={2.4}>
                                <Box sx={{ textAlign: 'center', padding: 2 }}>
                                    <img
                                        src="/assets/images/developers/developer-quitco.png"
                                        alt="developer-5"
                                        style={{ borderRadius: '50%', width: '100px', height: '100px' }}
                                    />
                                    <Typography variant="h6" sx={{ marginTop: 1 }}>Quitco, Kyle Matthew</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </main>

            <footer>
                <Box sx={{
                    backgroundColor: '#C63f47',
                    color: 'white',
                    padding: '5px',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Container maxWidth="xl">
                        <Box sx={{
                            backgroundColor: '#C63f47',
                            color: 'white',
                            padding: '20px',
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Typography variant="body1">©2024. Irregularities. All Rights Reserved...</Typography>
                            <Link to="/about_us" style={{textDecoration: 'none', color: 'white'}}>
                                <Typography variant="body1">About Us</Typography>
                            </Link>
                        </Box>
                    </Container>
                </Box>
            </footer>

            <ConfirmDialog
                openDialog={openConfirmLogoutDialog}
                setOpenDialog={setOpenConfirmLogoutDialog}
                onClose={handleConfirmLogoutDialogClose}
                message={"Are you sure you want to log out?"}
                title={"Confirm Logout"}
            />

            <LoginModal open={openModal === 'loginModal'} onClose={handleCloseModal}
                        switchModal={() => handleOpenModal('registerModal')}/>
            <RegisterModal open={openModal === 'registerModal'} onClose={handleCloseModal}
                           switchModal={() => handleOpenModal('loginModal')} label={registerModalLabel}/>
        </div>
    );
}

export default AboutUs;