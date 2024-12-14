import React, { useState, useEffect, useCallback } from "react";
import { Typography, Box, Modal, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import AdminSidebar from "../admin_pages/AdminSidebar.jsx";
import CustomAppBar from "../CustomAppBar.jsx";
import './styles/venue.css';
import ViewVenue from "../admin_pages/ViewVenue.jsx";
import AddVenue from "../admin_pages/AddVenue.jsx";
import VenueService from '../../services/VenueService.jsx';

import { getAuth } from "../../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function AdminVenue() {
    const nav = useNavigate();
    const { currentUser } = getAuth();

    const [openModal, setOpenModal] = useState(false);
    const [venues, setVenues] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const loadVenues = useCallback(async () => {
        try {
            const data = await VenueService.getAllVenue();
            setVenues(data);
            return data;
        } catch (error) {
            console.error("Error loading venues:", error);
        }
    }, []);

    useEffect(() => {
        if (!currentUser) {
            nav('/');
        } else if (currentUser.accountType === "user") {
            nav('/home');
        } else if (currentUser.accountType === "organizer") {
            nav('/organizer/dashboard');
        }
    }, [currentUser, nav]);

    useEffect(() => {
        loadVenues();
    }, [loadVenues]);

    const handleOpenModal = () => setOpenModal(true);

    const handleCloseModal = () => setOpenModal(false);

    return (
        <div className="template-page">
            <Box sx={{ display: "flex", width: "100%" }}>
                <AdminSidebar />

                <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#F3F3F3", width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
                    <CustomAppBar title={"Venue"} />
                    <Box sx={{ flexGrow: 1, padding: "25px", backgroundColor: "#F3F3F3" }}>
                        <Typography variant="body1" component="div">
                            <Box spacing={2} sx={{ display: "flex", marginBottom: "20px" }}>
                                <Button
                                    sx={{ backgroundColor: '#A72F36', color: '#FFFFFF', padding: '10px 20px' }}
                                    className="btnadd"
                                    onClick={handleOpenModal}
                                >
                                    <AddIcon /> Add Venue
                                </Button>
                                <Modal open={openModal} onClose={handleCloseModal} className="mod">
                                    <Box className="updateBox">
                                        <AddVenue onClose={handleCloseModal} refreshData={loadVenues} />
                                    </Box>
                                </Modal>
                                <Box className="filter" sx={{ marginLeft: "auto" }}>
                                    <TextField
                                        label="Search by venue name..."
                                        variant="outlined"
                                        sx={{ width: "500px" }}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    backgroundColor: "#fff",
                                    borderRadius: "15px",
                                    padding: "20px",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <ViewVenue refreshData={loadVenues} searchTerm={searchTerm} />
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default AdminVenue;
