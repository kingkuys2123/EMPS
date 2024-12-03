import React, { useState, useEffect } from "react";
import { Typography,Tabs, Tab, Zoom,Fab, Box, Modal, Grid, TextField  } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import AdminSidebar from "../admin_pages/AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import './styles/venue.css';
import ViewVenue from "../admin_pages/ViewVenue.jsx";
import AddVenue from "../admin_pages/AddVenue.jsx";
import VenueService from '../../services/VenueService.jsx';


function AdminVenue() {
    const [openModal, setOpenModal] = useState(false);
    const [venue, setVenues] = useState({ name: '', address: '', capacity: '', description: '' });
    const [searchTerm, setSearchTerm] = useState(""); 
    const [filter, setFilter] = useState(""); 

    const loadVenues = async () => {
        try {
            const data = await VenueService.getAllVenue();
            setVenues(data);
            return data;
        } catch (error) {
        }
    };

    useEffect(() => {

        loadVenues();
    }, []);

   const refreshData = loadVenues;

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
                    
                            <Box spacing={2} sx={{display: "flex",justifyContent: "flex-end",marginBottom: "20px",}}>
                            <Box xs={6}>
                            <TextField
                                label="Search by Name"
                                variant="outlined"
                                sx={{width: "500px" }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                             />
                             </Box>
                            
                                    
                                </Box>
                                
                            <Box sx={{
                                backgroundColor: "#fff", 
                                borderRadius: "15px",     
                                padding: "20px",          
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                  
                            }}>
                            <ViewVenue refreshData={refreshData} searchTerm={searchTerm} filter={filter}/>
                            
                        </Box>

                        <Zoom
                                in={true}
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
                                 <AddVenue onClose={handleCloseModal} refreshData={refreshData} />
                            </Box>
                        </Modal>
                    </Box>

                </Box>
            </Box>
        </div>
    );
}

export default AdminVenue;
