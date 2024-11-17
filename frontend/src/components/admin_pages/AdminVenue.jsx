import React, { useState, useEffect } from "react";
import { Typography,Tabs, Tab, Zoom,Fab, Box, Modal  } from "@mui/material";
import { TabContext, TabPanel } from '@mui/lab';
import AddIcon from "@mui/icons-material/Add";

import AdminSidebar from "../admin_pages/AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import './styles/venue.css';
import ViewVenue from "../admin_pages/ViewVenue.jsx";
import AddVenue from "../admin_pages/AddVenue.jsx";


function AdminVenue() {
    const [value, setValue] = React.useState('one');
    const [openModal, setOpenModal] = useState(false);

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
      };

      const transitionDuration = {
        enter: 500,
        exit: 300,
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };



    return (
        <div className="template-page">
            <Box sx={{ display: "flex", width: "100%" }}>
                <AdminSidebar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
                    <CustomAppBar title={"Venue"}/>
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Typography variant="body1" component="div">
                        <TabContext value={value}>
                            <Tabs value={value}
                                onChange={handleChangeTab}
                                >
                                <Tab value="one"
                                    label="View Venue"
                                    wrapped
                                    sx={{
                                        backgroundColor: value === "one" ? "#fff" : "#f4f4f4",
                                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
                                        borderTopLeftRadius: "10px", 
                                        borderTopRightRadius: "10px",
                                    }}>
                                </Tab>
                                <Tab value="two"
                                    label="Pending Booking Request"
                                    wrapped
                                   sx={{
                                    backgroundColor: value === "two" ? "#fff" : "#f4f4f4", 
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
                                    borderTopLeftRadius: "10px", 
                                    borderTopRightRadius: "10px",
                                }}>
                                </Tab>
                            </Tabs>
                            <TabPanel value="one" sx={{
                                backgroundColor: "#fff", 
                                borderRadius: "15px",     
                                padding: "20px",          
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                borderTopLeftRadius: "0px",  
                            }}>
                            <ViewVenue />
                            </TabPanel>
                            <TabPanel value="two" sx={{
                                backgroundColor: "#fff", 
                                borderRadius: "15px",     
                                padding: "20px",          
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                borderTopLeftRadius: "0px",  
                            }}>
                                Pending Bookings
                            </TabPanel>
                        </TabContext>

                        <Zoom
                                in={value === "one"}
                                timeout={transitionDuration}
                                unmountOnExit
                            >
                            <Fab sx = {{position: 'absolute', bottom: 16, right: 16,backgroundColor: '#A72F36','&:hover': {backgroundColor: '#8C232A'},}} aria-label='Add' color='primary' onClick={handleOpenModal}>
                                <AddIcon />
                            </Fab>
                        </Zoom>
                        </Typography>
                        <Modal open={openModal} onClose={handleCloseModal} className="mod">
                            <Box className="updateBox">
                                <AddVenue onClose={handleCloseModal} /> 
                            </Box>
                        </Modal>
                    </Box>

                </Box>
            </Box>
        </div>
    );
}

export default AdminVenue;
