import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Container, Box, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import EventIcon from '@mui/icons-material/Event';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import AnalyticsIcon from '@mui/icons-material/Analytics';

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
                <AppBar sx={{backgroundColor: '#C63f47', boxShadow: 'none'}} position="static">
                    <Container maxWidth="xl">
                        <Toolbar disableGutters sx={{paddingLeft: "8px", paddingRight: '25px'}}>
                            <Typography className="project-name" variant="h6" component="div"
                                        sx={{flexGrow: 1, marginLeft: 2}}>
                                <Box sx={{flex: 1, display: 'flex', justifyContent: 'left'}}>
                                    <img className="landing-page-wild-up-events-white"
                                         src='/assets/images/wild-up-events-white.png' alt="homepage-image"
                                         style={{width: '150px'}}/>
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
                        minHeight: '91vh',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'left'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: {xs: 'column', md: 'row'},
                            spacing: 2,
                            alignContent: 'center'
                        }}>
                            <Box sx={{
                                flex: 1,
                                padding: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                textAlign: 'left'
                            }}>
                                <Typography variant="h4" gutterBottom>
                        <span>
                            {currentUser ? (
                                <>
                                    Welcome back to the
                                    <span style={{color: '#EDBC41'}}>
                                        <strong> Wild-Up Events</strong>
                                    </span>!
                                </>
                            ) : (
                                <>
                                    Welcome to the
                                    <span style={{color: '#EDBC41'}}>
                                        <strong> Wild-Up Events</strong>
                                    </span>!
                                </>
                            )}
                            <br/>
                        </span>
                                </Typography>
                                <Typography variant="h5" sx={{textAlign: 'justify', marginTop: '10px'}} gutterBottom>
                                    <span>Your one-stop solution for campus-based events.</span>
                                </Typography>
                                <Typography variant="h5" sx={{textAlign: 'justify', marginTop: '10px'}}>
                                    <span>Whether you're organizing an exciting acquaintance party, a memorable prom night, a captivating talent show, or any other school gathering, our platform is designed to make your event planning effortless.</span>
                                </Typography>
                                <Link to="/home" style={{textDecoration: 'none'}}>
                                    <Box sx={{marginTop: '30px', width: '100%'}}>
                                    <Button variant="contained" id='get-started-btn' sx={{
                                            backgroundColor: '#C63f47',
                                            borderRadius: '0',
                                            width: '100%',
                                            height: '55px'
                                        }}>
                                <span>
                                    {currentUser ? (
                                        <>
                                            Continue
                                        </>
                                    ) : (
                                        <>
                                            Get Started
                                        </>
                                    )}
                                </span>
                                        </Button>
                                    </Box>
                                </Link>
                            </Box>
                            <Box sx={{
                                flex: 1,
                                marginLeft: 5,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Carousel showThumbs={false} autoPlay infiniteLoop>
                                    <div>
                                        <img src="/assets/images/landing-page-image-car-1.jpg" alt="carousel-1"
                                             style={{borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'}}/>
                                    </div>
                                    <div>
                                        <img src="/assets/images/landing-page-image-car-2.jpg" alt="carousel-2"
                                             style={{borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'}}/>
                                    </div>
                                    <div>
                                        <img src="/assets/images/landing-page-image-car-3.jpg" alt="carousel-3"
                                             style={{borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'}}/>
                                    </div>
                                </Carousel>
                            </Box>
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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', md: 'row'},
                        spacing: 2,
                        alignContent: 'center'
                    }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <Box sx={{textAlign: 'center', padding: 2}}>
                                    <EventIcon sx={{fontSize: 50, color: '#C63f47'}}/>
                                    <Typography variant="h6">Easy Event Planning</Typography>
                                    <Typography variant="body1">Plan your events effortlessly with our intuitive
                                        tools.</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{textAlign: 'center', padding: 2}}>
                                    <BookOnlineIcon sx={{fontSize: 50, color: '#C63f47'}}/>
                                    <Typography variant="h6">Easy Booking</Typography>
                                    <Typography variant="body1">Streamline your booking process with a seamless
                                        system.</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{textAlign: 'center', padding: 2}}>
                                    <AnalyticsIcon sx={{fontSize: 50, color: '#C63f47'}}/>
                                    <Typography variant="h6">Comprehensive Analytics</Typography>
                                    <Typography variant="body1">Get detailed insights and analytics for your
                                        events.</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{textAlign: 'center', padding: 2}}>
                                    <ReadMoreIcon sx={{fontSize: 50, color: '#C63f47'}}/>
                                    <Typography variant="h6">More Features</Typography>
                                    <Typography variant="body1">Discover additional tools to make your event
                                        extraordinary.</Typography>
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

export default LandingPage;